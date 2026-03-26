"use client";

import { useState, useEffect } from "react";
import axios from "@/config/axios";
import { VideoCard } from "./video-card";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoGridProps {
  query?: string | null;
}

export function VideoGrid({ query }: VideoGridProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const url = query ? `/videos/search/${encodeURIComponent(query)}` : "/videos";
        const response = await axios.get(url);
        // Backend returns { videos: [...] }
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-12 px-2 mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-video w-full rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
            <div className="flex gap-3 px-1">
              <Skeleton className="size-9 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
              <div className="flex flex-col gap-2 flex-1 pt-1">
                <Skeleton className="h-4 w-[90%] bg-slate-200/60 dark:bg-slate-800/60" />
                <Skeleton className="h-3 w-[60%] bg-slate-200/60 dark:bg-slate-800/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4 text-center">
        <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-2">
            <div className="size-10 border-4 border-slate-300 dark:border-slate-600 border-t-transparent rounded-full opacity-20" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">No videos found</h2>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest max-w-xs">
          Try adjusting your search or upload a new discovery
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-12 px-2 mt-4 pb-20">
      {videos.map((video: any) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
