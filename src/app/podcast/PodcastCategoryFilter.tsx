"use client";

import { useRouter } from "next/navigation";

export default function PodcastCategoryFilter({
  categories,
  active,
}: {
  categories: string[];
  active: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            const params = cat === "all" ? "/podcast" : `/podcast?category=${encodeURIComponent(cat)}`;
            router.push(params);
          }}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors capitalize ${
            active === cat
              ? "bg-red-600 text-white"
              : "border border-white/15 text-white/55 hover:border-white/40 hover:text-white"
          }`}
        >
          {cat === "all" ? "All shows" : cat}
        </button>
      ))}
    </div>
  );
}
