interface AvatarProps {
  accentColor?: string;
}

export default function AstraThinker({ accentColor = "#a78bfa" }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="astra-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#e9d5ff", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ddd6fe", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="astra-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#581c87", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#3f0f5c", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="astra-robe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#e9d5ff", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ddd6fe", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="astra-cosmic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: accentColor, stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      {/* Orbiting Stars Animation */}
      <g className="astra-stars" transform="translate(100, 70)">
        {/* Star 1 - top */}
        <circle cx="0" cy="-55" r="3" fill={accentColor} opacity="0.8">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="8s" repeatCount="indefinite" />
        </circle>
        {/* Star 2 - bottom-right */}
        <circle cx="39" cy="39" r="2.5" fill={accentColor} opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="8s" repeatCount="indefinite" />
        </circle>
        {/* Star 3 - bottom-left */}
        <circle cx="-39" cy="39" r="2.8" fill={accentColor} opacity="0.75">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="8s" repeatCount="indefinite" />
        </circle>
        {/* Star 4 - right */}
        <circle cx="55" cy="0" r="2.3" fill={accentColor} opacity="0.65">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="8s" repeatCount="indefinite" />
        </circle>
        {/* Star 5 - left */}
        <circle cx="-55" cy="0" r="2.6" fill={accentColor} opacity="0.72">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Head */}
      <circle cx="100" cy="70" r="42" fill="url(#astra-skin)" stroke={accentColor} strokeWidth="1.5" opacity="0.2" />

      {/* Hair - flowing cosmic waves */}
      <g fill="url(#astra-hair)">
        <path d="M 58 48 Q 52 68 58 110 L 70 115 Q 68 85 72 55 Z" />
        <path d="M 142 48 Q 148 68 142 110 L 130 115 Q 132 85 128 55 Z" />
        <ellipse cx="100" cy="43" rx="38" ry="24" fill="url(#astra-hair)" />
      </g>

      {/* Hair strand details */}
      <path d="M 75 50 Q 80 80 85 120" stroke={accentColor} strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M 125 50 Q 120 80 115 120" stroke={accentColor} strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />

      {/* Star hair accessories - accent color */}
      <g fill={accentColor} opacity="0.85">
        <circle cx="68" cy="52" r="3.5" />
        <circle cx="132" cy="57" r="3.5" />
        <circle cx="80" cy="38" r="2.8" />
        <circle cx="120" cy="36" r="2.8" />
      </g>

      {/* Cosmic aura around head */}
      <circle cx="100" cy="70" r="48" fill="none" stroke={accentColor} strokeWidth="0.8" opacity="0.25" />

      {/* Eyes - mystical and thoughtful */}
      <g>
        <circle cx="78" cy="72" r="7" fill="#7c3aed" stroke="#6d28d9" strokeWidth="0.8" />
        <circle cx="122" cy="72" r="7" fill="#7c3aed" stroke="#6d28d9" strokeWidth="0.8" />
        <circle cx="80" cy="71" r="3" fill="#fff" opacity="0.95" />
        <circle cx="124" cy="71" r="3" fill="#fff" opacity="0.95" />
        <circle cx="80" cy="75" r="0.8" fill="#000" opacity="0.7" />
        <circle cx="124" cy="75" r="0.8" fill="#000" opacity="0.7" />
      </g>

      {/* Gentle eyebrows */}
      <path d="M 72 64 Q 78 62 84 64" stroke={accentColor} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M 116 64 Q 122 62 128 64" stroke={accentColor} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Mouth - serene expression */}
      <path d="M 88 88 Q 100 92 112 88" stroke="#5b21b6" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* Neck */}
      <rect x="88" y="104" width="24" height="16" fill="url(#astra-skin)" />

      {/* Body - flowing celestial robes */}
      <path d="M 52 120 Q 48 160 65 190 L 135 190 Q 152 160 148 120 Z" fill="url(#astra-robe)" stroke={accentColor} strokeWidth="2.5" />

      {/* Cosmic emblem - center chest */}
      <g>
        <circle cx="100" cy="152" r="14" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.6" />
        <circle cx="100" cy="152" r="8" fill={accentColor} opacity="0.3" />
        <path d="M 100 144 L 108 152 L 100 160 L 92 152 Z" fill={accentColor} opacity="0.5" strokeWidth="1" stroke={accentColor} />
      </g>

      {/* Robe folds - vertical lines */}
      <line x1="70" y1="125" x2="68" y2="185" stroke={accentColor} strokeWidth="1" opacity="0.25" />
      <line x1="100" y1="120" x2="100" y2="190" stroke={accentColor} strokeWidth="1.5" opacity="0.3" />
      <line x1="130" y1="125" x2="132" y2="185" stroke={accentColor} strokeWidth="1" opacity="0.25" />

      {/* Arms - long flowing sleeves */}
      <g>
        <path d="M 48 125 Q 38 145 42 180" stroke="url(#astra-hair)" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M 152 125 Q 162 145 158 180" stroke="url(#astra-hair)" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Sleeve accents */}
      <ellipse cx="40" cy="175" rx="6" ry="4" fill={accentColor} opacity="0.5" />
      <ellipse cx="160" cy="175" rx="6" ry="4" fill={accentColor} opacity="0.5" />
    </svg>
  );
}
