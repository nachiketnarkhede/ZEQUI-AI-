import { useCallback, useEffect, useState } from "react";
import { type UserProfile } from "../components/ProfileSystem";
import { supabase } from "../lib/supabase";

const PROFILE_KEY = "zequi_profile";

const DEFAULT_PROFILE: UserProfile = {
  avatarId: "neo",
  name: "Student",
  accentColor: "#06b6d4",
  bio: "Learning with ZEQUI",
  joinDate: Date.now(),
  streak: 0,
};

function readLocalProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile>(readLocalProfile);

  const persistLocal = useCallback((nextProfile: UserProfile) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
    } catch {
      console.warn("Failed to save local profile");
    }
  }, []);

  const syncFromCloud = useCallback(async () => {
    if (!supabase) return;
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_id, accent_color, bio, join_date, streak")
      .eq("id", sessionData.session.user.id)
      .maybeSingle();

    if (error || !data) return;

    const nextProfile: UserProfile = {
      avatarId: data.avatar_id || DEFAULT_PROFILE.avatarId,
      name: data.display_name || DEFAULT_PROFILE.name,
      accentColor: data.accent_color || DEFAULT_PROFILE.accentColor,
      bio: data.bio || DEFAULT_PROFILE.bio,
      joinDate: Number(data.join_date) || DEFAULT_PROFILE.joinDate,
      streak: Number(data.streak) || 0,
    };

    setProfileState(nextProfile);
    persistLocal(nextProfile);
  }, [persistLocal]);

  useEffect(() => {
    void syncFromCloud();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange(() => void syncFromCloud());
    return () => data.subscription.unsubscribe();
  }, [syncFromCloud]);

  const setProfile = useCallback((newProfile: UserProfile) => {
    setProfileState(newProfile);
    persistLocal(newProfile);

    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) return;
      void supabase.from("profiles").upsert({
        id: userId,
        display_name: newProfile.name,
        avatar_id: newProfile.avatarId,
        accent_color: newProfile.accentColor,
        bio: newProfile.bio,
        join_date: newProfile.joinDate,
        streak: newProfile.streak,
      }, { onConflict: "id" });
    });
  }, [persistLocal]);

  const updateStreak = useCallback((newStreak: number) => {
    setProfile({ ...profile, streak: newStreak });
  }, [profile, setProfile]);

  return { profile, setProfile, updateStreak };
}
