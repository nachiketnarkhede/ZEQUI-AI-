import { useState, useCallback } from "react";
import { type UserProfile } from "../components/ProfileSystem";

const PROFILE_KEY = "zequi_profile";

const DEFAULT_PROFILE: UserProfile = {
  avatarId: "neo",
  name: "Student",
  accentColor: "#06b6d4",
  bio: "Learning with ZEQUI",
  joinDate: Date.now(),
  streak: 0,
};

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const setProfile = useCallback((newProfile: UserProfile) => {
    setProfileState(newProfile);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    } catch {
      console.warn("Failed to save profile");
    }
  }, []);

  const updateStreak = useCallback((newStreak: number) => {
    setProfile({ ...profile, streak: newStreak });
  }, [profile, setProfile]);

  return { profile, setProfile, updateStreak };
}
