import { Download } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

interface Props {
  messages: ChatMessage[];
  tab: string;
  persona?: string;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function ExportChat({ messages, tab, persona, addToast }: Props) {
  function exportToMarkdown() {
    if (messages.length === 0) {
      addToast("No messages to export", "error");
      return;
    }

    const date = new Date();
    const dateStr = date.toISOString().split("T")[0];
    const timeStr = date.toLocaleTimeString();

    let markdown = `# ZEQUI™ Chat Export
**Date:** ${date.toLocaleDateString()}
**Time:** ${timeStr}
**Tab:** ${tab.charAt(0).toUpperCase() + tab.slice(1)}
${persona ? `**Persona:** ${persona}` : ""}

---

`;

    messages.forEach((msg, idx) => {
      const role = msg.role === "user" ? "👤 **You**" : "🤖 **ZEQUI**";
      const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";
      const timeStr = time ? `_${time}_` : "";

      markdown += `## ${role} ${timeStr}

${msg.content}

---

`;
    });

    markdown += `
---

*Exported from ZEQUI™ — Your AI companion for studying, focus, and growth*
*© 2026 ZEQUI™ — All rights reserved*
`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zequi-${tab}-${dateStr}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast("Chat exported successfully!", "success");
  }

  return (
    <button
      onClick={exportToMarkdown}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel text-xs text-slate-400 hover:text-cyan-400 transition-colors hover-glow"
      title="Download chat as Markdown"
    >
      <Download size={14} />
      <span>Download Chat</span>
    </button>
  );
}
