"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/config/axios";
import { SearchResultCard } from "@/components/home/search-result-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Heart } from "lucide-react";

function LikedContent() {
  const { getToken } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await axios.get("/videos/liked", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Failed to fetch liked videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedVideos();
  }, [getToken]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-6 border-l border-slate-200/50 dark:border-slate-800/50">
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 p-2 h-auto md:h-[140px]">
              <Skeleton className="aspect-video w-full md:w-[240px] lg:w-[280px] rounded-xl bg-slate-200/60 dark:bg-slate-800/60 flex-shrink-0" />
              <div className="flex flex-col flex-1 gap-2 py-1">
                <Skeleton className="h-5 w-[60%] bg-slate-200/60 dark:bg-slate-800/60" />
                <Skeleton className="h-3 w-[20%] bg-slate-200/60 dark:bg-slate-800/60 mt-1" />
                <div className="flex items-center gap-2 mt-3">
                  <Skeleton className="size-6 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
                  <Skeleton className="h-3 w-[15%] bg-slate-200/60 dark:bg-slate-800/60" />
                </div>
                <Skeleton className="h-3 w-[70%] bg-slate-200/60 dark:bg-slate-800/60 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-6 border-l border-slate-200/50 dark:border-slate-800/50">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pl-2 gap-4">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <ThumbsUp className="size-6 text-red-600" />
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Liked videos
                </h1>
            </div>
            <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                <Heart className="size-3" />
                 Your favorite moments in one galaxy
            </p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6">
                <ThumbsUp className="size-10 text-slate-300 dark:text-slate-600" />
            </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">No liked videos yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm">
            Videos you like will appear here for easy access. Show some love to your favorite creators!
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

export default function LikedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-slate-500 animate-pulse">Consulting your favorites...</div>}>
      <LikedContent />
    </Suspense>
  );
}
