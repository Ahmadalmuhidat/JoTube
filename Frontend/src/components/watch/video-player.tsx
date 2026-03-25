"use client";

import axios from "@/config/axios";
import { useAuth } from "@clerk/nextjs";

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  videoId: string;
}

export const VideoPlayer = ({ videoUrl, thumbnailUrl, videoId }: VideoPlayerProps) => {
  const { getToken } = useAuth();

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  const viewVideo = async () => {
    if (!videoId) return;

    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axios.post(`/videos/view`, { videoId }, { headers });
    } catch (error) {
      console.error("Failed to record view:", error);
    }
  };

  return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group border border-slate-800">
      <video
        src={videoUrl}
        poster={thumbnailUrl || ""}
        onPlay={viewVideo}
        controls
        autoPlay
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
