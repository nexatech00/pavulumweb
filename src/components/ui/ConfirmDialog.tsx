"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when opened, trap Escape key
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-deep-brown/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-card p-7 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            destructive ? "bg-destructive/10" : "bg-soft-gold/10"
          }`}>
            <AlertTriangle className={`h-5 w-5 ${destructive ? "text-destructive" : "text-soft-gold"}`} />
          </div>
          <div>
            <h2 id="confirm-title" className="font-serif text-xl text-deep-brown">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{message}</p>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-full border border-border px-5 py-2 text-sm text-charcoal/80 hover:bg-secondary transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 text-sm text-white transition-colors ${
              destructive
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-terracotta hover:bg-terracotta-dark"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
