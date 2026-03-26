"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/config/axios";
import { VideoPlayer } from "@/components/watch/video-player";
import { VideoInfo } from "@/components/watch/video-info";
import { CommentsSection } from "@/components/watch/comments-section";
import { SuggestionsSection } from "@/components/watch/suggestions-section";

interface WatchViewProps {
  videoId: string;
}

export const WatchView = ({ videoId }: WatchViewProps) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [video, setVideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = isSignedIn ? await getToken() : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await axios.get(`/videos/${videoId}`, { headers });
        setVideo(response.data);
      } catch (error) {
        console.error("Failed to fetch video:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchVideo();
    }
  }, [videoId, isLoaded, isSignedIn, getToken]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600" />
    </div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-8 lg:px-12 py-6 max-w-[1800px] mx-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Content (Left) */}
      <div className="flex-1 w-full lg:max-w-[calc(100%-420px)] xl:max-w-[calc(100%-450px)]">
        <div className="relative group/player rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] transition-all hover:translate-y-[-4px] duration-500">
          <VideoPlayer videoUrl={video?.videoUrl} thumbnailUrl={video?.thumbnailUrl} videoId={video?.id} />
        </div>
        <div className="space-y-6">
          <VideoInfo video={video} />
          <div className="h-px w-full bg-slate-200 dark:bg-slate-800/60 my-6" />
          <CommentsSection videoId={videoId} videoComments={video?.comments || []} />
        </div>
      </div>

      {/* Sidebar Suggestions (Right) */}
      <aside className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 animate-in slide-in-from-right-8 duration-700 delay-200">
        <SuggestionsSection videoId={videoId} />
      </aside>
    </div>
  );
};
