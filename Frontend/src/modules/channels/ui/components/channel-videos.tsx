"use client";

import { VideoCard } from "@/components/home/video-card";

interface ChannelVideosProps {
  videos: any[];
}

export const ChannelVideos = ({ videos }: ChannelVideosProps) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-2">
            <div className="size-10 border-4 border-slate-300 dark:border-slate-600 border-t-transparent rounded-full opacity-20" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">No videos yet</h2>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest max-w-xs">
          This creator hasn't uploaded any public discoveries yet
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pb-16">
      <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800/60 mb-8">
        <button className="pb-3 border-b-2 border-slate-900 dark:border-white text-sm font-black text-slate-900 dark:text-white transition-all">
          Videos
        </button>
        <button className="pb-3 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
          Shorts
        </button>
        <button className="pb-3 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
          Playlists
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-10">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
