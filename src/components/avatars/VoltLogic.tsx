interface AvatarProps {
  accentColor?: string;
}

export default function VoltLogic({ accentColor = "#fbbf24" }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="volt-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fef3c7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fde047", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="volt-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#292524", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#1c1917", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="volt-suit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1e1e2e", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#0f0f1e", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="volt-energy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: accentColor, stopOpacity: 0.2 }} />
        </linearGradient>
        <filter id="volt-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Electric Arcs - animated lightning */}
      <g className="volt-arcs" filter="url(#volt-glow)">
        {/* Arc 1 */}
        <path d="M 25 30 L 28 50 L 22 70 L 26 90" stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8">
          <animate attributeName="opacity" from="0.2" to="1" dur="0.15s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1" to="3" dur="0.15s" repeatCount="indefinite" />
        </path>
        {/* Arc 2 */}
        <path d="M 175 40 L 172 60 L 178 80 L 174 100" stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8">
          <animate attributeName="opacity" from="0.2" to="1" dur="0.15s" repeatCount="indefinite" begin="0.05s" />
          <animate attributeName="stroke-width" from="1" to="3" dur="0.15s" repeatCount="indefinite" begin="0.05s" />
        </path>
        {/* Arc 3 */}
        <path d="M 180 140 L 185 160 L 178 180" stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8">
          <animate attributeName="opacity" from="0.2" to="1" dur="0.15s" repeatCount="indefinite" begin="0.1s" />
          <animate attributeName="stroke-width" from="1" to="3" dur="0.15s" repeatCount="indefinite" begin="0.1s" />
        </path>
      </g>

      {/* Head */}
      <circle cx="100" cy="70" r="40" fill="url(#volt-skin)" stroke={accentColor} strokeWidth="1" opacity="0.3" />

      {/* Hair - sharp angular with lightning theme */}
      <g fill="url(#volt-hair)">
        <path d="M 64 38 L 68 20 L 75 38 L 82 22 L 88 42 L 95 18 L 100 48 L 105 18 L 112 42 L 118 22 L 125 38 L 132 20 L 136 38 Q 132 68 100 82 Q 68 68 64 38 Z" />
      </g>

      {/* Lightning streak in hair - accent */}
      <g>
        <path d="M 130 35 L 135 50 L 128 58 L 133 72" stroke={accentColor} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M 130 35 L 135 50 L 128 58 L 133 72" stroke={accentColor} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3" />
      </g>

      {/* Eyes - intense energetic */}
      <g>
        <ellipse cx="80" cy="70" rx="5.5" ry="8" fill={accentColor} stroke="#b45309" strokeWidth="0.5" />
        <ellipse cx="120" cy="70" rx="5.5" ry="8" fill={accentColor} stroke="#b45309" strokeWidth="0.5" />
        <circle cx="81" cy="70" r="2.5" fill="#000" opacity="0.9" />
        <circle cx="121" cy="70" r="2.5" fill="#000" opacity="0.9" />
        <circle cx="82" cy="68" r="1" fill="#fff" opacity="0.8" />
        <circle cx="122" cy="68" r="1" fill="#fff" opacity="0.8" />
      </g>

      {/* Mouth - confident smirk */}
      <path d="M 90 88 L 110 88 Q 105 95 100 95 Q 95 95 90 88" stroke="#1a202c" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="89" y="104" width="22" height="16" fill="url(#volt-skin)" />

      {/* Body - energy suit with gradients */}
      <path d="M 58 120 L 58 188 Q 100 208 142 188 L 142 120 Z" fill="url(#volt-suit)" stroke={accentColor} strokeWidth="2.5" />

      {/* Energy core center */}
      <g>
        <rect x="85" y="135" width="30" height="40" rx="4" fill="url(#volt-energy)" opacity="0.3" stroke={accentColor} strokeWidth="2" />
        <circle cx="100" cy="155" r="8" fill={accentColor} opacity="0.4" />
      </g>

      {/* Vertical energy lines */}
      <line x1="75" y1="130" x2="75" y2="180" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
      <line x1="100" y1="125" x2="100" y2="185" stroke={accentColor} strokeWidth="1.5" opacity="0.6" />
      <line x1="125" y1="130" x2="125" y2="180" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />

      {/* Horizontal energy bands */}
      <line x1="65" y1="145" x2="135" y2="145" stroke={accentColor} strokeWidth="1" opacity="0.3" />
      <line x1="68" y1="165" x2="132" y2="165" stroke={accentColor} strokeWidth="1" opacity="0.3" />

      {/* Arms - dynamic pose */}
      <g fill="url(#volt-suit)">
        <rect x="28" y="120" width="30" height="62" rx="5" transform="rotate(-18 43 151)" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
        <rect x="142" y="120" width="30" height="62" rx="5" transform="rotate(18 157 151)" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Arm energy nodes */}
      <circle cx="32" cy="155" r="5.5" fill={accentColor} opacity="0.7" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="168" cy="155" r="5.5" fill={accentColor} opacity="0.7" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  );
}
