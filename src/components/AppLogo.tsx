import ZEQUILogo from "./ZEQUILogo";

interface AppLogoProps {
  size?: number;
  showTagline?: boolean;
  theme?: "dark" | "light";
  className?: string;
  stackOnMobile?: boolean;
}

export default function AppLogo({
  size = 36,
  showTagline = false,
  theme = "dark",
  className = "",
  stackOnMobile = false,
}: AppLogoProps) {
  const textClass = theme === "dark" ? "text-cyan-400" : "text-cyan-600";
  const taglineClass = theme === "dark" ? "text-slate-500" : "text-slate-600";

  return (
    <div
      className={`flex items-center gap-2.5 ${stackOnMobile ? "flex-col sm:flex-row" : ""} ${className}`}
    >
      <ZEQUILogo size={size} animated theme={theme} />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`font-bold text-lg tracking-tight ${textClass}`}>ZEQUI</span>
          <span className="text-slate-500 text-xs">™</span>
        </div>
        {showTagline && (
          <p className={`text-[10px] ${taglineClass} leading-tight max-w-[200px]`}>
            Your AI companion for studying, focus, and growth
          </p>
        )}
      </div>
    </div>
  );
}

// Export ASCII logo for text-based exports
export function getASCIILogo(): string {
  return `
╔═══════════════════════════════════════╗
║     ╭─────╮                           ║
║    ╱   ◉   ╲    ZEQUI™                ║
║   │  ╱   ╲  │   AI that thinks         ║
║    ╲╱     ╲╱    with you                ║
║     ╰─────╯                             ║
╚═══════════════════════════════════════╝
`;
}

// Export simple logo for small spaces
export function getCompactLogo(size: number = 24): JSX.Element {
  return <ZEQUILogo size={size} animated={false} />;
}
