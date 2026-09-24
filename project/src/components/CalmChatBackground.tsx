export default function CalmChatBackground() {
  return (
    <div className="calm-chat-bg">
      {/* Base gradient layer */}
      <div className="calm-base-layer" />

      {/* Floating gradient orbs */}
      <div className="calm-orb calm-orb-1" />
      <div className="calm-orb calm-orb-2" />
      <div className="calm-orb calm-orb-3" />

      {/* Optional subtle overlay for text contrast */}
      <div className="calm-overlay" />
    </div>
  );
}
