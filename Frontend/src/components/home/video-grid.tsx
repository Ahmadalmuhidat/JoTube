"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import axios from "@/config/axios";
import { VideoCard } from "./video-card";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoGridProps {
  query?: string | null;
}

export function VideoGrid({ query }: VideoGridProps) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["videos", query],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const url = query 
        ? `/videos/search/${encodeURIComponent(query)}` 
        : "/videos";
      
      const response = await axios.get(url, {
        params: {
          cursor: pageParam,
          limit: 12,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  // Fetch next page when the trigger element comes into view
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-12 px-2 mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h2 className="text-xl font-bold text-red-600">Failed to load videos</h2>
        <p className="text-slate-500">Please try again later.</p>
      </div>
    );
  }

  const videos = data?.pages.flatMap((page) => page.videos) || [];

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
    <div className="flex flex-col gap-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-12 px-2 mt-4">
        {videos.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        )}
      </div>
    </div>
  );
}
