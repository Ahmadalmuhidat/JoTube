"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/config/axios";
import { SearchResultCard } from "@/components/home/search-result-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, History, PlayCircle } from "lucide-react";

function WatchLaterContent() {
  const { getToken } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchLater = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await axios.get("/videos/watch-later", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Failed to fetch watch later videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchLater();
  }, [getToken]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-6 border-l border-slate-200/50 dark:border-slate-800/50">
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-6 p-2 h-auto md:h-[180px]">
              <Skeleton className="aspect-video w-full md:w-[320px] lg:w-[360px] rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 flex-shrink-0" />
              <div className="flex flex-col flex-1 gap-2 py-1">
                <Skeleton className="h-6 w-[70%] bg-slate-200/60 dark:bg-slate-800/60" />
                <Skeleton className="h-4 w-[30%] bg-slate-200/60 dark:bg-slate-800/60 mt-1" />
                <div className="flex items-center gap-3 mt-4">
                  <Skeleton className="size-8 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
                  <Skeleton className="h-4 w-[20%] bg-slate-200/60 dark:bg-slate-800/60" />
                </div>
                <Skeleton className="h-4 w-[80%] bg-slate-200/60 dark:bg-slate-800/60 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-6 border-l border-slate-200/50 dark:border-slate-800/50">
      <div className="flex flex-col mb-10 pl-2">
        <div className="flex items-center gap-3 mb-2">
            <Clock className="size-6 text-red-600" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Watch later
            </h1>
        </div>
        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
            <PlayCircle className="size-3" />
            Your private screening room
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6">
                <Clock className="size-10 text-slate-300 dark:text-slate-600" />
            </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Nothing to see here... yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm">
            Save videos that catch your eye to watch them later in your private vault!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-20 max-w-[1200px]">
          {videos.map((video) => (
            <SearchResultCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WatchLaterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-slate-500 animate-pulse">Entering the vault...</div>}>
      <WatchLaterContent />
    </Suspense>
  );
}
