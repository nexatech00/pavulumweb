import Link from "next/link";
import { SiteLayout } from "@/components/site/Layout";
import { Headphones, ArrowLeft } from "lucide-react";

export default function EpisodeNotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600/10">
          <Headphones className="h-9 w-9 text-red-500/60" />
        </div>
        <h1 className="mt-6 font-serif text-4xl text-white">Episode Not Found</h1>
        <p className="mt-3 text-white/50 max-w-md mx-auto">
          We couldn't find the episode you're looking for. It may have been removed or the link might be incorrect.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/podcast"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm text-white hover:bg-red-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Podcast
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
