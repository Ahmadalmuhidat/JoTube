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
    <div className="sticky top-[5.5rem] z-40 w-full px-4 mb-4">
      <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-2 shadow-sm overflow-hidden">
        <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300",
                activeCategory === category
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105"
                  : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Scroll gradient masks */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-white/50 dark:from-slate-950/50 to-transparent pointer-events-none" />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-white/50 dark:from-slate-950/50 to-transparent pointer-events-none" />
    </div>
  );
}