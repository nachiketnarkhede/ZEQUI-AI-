interface AvatarProps {
  accentColor?: string;
}

export default function CanvasCreator({ accentColor = "#f97316" }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="canvas-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fed7aa", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fdba74", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="canvas-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#b45309", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#92400e", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="canvas-outfit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fed7aa", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fcb69f", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="canvas-paint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 0.7 }} />
          <stop offset="100%" style={{ stopColor: accentColor, stopOpacity: 0.2 }} />
        </linearGradient>
      </defs>

      {/* Paint Splatter - subtle floating animation */}
      <g className="canvas-splatters" opacity="0.4">
        <circle cx="25" cy="60" r="2" fill={accentColor}>
          <animate attributeName="cy" from="60" to="50" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.2" to="0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="175" cy="100" r="2.5" fill={accentColor}>
          <animate attributeName="cy" from="100" to="85" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.2" to="0.7" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="180" r="1.8" fill={accentColor}>
          <animate attributeName="cy" from="180" to="165" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.3" to="0.5" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="150" r="2.2" fill={accentColor}>
          <animate attributeName="cy" from="150" to="135" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.2" to="0.6" dur="3.2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Head */}
      <circle cx="100" cy="70" r="40" fill="url(#canvas-skin)" stroke={accentColor} strokeWidth="1" opacity="0.2" />

      {/* Hair - creative flowing with texture */}
      <g fill="url(#canvas-hair)">
        <path d="M 63 44 Q 58 55 62 88 L 72 92 Q 68 62 74 42 Z" />
        <path d="M 137 44 Q 142 55 138 88 L 128 92 Q 132 62 126 42 Z" />
        <ellipse cx="100" cy="42" rx="36" ry="20" fill="url(#canvas-hair)" />
      </g>

      {/* Hair strand details */}
      <path d="M 75 48 Q 80 65 85 90" stroke={accentColor} strokeWidth="1.2" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M 125 48 Q 120 65 115 90" stroke={accentColor} strokeWidth="1.2" opacity="0.35" fill="none" strokeLinecap="round" />

      {/* Paint streak in hair - accent color */}
      <path d="M 76 52 Q 88 48 98 58" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />

      {/* Eyes - artistic and observant */}
      <g>
        <circle cx="78" cy="70" r="6.5" fill="#c65911" stroke="#a16207" strokeWidth="0.8" />
        <circle cx="122" cy="70" r="6.5" fill="#c65911" stroke="#a16207" strokeWidth="0.8" />
        <circle cx="79" cy="69" r="3.2" fill="#000" opacity="0.9" />
        <circle cx="123" cy="69" r="3.2" fill="#000" opacity="0.9" />
        <circle cx="80" cy="67" r="1.2" fill="#fff" opacity="0.85" />
        <circle cx="124" cy="67" r="1.2" fill="#fff" opacity="0.85" />
      </g>

      {/* Expressive eyebrows */}
      <path d="M 72 60 Q 78 57 84 60" stroke={accentColor} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.65" />
      <path d="M 116 60 Q 122 57 128 60" stroke={accentColor} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.65" />

      {/* Smile - creative warmth */}
      <path d="M 88 86 Q 100 94 112 86" stroke="#1a202c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* Neck */}
      <rect x="88" y="104" width="24" height="16" fill="url(#canvas-skin)" />

      {/* Body - artistic bohemian outfit */}
      <path d="M 60 120 L 60 185 Q 100 205 140 185 L 140 120 Z" fill="url(#canvas-outfit)" stroke={accentColor} strokeWidth="2.5" />

      {/* Paint palette emblem - center */}
      <g>
        <circle cx="100" cy="150" r="18" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.6" />
        <circle cx="85" cy="143" r="3.5" fill={accentColor} opacity="0.65" />
        <circle cx="100" cy="137" r="3.5" fill={accentColor} opacity="0.65" />
        <circle cx="115" cy="143" r="3.5" fill={accentColor} opacity="0.65" />
        <circle cx="100" cy="160" r="3.5" fill={accentColor} opacity="0.65" />
      </g>

      {/* Clothing folds - texture */}
      <line x1="70" y1="130" x2="68" y2="185" stroke={accentColor} strokeWidth="0.8" opacity="0.2" />
      <line x1="130" y1="130" x2="132" y2="185" stroke={accentColor} strokeWidth="0.8" opacity="0.2" />

      {/* Arms - expressive gesture */}
      <g fill="url(#canvas-hair)">
        <path d="M 58 122 Q 42 135 38 170 L 48 165 Q 58 140 65 128 Z" />
        <path d="M 142 122 Q 158 135 162 170 L 152 165 Q 142 140 135 128 Z" />
      </g>

      {/* Brush - accent color, held in hand */}
      <g>
        <rect x="33" y="165" width="6" height="28" rx="2" fill={accentColor} opacity="0.8" />
        <circle cx="36" cy="163" r="6" fill={accentColor} opacity="0.7" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
        <rect x="157" y="165" width="6" height="28" rx="2" fill={accentColor} opacity="0.8" />
        <circle cx="160" cy="163" r="6" fill={accentColor} opacity="0.7" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      </g>
    </svg>
  );
}
