interface ZEQUILogoProps {
  size?: number;
  animated?: boolean;
  theme?: "dark" | "light";
  className?: string;
}

export default function ZEQUILogo({
  size = 40,
  animated = true,
  theme = "dark",
  className = "",
}: ZEQUILogoProps) {
  const strokeWidth = Math.max(1.5, size / 20);
  const dotSize = Math.max(3, size / 10);
  const orbitRadius = size * 0.35;
  const center = size / 2;

  const glowIntensity = theme === "dark" ? 0.8 : 0.4;
  const pulseClass = animated ? "zequi-logo-pulse" : "";
  const hoverClass = animated ? "zequi-logo-hover" : "";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`zequi-logo ${pulseClass} ${hoverClass} ${className}`}
    >
      <defs>
        <linearGradient id="zequi-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="zequi-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={size / 15} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="zequi-core-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={size / 8} result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Neural connection lines */}
      <g opacity={0.3 * glowIntensity} filter="url(#zequi-glow)">
        <line
          x1={center - orbitRadius * 0.7}
          y1={center}
          x2={center + orbitRadius * 0.7}
          y2={center}
          stroke="url(#zequi-gradient)"
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
        />
        <line
          x1={center}
          y1={center - orbitRadius * 0.7}
          x2={center}
          y2={center + orbitRadius * 0.7}
          stroke="url(#zequi-gradient)"
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
        />
        {/* Diagonal neural lines */}
        <line
          x1={center - orbitRadius * 0.5}
          y1={center - orbitRadius * 0.5}
          x2={center + orbitRadius * 0.5}
          y2={center + orbitRadius * 0.5}
          stroke="url(#zequi-gradient)"
          strokeWidth={strokeWidth * 0.4}
          strokeLinecap="round"
          opacity={0.5}
        />
        <line
          x1={center + orbitRadius * 0.5}
          y1={center - orbitRadius * 0.5}
          x2={center - orbitRadius * 0.5}
          y2={center + orbitRadius * 0.5}
          stroke="url(#zequi-gradient)"
          strokeWidth={strokeWidth * 0.4}
          strokeLinecap="round"
          opacity={0.5}
        />
      </g>

      {/* Outer orbital ring */}
      <ellipse
        cx={center}
        cy={center}
        rx={orbitRadius}
        ry={orbitRadius * 0.65}
        stroke="url(#zequi-gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        filter="url(#zequi-glow)"
        opacity={0.7}
      />

      {/* Inner orbital ring */}
      <ellipse
        cx={center}
        cy={center}
        rx={orbitRadius * 0.7}
        ry={orbitRadius * 0.45}
        stroke="url(#zequi-gradient)"
        strokeWidth={strokeWidth * 0.6}
        fill="none"
        filter="url(#zequi-glow)"
        opacity={0.5}
        style={{
          transform: `rotate(60deg)`,
          transformOrigin: `${center}px ${center}px`,
        }}
      />

      {/* Central glowing core */}
      <circle
        cx={center}
        cy={center}
        r={dotSize}
        fill="url(#zequi-gradient)"
        filter="url(#zequi-core-glow)"
        style={{ opacity: glowIntensity }}
      />

      {/* Inner bright dot */}
      <circle
        cx={center}
        cy={center}
        r={dotSize * 0.5}
        fill="#fff"
        opacity={0.9}
      />

      {/* Orbital particles */}
      <circle
        cx={center + orbitRadius}
        cy={center}
        r={dotSize * 0.4}
        fill="#06b6d4"
        filter="url(#zequi-glow)"
        className={animated ? "zequi-orbit-particle-1" : ""}
      />
      <circle
        cx={center - orbitRadius * 0.5}
        cy={center - orbitRadius * 0.4}
        r={dotSize * 0.3}
        fill="#8b5cf6"
        filter="url(#zequi-glow)"
        className={animated ? "zequi-orbit-particle-2" : ""}
      />
    </svg>
  );
}
