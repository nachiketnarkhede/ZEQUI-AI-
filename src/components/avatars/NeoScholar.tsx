interface AvatarProps {
  accentColor?: string;
}

export default function NeoScholar({ accentColor = "#06b6d4" }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="neo-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fef3c7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fcd34d", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="neo-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1f2937", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#111827", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="neo-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1a1f3a", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#0f0f23", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="neo-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Data Rain - animated particles */}
      <g className="neo-data-rain" opacity="0.3">
        <rect x="20" y="0" width="2" height="8" fill={accentColor}>
          <animate attributeName="y" from="0" to="240" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="45" y="0" width="2" height="8" fill={accentColor}>
          <animate attributeName="y" from="0" to="240" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <rect x="70" y="0" width="2" height="8" fill={accentColor}>
          <animate attributeName="y" from="0" to="240" dur="2.2s" repeatCount="indefinite" />
        </rect>
        <rect x="130" y="0" width="2" height="8" fill={accentColor}>
          <animate attributeName="y" from="0" to="240" dur="2.3s" repeatCount="indefinite" />
        </rect>
        <rect x="160" y="0" width="2" height="8" fill={accentColor}>
          <animate attributeName="y" from="0" to="240" dur="2.1s" repeatCount="indefinite" />
        </rect>
        <rect x="180" y="0" width="2" height="8" fill={accentColor}>
          <animate attributeName="y" from="0" to="240" dur="2.4s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Head */}
      <circle cx="100" cy="70" r="40" fill="url(#neo-skin)" stroke={accentColor} strokeWidth="1.5" opacity="0.3" />

      {/* Hair - detailed angular cyberpunk */}
      <g fill="url(#neo-hair)">
        <path d="M 65 50 L 60 25 Q 62 35 68 40 L 72 32 Q 74 42 78 48 L 82 28 Q 85 45 92 52 L 90 30 Q 95 50 100 65 L 108 30 Q 105 50 110 52 L 115 28 Q 118 45 122 48 L 128 32 Q 126 42 128 40 Q 132 35 140 25 L 135 50 Q 130 65 100 80 Q 70 65 65 50 Z" />
      </g>

      {/* Hair highlights */}
      <path d="M 75 35 L 78 50" stroke={accentColor} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      <path d="M 125 35 L 122 50" stroke={accentColor} strokeWidth="2" opacity="0.6" strokeLinecap="round" />

      {/* Glasses - cyan frames */}
      <g>
        <rect x="64" y="58" width="20" height="16" rx="4" fill="none" stroke={accentColor} strokeWidth="2.5" />
        <rect x="116" y="58" width="20" height="16" rx="4" fill="none" stroke={accentColor} strokeWidth="2.5" />
        <line x1="84" y1="66" x2="116" y2="66" stroke={accentColor} strokeWidth="2" />
        <circle cx="74" cy="66" r="1.5" fill={accentColor} opacity="0.4" />
        <circle cx="126" cy="66" r="1.5" fill={accentColor} opacity="0.4" />
      </g>

      {/* Eyes behind glasses */}
      <circle cx="74" cy="66" r="3.5" fill="#2d3748" opacity="0.7" />
      <circle cx="126" cy="66" r="3.5" fill="#2d3748" opacity="0.7" />
      <circle cx="75" cy="65" r="1.5" fill="#fff" opacity="0.8" />
      <circle cx="127" cy="65" r="1.5" fill="#fff" opacity="0.8" />

      {/* Mouth */}
      <path d="M 88 86 Q 100 93 112 86" stroke="#1a202c" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="89" y="104" width="22" height="18" fill="url(#neo-skin)" />

      {/* Body - tech suit with gradients */}
      <path d="M 58 122 L 60 185 Q 100 205 140 185 L 142 122 Z" fill="url(#neo-body)" stroke={accentColor} strokeWidth="2" />

      {/* Chest panel - geometric */}
      <g>
        <rect x="82" y="132" width="36" height="45" rx="5" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.7" />
        <line x1="100" y1="132" x2="100" y2="177" stroke={accentColor} strokeWidth="1" opacity="0.4" />
        <rect x="85" y="145" width="30" height="8" fill={accentColor} opacity="0.2" rx="2" />
      </g>

      {/* Arm details */}
      <rect x="32" y="123" width="26" height="58" rx="5" fill="#1a1f3a" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
      <rect x="142" y="123" width="26" height="58" rx="5" fill="#1a1f3a" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />

      {/* Gloves - accent colored */}
      <rect x="32" y="175" width="26" height="22" rx="4" fill={accentColor} opacity="0.75" />
      <rect x="142" y="175" width="26" height="22" rx="4" fill={accentColor} opacity="0.75" />

      {/* Glove details */}
      <line x1="35" y1="180" x2="55" y2="180" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      <line x1="145" y1="180" x2="165" y2="180" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}
