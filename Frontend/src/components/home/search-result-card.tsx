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
      className="group flex flex-col md:flex-row gap-4 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full md:w-[240px] lg:w-[280px] flex-shrink-0 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
        <img 
          src={video.thumbnailUrl || "/placeholder-thumbnail.jpg"} 
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/1280x720/1e293b/white?text=JoTube";
          }}
        />
        
        {/* Watch Later Button */}
        <Button
          onClick={toggleWatchLater}
          disabled={isToggling}
          variant="secondary"
          size="icon"
          className={cn(
            "absolute top-1.5 right-1.5 size-7 rounded-md bg-black/70 hover:bg-black/90 border-none text-white opacity-0 group-hover:opacity-100 transition-opacity",
            isWatchLater && "bg-red-600 hover:bg-red-700 opacity-100"
          )}
          title={isWatchLater ? "Added to Watch Later" : "Watch Later"}
        >
          {isWatchLater ? <Check className="size-3.5" /> : <Clock className="size-3.5" />}
        </Button>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 md:line-clamp-1 leading-snug">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>{video.viewCount} views</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
        </div>

        {/* Channel Info */}
        <div className="flex items-center gap-2 mt-3">
          <Avatar className="size-6">
            <AvatarImage src={video.channel.imageUrl || video.channel.user?.image} />
            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-[8px]">
              {video.channel.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              {video.channel.name}
            </span>
            <CheckCircle className="size-3 text-slate-400" />
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-2">
          {video.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}
