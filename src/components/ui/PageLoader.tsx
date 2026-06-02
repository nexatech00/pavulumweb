"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Don't show the loader in the admin section at all
  const isAdmin = pathname?.startsWith("/admin");

  const show = useCallback(() => {
    // Reset state and show the splash
    setFadeOut(false);
    setVisible(true);
    setPulse(false);

    // Start pulse animation after a tiny delay
    const t1 = setTimeout(() => setPulse(true), 50);
    // Begin fade-out after 1.6s (total visible ~2s)
    const t2 = setTimeout(() => setFadeOut(true), 1600);
    // Fully unmount after fade completes
    const t3 = setTimeout(() => setVisible(false), 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Show on initial mount (non-admin only)
  useEffect(() => {
    if (isAdmin) return;
    const cleanup = show();
    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show on every route change (non-admin only)
  useEffect(() => {
    if (isAdmin) return;
    const cleanup = show();
    return cleanup;
  }, [pathname, show, isAdmin]);

  if (!visible || isAdmin) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0C0C] transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Owl logo — pulses twice over 2s */}
      <div
        style={{
          animation: pulse ? "owlPulse 0.9s ease-in-out 2" : "none",
        }}
      >
        <Image
          src="/logo.png"
          alt="Pavulum"
          width={220}
          height={80}
          className="h-20 w-auto object-contain"
          style={{
            filter:
              "drop-shadow(0 0 18px rgba(192,57,43,0.55)) brightness(1.08) contrast(1.1)",
          }}
          priority
        />
      </div>

      {/* Red progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
        <div
          className="h-full bg-red-600"
          style={{
            animation: pulse ? "loaderBar 1.6s ease-out forwards" : "none",
          }}
        />
      </div>

      <style>{`
        @keyframes owlPulse {
          0%   { transform: scale(1);    opacity: 1; }
          40%  { transform: scale(1.08); opacity: 0.85; }
          70%  { transform: scale(0.96); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes loaderBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
