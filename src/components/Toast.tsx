import { useEffect } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor =
    toast.type === "error"
      ? "bg-red-500/20 border-red-500/30 text-red-300"
      : toast.type === "success"
      ? "bg-green-500/20 border-green-500/30 text-green-300"
      : "bg-cyan-500/20 border-cyan-500/30 text-cyan-300";

  return (
    <div
      className={`px-4 py-3 rounded-xl text-sm ${bgColor} border slide-up fade-in flex items-center gap-2 shadow-lg`}
    >
      {toast.type === "success" && <span className="text-green-400">+</span>}
      {toast.type === "error" && <span className="text-red-400">!</span>}
      {toast.type === "info" && <span className="text-cyan-400">i</span>}
      {toast.message}
    </div>
  );
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}
