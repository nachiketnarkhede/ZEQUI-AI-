interface AvatarProps {
  accentColor?: string;
}

export default function SakuraFocus({ accentColor = "#ec4899" }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="sakura-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fce7f3", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fbcfe8", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="sakura-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#a16207", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#78350f", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="sakura-dress" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fce7f3", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fbcfe8", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="petal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#fff", stopOpacity: 0.3 }} />
        </linearGradient>
      </defs>

      {/* Falling Petals Animation */}
      <g className="sakura-petals">
        {/* Petal 1 */}
        <ellipse cx="30" cy="-10" rx="4" ry="6" fill="url(#petal-grad)" opacity="0.7">
          <animate attributeName="cy" from="-10" to="240" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cx" from="30" to="50" dur="4s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from="0 30 -10" to="360 30 -10" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Petal 2 */}
        <ellipse cx="80" cy="-15" rx="4" ry="6" fill="url(#petal-grad)" opacity="0.6">
          <animate attributeName="cy" from="-15" to="240" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="cx" from="80" to="95" dur="4.5s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from="0 80 -15" to="360 80 -15" dur="4.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Petal 3 */}
        <ellipse cx="150" cy="-8" rx="4" ry="6" fill="url(#petal-grad)" opacity="0.65">
          <animate attributeName="cy" from="-8" to="240" dur="4.2s" repeatCount="indefinite" />
          <animate attributeName="cx" from="150" to="170" dur="4.2s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from="0 150 -8" to="360 150 -8" dur="4.2s" repeatCount="indefinite" />
        </ellipse>
        {/* Petal 4 */}
        <ellipse cx="120" cy="-20" rx="4" ry="6" fill="url(#petal-grad)" opacity="0.55">
          <animate attributeName="cy" from="-20" to="240" dur="5s" repeatCount="indefinite" />
          <animate attributeName="cx" from="120" to="105" dur="5s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from="0 120 -20" to="360 120 -20" dur="5s" repeatCount="indefinite" />
        </ellipse>
        {/* Petal 5 */}
        <ellipse cx="60" cy="-12" rx="4" ry="6" fill="url(#petal-grad)" opacity="0.7">
          <animate attributeName="cy" from="-12" to="240" dur="4.3s" repeatCount="indefinite" />
          <animate attributeName="cx" from="60" to="75" dur="4.3s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from="0 60 -12" to="360 60 -12" dur="4.3s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Head */}
      <circle cx="100" cy="70" r="42" fill="url(#sakura-skin)" stroke={accentColor} strokeWidth="1" opacity="0.2" />

      {/* Hair - long flowing with layers */}
      <g fill="url(#sakura-hair)">
        <path d="M 60 65 Q 55 95 60 130 L 68 135 Q 65 100 68 70 Z" />
        <path d="M 140 65 Q 145 95 140 130 L 132 135 Q 135 100 132 70 Z" />
        <ellipse cx="100" cy="48" rx="35" ry="22" fill="url(#sakura-hair)" />
      </g>

      {/* Hair strand details */}
      <path d="M 70 55 Q 75 80 80 110" stroke={accentColor} strokeWidth="1.5" opacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M 130 55 Q 125 80 120 110" stroke={accentColor} strokeWidth="1.5" opacity="0.4" fill="none" strokeLinecap="round" />

      {/* Flower hairpin - accent color */}
      <g>
        <circle cx="115" cy="42" r="7" fill={accentColor} opacity="0.9" />
        <circle cx="107" cy="36" r="5.5" fill={accentColor} opacity="0.8" />
        <circle cx="123" cy="36" r="5.5" fill={accentColor} opacity="0.8" />
        <circle cx="105" cy="48" r="5" fill={accentColor} opacity="0.7" />
        <circle cx="125" cy="48" r="5" fill={accentColor} opacity="0.7" />
        <circle cx="115" cy="52" r="4" fill={accentColor} />
      </g>

      {/* Eyes - large expressive */}
      <g>
        <ellipse cx="78" cy="68" rx="7" ry="12" fill="#4f46e5" stroke="#3730a3" strokeWidth="0.5" />
        <ellipse cx="122" cy="68" rx="7" ry="12" fill="#4f46e5" stroke="#3730a3" strokeWidth="0.5" />
        <ellipse cx="80" cy="65" rx="3" ry="5" fill="#fff" opacity="0.9" />
        <ellipse cx="124" cy="65" rx="3" ry="5" fill="#fff" opacity="0.9" />
        <circle cx="80" cy="72" r="1.5" fill="#000" opacity="0.6" />
        <circle cx="124" cy="72" r="1.5" fill="#000" opacity="0.6" />
      </g>

      {/* Eyebrows */}
      <path d="M 72 58 Q 78 56 85 58" stroke={accentColor} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M 115 58 Q 122 56 128 58" stroke={accentColor} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Mouth - gentle smile */}
      <path d="M 88 87 Q 100 94 112 87" stroke="#d946a6" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="88" y="104" width="24" height="18" fill="url(#sakura-skin)" />

      {/* Body - elegant dress */}
      <path d="M 62 122 L 68 185 L 132 185 L 138 122 Z" fill="url(#sakura-dress)" stroke={accentColor} strokeWidth="2.5" />

      {/* Dress details - waist accent */}
      <g>
        <line x1="68" y1="145" x2="132" y2="145" stroke={accentColor} strokeWidth="2" opacity="0.5" />
        <ellipse cx="100" cy="148" rx="14" ry="6" fill={accentColor} opacity="0.25" />
      </g>

      {/* Sleeves - puffed */}
      <g fill="url(#sakura-dress)">
        <path d="M 62 122 Q 48 128 45 155 L 55 150 Q 58 135 68 128 Z" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
        <path d="M 138 122 Q 152 128 155 155 L 145 150 Q 142 135 132 128 Z" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Sleeve edge accents */}
      <ellipse cx="48" cy="145" rx="8" ry="5" fill={accentColor} opacity="0.4" />
      <ellipse cx="152" cy="145" rx="8" ry="5" fill={accentColor} opacity="0.4" />
    </svg>
  );
}
