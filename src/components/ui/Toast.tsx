"use client";

import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Portal-style fixed container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastBubble key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastBubble({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl px-5 py-4 shadow-xl transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${
        item.type === "error"
          ? "bg-destructive text-white"
          : "bg-deep-brown text-cream"
      }`}
      style={{ minWidth: 280, maxWidth: 380 }}
    >
      {item.type === "error" ? (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-white/80" />
      ) : (
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-soft-gold" />
      )}
      <p className="flex-1 text-sm leading-relaxed">{item.message}</p>
      <button
        onClick={onDismiss}
        className="mt-0.5 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
