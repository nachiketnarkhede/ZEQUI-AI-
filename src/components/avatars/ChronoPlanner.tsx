interface AvatarProps {
  accentColor?: string;
}

export default function ChronoPlanner({ accentColor = "#0ea5e9" }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="chrono-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#cffafe", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#a5f3fc", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="chrono-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#164e63", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#083344", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="chrono-suit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#0d4c63", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#082f42", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="chrono-grid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: accentColor, stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      {/* Rotating Gears */}
      <g className="chrono-gears">
        {/* Gear 1 - top left */}
        <g transform="translate(30, 45)">
          <circle cx="0" cy="0" r="8" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
          <circle cx="0" cy="0" r="4" fill={accentColor} opacity="0.3" />
          <line x1="0" y1="-5" x2="0" y2="-8" stroke={accentColor} strokeWidth="0.8" opacity="0.6" />
          <line x1="0" y1="5" x2="0" y2="8" stroke={accentColor} strokeWidth="0.8" opacity="0.6" />
          <animateTransform attributeName="transform" type="rotate" from="0 30 45" to="360 30 45" dur="8s" repeatCount="indefinite" />
        </g>
        {/* Gear 2 - top right */}
        <g transform="translate(170, 50)">
          <circle cx="0" cy="0" r="6" fill="none" stroke={accentColor} strokeWidth="1.2" opacity="0.45" />
          <circle cx="0" cy="0" r="3" fill={accentColor} opacity="0.25" />
          <line x1="0" y1="-4" x2="0" y2="-6" stroke={accentColor} strokeWidth="0.8" opacity="0.5" />
          <animateTransform attributeName="transform" type="rotate" from="0 170 50" to="-360 170 50" dur="6s" repeatCount="indefinite" />
        </g>
        {/* Gear 3 - bottom */}
        <g transform="translate(100, 195)">
          <circle cx="0" cy="0" r="7" fill="none" stroke={accentColor} strokeWidth="1.3" opacity="0.5" />
          <circle cx="0" cy="0" r="3.5" fill={accentColor} opacity="0.3" />
          <line x1="0" y1="-4.5" x2="0" y2="-7" stroke={accentColor} strokeWidth="0.8" opacity="0.6" />
          <animateTransform attributeName="transform" type="rotate" from="0 100 195" to="360 100 195" dur="7s" repeatCount="indefinite" />
        </g>
      </g>

      {/* Head */}
      <circle cx="100" cy="70" r="40" fill="url(#chrono-skin)" stroke={accentColor} strokeWidth="1" opacity="0.3" />

      {/* Hair - structured geometric */}
      <g fill="url(#chrono-hair)">
        <path d="M 64 38 L 70 20 L 78 38 L 88 18 L 96 45 L 100 15 L 104 45 L 112 18 L 122 38 L 130 20 L 136 38 Q 132 68 100 82 Q 68 68 64 38 Z" />
      </g>

      {/* Hair shading lines */}
      <path d="M 78 30 L 82 48" stroke={accentColor} strokeWidth="1" opacity="0.3" fill="none" strokeLinecap="round" />
      <path d="M 122 30 L 118 48" stroke={accentColor} strokeWidth="1" opacity="0.3" fill="none" strokeLinecap="round" />

      {/* Clock motif - accent */}
      <g>
        <circle cx="120" cy="38" r="10" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.8" />
        <line x1="120" y1="32" x2="120" y2="28" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
        <line x1="120" y1="48" x2="120" y2="52" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
        <line x1="120" y1="38" x2="126" y2="38" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
        <line x1="120" y1="38" x2="124" y2="42" stroke={accentColor} strokeWidth="1.2" opacity="0.5" />
      </g>

      {/* Eyes - focused determined */}
      <g>
        <rect x="74" y="62" width="8" height="14" rx="2" fill="#0e7490" stroke="#164e63" strokeWidth="0.5" />
        <rect x="118" y="62" width="8" height="14" rx="2" fill="#0e7490" stroke="#164e63" strokeWidth="0.5" />
        <circle cx="78" cy="70" r="2.2" fill="#000" opacity="0.9" />
        <circle cx="122" cy="70" r="2.2" fill="#000" opacity="0.9" />
        <circle cx="79" cy="68" r="0.8" fill="#fff" opacity="0.8" />
        <circle cx="123" cy="68" r="0.8" fill="#fff" opacity="0.8" />
      </g>

      {/* Mouth - professional confident */}
      <path d="M 90 88 L 110 88" stroke="#1a202c" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />

      {/* Neck */}
      <rect x="88" y="104" width="24" height="16" fill="url(#chrono-skin)" />

      {/* Body - organized professional outfit */}
      <path d="M 58 120 L 58 185 Q 100 205 142 185 L 142 120 Z" fill="url(#chrono-suit)" stroke={accentColor} strokeWidth="2.5" />

      {/* Grid pattern - main body accent */}
      <g>
        <rect x="78" y="133" width="44" height="48" rx="3" fill="url(#chrono-grid)" opacity="0.4" stroke={accentColor} strokeWidth="2" />
        <line x1="88" y1="133" x2="88" y2="181" stroke={accentColor} strokeWidth="0.8" opacity="0.25" />
        <line x1="100" y1="133" x2="100" y2="181" stroke={accentColor} strokeWidth="0.8" opacity="0.25" />
        <line x1="112" y1="133" x2="112" y2="181" stroke={accentColor} strokeWidth="0.8" opacity="0.25" />
        <line x1="78" y1="150" x2="122" y2="150" stroke={accentColor} strokeWidth="0.8" opacity="0.25" />
        <line x1="78" y1="167" x2="122" y2="167" stroke={accentColor} strokeWidth="0.8" opacity="0.25" />
      </g>

      {/* Arms - precise professional stance */}
      <g fill="url(#chrono-hair)">
        <rect x="28" y="120" width="30" height="64" rx="5" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
        <rect x="142" y="120" width="30" height="64" rx="5" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Wrist details - time-themed */}
      <circle cx="43" cy="155" r="5" fill={accentColor} opacity="0.6" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="157" cy="155" r="5" fill={accentColor} opacity="0.6" stroke="white" strokeWidth="1" strokeOpacity="0.3" />

      {/* Band around wrist */}
      <rect x="38" y="152" width="10" height="6" rx="2" fill={accentColor} opacity="0.4" />
      <rect x="152" y="152" width="10" height="6" rx="2" fill={accentColor} opacity="0.4" />
    </svg>
  );
}
