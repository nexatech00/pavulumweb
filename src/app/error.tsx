"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C0C0C] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-white">This page didn't load</h1>
        <p className="mt-2 text-sm text-white/50">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm text-white hover:bg-red-500"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/70 hover:bg-white/10"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
