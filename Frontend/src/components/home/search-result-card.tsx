"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock, Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import axios from "@/config/axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  video: {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    viewCount: number;
    createdAt: string;
    isWatchLater?: boolean;
    channel: {
      id: string;
      name: string;
      imageUrl?: string | null;
      user?: {
        image?: string;
      };
    };
  };
}

export function SearchResultCard({ video }: SearchResultCardProps) {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const [isWatchLater, setIsWatchLater] = useState(video.isWatchLater || false);
  const [isToggling, setIsToggling] = useState(false);

  const toggleWatchLater = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to save videos");
      return;
    }

    setIsToggling(true);
    try {
      const token = await getToken();
      const response = await axios.post(`/videos/watch-later/${video.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const added = response.data.action === "added";
      setIsWatchLater(added);
      toast.success(added ? "Added to Watch Later" : "Removed from Watch Later");
    } catch (error) {
      console.error("Failed to toggle watch later:", error);
      toast.error("Something went wrong");
    } finally {
      setIsToggling(false);
    }
  };
  return (
    <div 
      onClick={() => router.push(`/watch/${video.id}`)} 
      className="group flex flex-col md:flex-row gap-6 p-2 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full md:w-[360px] lg:w-[400px] flex-shrink-0 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
        <img 
          src={video.thumbnailUrl || "/placeholder-thumbnail.jpg"} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/1280x720/1e293b/white?text=JoTube";
          }}
        />
        
        {/* Play overlay for hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
             <div className="size-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl scale-75 group-hover:scale-100 transition-transform duration-500">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1.5" />
             </div>
        </div>

        {/* Watch Later Button */}
        <Button
          onClick={toggleWatchLater}
          disabled={isToggling}
          variant="secondary"
          size="icon"
          className={cn(
            "absolute top-2 right-2 size-8 rounded-lg bg-black/60 hover:bg-black/80 border-none text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md scale-90 group-hover:scale-100",
            isWatchLater && "bg-red-600 hover:bg-red-700 opacity-100"
          )}
          title={isWatchLater ? "Added to Watch Later" : "Watch Later"}
        >
          {isWatchLater ? <Check className="size-4" /> : <Clock className="size-4" />}
        </Button>
      </div>

      {/* Info Section ... */}

      {/* Info Section */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-1 text-[13px] font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-tight">
          <span>{video.viewCount} views</span>
          <span className="text-[10px] opacity-30">•</span>
          <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
        </div>

        {/* Channel Info */}
        <div className="flex items-center gap-3 mt-4 group/channel">
          <Avatar className="size-8 ring-2 ring-transparent group-hover/channel:ring-red-500/20 transition-all">
            <AvatarImage src={video.channel.imageUrl || video.channel.user?.image} />
            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
              {video.channel.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover/channel:text-slate-900 dark:group-hover/channel:text-white transition-colors">
              {video.channel.name}
            </span>
            <CheckCircle className="size-3.5 text-slate-400 fill-slate-400/10" />
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-4 font-medium leading-relaxed">
          {video.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}
