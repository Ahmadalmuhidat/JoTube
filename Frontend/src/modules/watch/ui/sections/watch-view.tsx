"use client";

import { VideoPlayer } from "../components/video-player";
import { VideoInfo } from "../components/video-info";
import { CommentsSection } from "../components/comments-section";
import { SuggestionsSection } from "../components/suggestions-section";

interface WatchViewProps {
    videoId: string;
}

export const WatchView = ({ videoId }: WatchViewProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-8 lg:px-12 py-6 max-w-[1800px] mx-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Content (Left) */}
      <div className="flex-1 w-full lg:max-w-[calc(100%-420px)] xl:max-w-[calc(100%-450px)]">
        <div className="relative group/player rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] transition-all hover:translate-y-[-4px] duration-500">
           <VideoPlayer />
        </div>
        <div className="space-y-6">
           <VideoInfo />
           <div className="h-px w-full bg-slate-200 dark:bg-slate-800/60 my-6" />
           <CommentsSection />
        </div>
      </div>
      
      {/* Sidebar Suggestions (Right) */}
      <aside className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 animate-in slide-in-from-right-8 duration-700 delay-200">
        <SuggestionsSection />
      </aside>
    </div>
  );
};
