"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Tech",
  "Travel",
  "Food",
  "Fashion",
  "Science",
  "History",
  "Art",
  "Education",
  "Health",
  "Finance",
  "Politics",
  "Movies",
  "Live",
  "Podcasts",
];

export default function Categories() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("All");

  if (pathname !== "/") return null;

  return (
    <div className="sticky top-14 z-40 w-full px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 mb-4">
      <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "whitespace-nowrap px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-semibold transition-colors",
              activeCategory === category
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}