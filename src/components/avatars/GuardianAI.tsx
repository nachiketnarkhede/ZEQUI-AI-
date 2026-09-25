interface AvatarProps {
  accentColor?: string;
}

export default function GuardianAI({ accentColor = "#22c55e" }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="guard-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#dcfce7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#d1fae5", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="guard-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#15803d", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#166534", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="guard-suit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#14532d", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#0f3820", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="guard-armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 0.7 }} />
          <stop offset="100%" style={{ stopColor: accentColor, stopOpacity: 0.2 }} />
        </linearGradient>
      </defs>

      {/* Scanning Shield Animation */}
      <g className="guard-shield">
        {/* Shield outline */}
        <path d="M 82 138 L 118 138 L 118 170 Q 100 182 82 170 Z" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.4" />
        {/* Scan line moving up and down */}
        <line x1="82" y1="145" x2="118" y2="145" stroke={accentColor} strokeWidth="1.5" opacity="0.7">
          <animate attributeName="y1" from="138" to="170" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y2" from="138" to="170" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.3" to="1" dur="3s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Head */}
      <circle cx="100" cy="70" r="41" fill="url(#guard-skin)" stroke={accentColor} strokeWidth="1" opacity="0.2" />

      {/* Hair - strong upward spikes */}
      <g fill="url(#guard-hair)">
        <path d="M 62 32 L 68 15 L 75 32 L 82 12 L 90 38 L 98 10 L 100 42 L 102 10 L 110 38 L 118 12 L 125 32 L 132 15 L 138 32 Q 132 68 100 84 Q 68 68 62 32 Z" />
      </g>

      {/* Hair shading */}
      <path d="M 75 25 Q 85 20 100 25" stroke={accentColor} strokeWidth="1.5" opacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M 125 25 Q 115 20 100 25" stroke={accentColor} strokeWidth="1.5" opacity="0.4" fill="none" strokeLinecap="round" />

      {/* Helm accent lines - dynamic */}
      <path d="M 72 38 L 78 25 L 82 38" stroke={accentColor} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.75" />
      <path d="M 118 38 L 122 25 L 128 38" stroke={accentColor} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.75" />

      {/* Eyes - alert and protective */}
      <g>
        <ellipse cx="80" cy="70" rx="5.5" ry="8" fill={accentColor} stroke="#16a34a" strokeWidth="0.8" opacity="0.8" />
        <ellipse cx="120" cy="70" rx="5.5" ry="8" fill={accentColor} stroke="#16a34a" strokeWidth="0.8" opacity="0.8" />
        <circle cx="81" cy="70" r="2.5" fill="#000" opacity="0.9" />
        <circle cx="121" cy="70" r="2.5" fill="#000" opacity="0.9" />
        <circle cx="82" cy="68" r="0.8" fill="#fff" opacity="0.8" />
        <circle cx="122" cy="68" r="0.8" fill="#fff" opacity="0.8" />
      </g>

      {/* Stern determined mouth */}
      <line x1="88" y1="89" x2="112" y2="89" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

      {/* Neck */}
      <rect x="88" y="104" width="24" height="16" fill="url(#guard-skin)" />

      {/* Body - guardian suit */}
      <path d="M 58 120 L 65 188 Q 100 208 135 188 L 142 120 Z" fill="url(#guard-suit)" stroke={accentColor} strokeWidth="2.5" />

      {/* Shield emblem - center */}
      <g>
        <path d="M 82 138 L 118 138 L 118 170 Q 100 182 82 170 Z" fill="none" stroke={accentColor} strokeWidth="2.5" />
        <circle cx="100" cy="154" r="8" fill={accentColor} opacity="0.4" stroke={accentColor} strokeWidth="1.5" />
        <path d="M 100 148 L 106 154 L 100 160 L 94 154 Z" fill={accentColor} opacity="0.6" />
      </g>

      {/* Armor plating - shoulders */}
      <g fill="url(#guard-armor)" opacity="0.5">
        <rect x="58" y="120" width="16" height="20" rx="3" stroke={accentColor} strokeWidth="1" />
        <rect x="126" y="120" width="16" height="20" rx="3" stroke={accentColor} strokeWidth="1" />
      </g>

      {/* Armor details - chest*/}
      <line x1="85" y1="125" x2="115" y2="125" stroke={accentColor} strokeWidth="1" opacity="0.3" />
      <line x1="82" y1="140" x2="118" y2="140" stroke={accentColor} strokeWidth="1" opacity="0.3" />
      <line x1="85" y1="165" x2="115" y2="165" stroke={accentColor} strokeWidth="1" opacity="0.3" />

      {/* Arms - protective stance */}
      <g fill="url(#guard-suit)">
        <rect x="28" y="120" width="30" height="68" rx="6" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
        <rect x="142" y="120" width="30" height="68" rx="6" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Arm guard plating */}
      <rect x="28" y="120" width="30" height="18" rx="4" fill={accentColor} opacity="0.35" />
      <rect x="142" y="120" width="30" height="18" rx="4" fill={accentColor} opacity="0.35" />
    </svg>
  );
}
