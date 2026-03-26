"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import axios from "@/config/axios";
import { SearchResultCard } from "@/components/home/search-result-card";
import { Skeleton } from "@/components/ui/skeleton";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`/videos/search/${encodeURIComponent(query)}`);
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-6 border-l border-slate-200/50 dark:border-slate-800/50">
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-6 p-2 h-auto md:h-[200px]">
              <Skeleton className="aspect-video w-full md:w-[360px] lg:w-[400px] rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 flex-shrink-0" />
              <div className="flex flex-col flex-1 gap-2 py-1">
                <Skeleton className="h-6 w-[70%] bg-slate-200/60 dark:bg-slate-800/60" />
                <Skeleton className="h-4 w-[30%] bg-slate-200/60 dark:bg-slate-800/60 mt-1" />
                <div className="flex items-center gap-3 mt-4">
                  <Skeleton className="size-8 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
                  <Skeleton className="h-4 w-[20%] bg-slate-200/60 dark:bg-slate-800/60" />
                </div>
                <Skeleton className="h-4 w-[90%] bg-slate-200/60 dark:bg-slate-800/60 mt-4" />
                <Skeleton className="h-4 w-[80%] bg-slate-200/60 dark:bg-slate-800/60 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-6 border-l border-slate-200/50 dark:border-slate-800/50">
      <div className="mb-10 pl-2">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Results for <span className="text-red-600 bg-red-100/50 dark:bg-red-950/20 px-2 py-1 rounded-lg">"{query}"</span>
        </h1>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6">
                <div className="size-10 border-4 border-slate-300 dark:border-slate-600 border-t-transparent rounded-full opacity-20" />
            </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">No results found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm">
            Try different keywords or check your spelling for better discoveries.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-20">
          {videos.map((video) => (
            <SearchResultCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-slate-500 animate-pulse">Searching the galaxy...</div>}>
      <SearchContent />
    </Suspense>
  );
}
