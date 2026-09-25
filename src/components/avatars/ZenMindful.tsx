interface AvatarProps {
  accentColor?: string;
}

export default function ZenMindful({ accentColor = "#10b981" }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="zen-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#d1fae5", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#a7f3d0", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="zen-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#065f46", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#064e3b", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="zen-robe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#d1fae5", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#a7f3d0", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="zen-chakra" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: accentColor, stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      {/* Meditation Aura Pulse */}
      <circle cx="100" cy="130" r="60" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.3">
        <animate attributeName="r" from="50" to="70" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0.1" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="130" r="40" fill="none" stroke={accentColor} strokeWidth="0.8" opacity="0.4">
        <animate attributeName="r" from="35" to="55" dur="3s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" from="0.6" to="0.1" dur="3s" repeatCount="indefinite" begin="1s" />
      </circle>

      {/* Head */}
      <circle cx="100" cy="70" r="42" fill="url(#zen-skin)" stroke={accentColor} strokeWidth="1" opacity="0.2" />

      {/* Hair - calm and natural flowing */}
      <g fill="url(#zen-hair)">
        <path d="M 62 52 Q 58 72 65 108 L 75 110 Q 72 78 76 50 Z" />
        <path d="M 138 52 Q 142 72 135 108 L 125 110 Q 128 78 124 50 Z" />
        <ellipse cx="100" cy="48" rx="36" ry="20" fill="url(#zen-hair)" />
      </g>

      {/* Hair strand details - flowing */}
      <path d="M 72 55 Q 78 85 82 120" stroke={accentColor} strokeWidth="0.8" opacity="0.25" fill="none" strokeLinecap="round" />
      <path d="M 128 55 Q 122 85 118 120" stroke={accentColor} strokeWidth="0.8" opacity="0.25" fill="none" strokeLinecap="round" />

      {/* Lotus motif hair accessory - accent */}
      <g>
        <circle cx="100" cy="48" r="10" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.55" />
        <circle cx="90" cy="40" r="2.5" fill={accentColor} opacity="0.6" />
        <circle cx="110" cy="40" r="2.5" fill={accentColor} opacity="0.6" />
        <circle cx="90" cy="56" r="2.5" fill={accentColor} opacity="0.6" />
        <circle cx="110" cy="56" r="2.5" fill={accentColor} opacity="0.6" />
        <circle cx="100" cy="52" r="2" fill={accentColor} opacity="0.4" />
      </g>

      {/* Eyes - serene and closed */}
      <g>
        <path d="M 76 70 Q 79 73 82 70" stroke="#047857" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M 118 70 Q 121 73 124 70" stroke="#047857" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Peaceful smile - gentle */}
      <path d="M 86 87 Q 100 91 114 87" stroke="#1a202c" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />

      {/* Neck */}
      <rect x="88" y="104" width="24" height="16" fill="url(#zen-skin)" />

      {/* Body - meditation robes */}
      <path d="M 50 120 Q 48 160 62 192 L 138 192 Q 152 160 150 120 Z" fill="url(#zen-robe)" stroke={accentColor} strokeWidth="2.5" />

      {/* Center line - robe symmetry */}
      <line x1="100" y1="120" x2="100" y2="192" stroke={accentColor} strokeWidth="1.2" opacity="0.25" />

      {/* Heart chakra - center accent */}
      <g>
        <circle cx="100" cy="158" r="16" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.55" />
        <circle cx="100" cy="158" r="9" fill={accentColor} opacity="0.3" />
        <path d="M 100 150 L 108 158 L 100 166 L 92 158 Z" fill={accentColor} opacity="0.5" stroke={accentColor} strokeWidth="1" />
      </g>

      {/* Robe folds - gentle vertical lines */}
      <line x1="68" y1="130" x2="65" y2="190" stroke={accentColor} strokeWidth="0.8" opacity="0.15" />
      <line x1="132" y1="130" x2="135" y2="190" stroke={accentColor} strokeWidth="0.8" opacity="0.15" />

      {/* Arms - meditative mudra */}
      <g fill="url(#zen-hair)">
        <path d="M 44 128 Q 30 148 35 185" stroke="url(#zen-hair)" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d="M 156 128 Q 170 148 165 185" stroke="url(#zen-hair)" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.9" />
      </g>

      {/* Hand mudra accents - accent color */}
      <circle cx="36" cy="183" r="6" fill={accentColor} opacity="0.6" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="164" cy="183" r="6" fill={accentColor} opacity="0.6" stroke="white" strokeWidth="1" strokeOpacity="0.3" />

      {/* Spiritual aura glow */}
      <circle cx="100" cy="70" r="50" fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}
