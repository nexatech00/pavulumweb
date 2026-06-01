"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let raf: number;
    let current = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setProgress(100);
      setTimeout(() => setFadeOut(true), 250);
      setTimeout(() => setVisible(false), 650);
    };

    // Animate progress bar toward 85%
    const tick = () => {
      const step = current < 50 ? 4 : current < 75 ? 1.5 : 0.3;
      current = Math.min(current + step, 85);
      setProgress(current);
      if (current < 85 && !finished) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    // If page is already loaded (common with Next.js hydration), finish quickly
    if (document.readyState === "complete") {
      setTimeout(finish, 400);
    } else {
      window.addEventListener("load", () => setTimeout(finish, 200), { once: true });
    }

    // Hard fallback — always dismiss after 2.5s no matter what
    const fallback = setTimeout(finish, 2500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0C0C] transition-opacity duration-400 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <div
        className={`transition-all duration-500 ${
          fadeOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <Image
          src="/logo.png"
          alt="Pavulum"
          width={200}
          height={60}
          className="h-16 w-auto object-contain"
          priority
        />
      </div>

      {/* Progress bar pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-border/30">
        <div
          className="h-full bg-red-600 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
