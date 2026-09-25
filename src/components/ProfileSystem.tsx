import { useState } from "react";
import { X } from "lucide-react";
import { useAccent } from "../hooks/useAccent";
import NeoScholar from "./avatars/NeoScholar";
import SakuraFocus from "./avatars/SakuraFocus";
import VoltLogic from "./avatars/VoltLogic";
import AstraThinker from "./avatars/AstraThinker";
import GuardianAI from "./avatars/GuardianAI";
import CanvasCreator from "./avatars/CanvasCreator";
import ChronoPlanner from "./avatars/ChronoPlanner";
import ZenMindful from "./avatars/ZenMindful";

export interface UserProfile {
  avatarId: string;
  name: string;
  accentColor: string;
  bio: string;
  joinDate: number;
  streak: number;
}

const AVATARS = [
  { id: "neo", name: "NeoScholar", component: NeoScholar, defaultColor: "#06b6d4" },
  { id: "sakura", name: "SakuraFocus", component: SakuraFocus, defaultColor: "#ec4899" },
  { id: "volt", name: "VoltLogic", component: VoltLogic, defaultColor: "#fbbf24" },
  { id: "astra", name: "AstraThinker", component: AstraThinker, defaultColor: "#a78bfa" },
  { id: "guardian", name: "GuardianAI", component: GuardianAI, defaultColor: "#22c55e" },
  { id: "canvas", name: "CanvasCreator", component: CanvasCreator, defaultColor: "#f97316" },
  { id: "chrono", name: "ChronoPlanner", component: ChronoPlanner, defaultColor: "#0ea5e9" },
  { id: "zen", name: "ZenMindful", component: ZenMindful, defaultColor: "#10b981" },
];

const COLOR_PRESETS = ["#06b6d4", "#ec4899", "#fbbf24", "#a78bfa", "#22c55e", "#f97316", "#0ea5e9", "#10b981"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export default function ProfileSystem({ isOpen, onClose, profile, onSave }: Props) {
  const { setColor: setAccentColor } = useAccent();
  const [avatarId, setAvatarId] = useState(profile.avatarId);
  const [name, setName] = useState(profile.name);
  const [accentColor, setAccentColorLocal] = useState(profile.accentColor);
  const [bio, setBio] = useState(profile.bio);

  const selectedAvatar = AVATARS.find(a => a.id === avatarId);
  const AvatarComponent = selectedAvatar?.component;

  const handleColorChange = (color: string) => {
    setAccentColorLocal(color);
    setAccentColor(color);
  };

  const handleSave = () => {
    onSave({
      avatarId,
      name: name || "Student",
      accentColor,
      bio,
      joinDate: profile.joinDate,
      streak: profile.streak,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 gap-6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-400">Customize Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Avatar Preview & Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Avatar</h3>

          {/* Preview */}
          <div className="flex justify-center">
            {AvatarComponent && (
              <div className="w-40 h-40 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-4 border border-white/20">
                <AvatarComponent accentColor={accentColor} />
              </div>
            )}
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setAvatarId(avatar.id)}
                className={`p-3 rounded-xl transition-all ${
                  avatarId === avatar.id
                    ? "bg-cyan-500/20 border border-cyan-400 scale-105"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="w-full h-16 mb-2">
                  <avatar.component accentColor={avatar.defaultColor} />
                </div>
                <p className="text-xs text-slate-400 truncate text-center">{avatar.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* Accent Color Wheel */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Accent Color</label>
          <div className="grid grid-cols-8 gap-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-full aspect-square rounded-lg transition-all ${
                  accentColor === color
                    ? "scale-110 ring-2 ring-offset-2 ring-offset-slate-900 ring-cyan-400"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Bio Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none h-20"
          />
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="text-center">
            <p className="text-xs text-slate-500">Joined</p>
            <p className="text-sm font-semibold text-cyan-400">
              {new Date(profile.joinDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Streak</p>
            <p className="text-sm font-semibold text-violet-400">{profile.streak} days</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Level</p>
            <p className="text-sm font-semibold text-green-400">
              {Math.floor(profile.streak / 7) + 1}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-violet-500/30 transition-all font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
