"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, MoreVertical, Clock, Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import axios from "@/config/axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
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

export function VideoCard({ video }: VideoCardProps) {
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
    <div className="group flex flex-col gap-2 cursor-pointer">
      {/* Thumbnail */}
      <Link href={`/watch/${video.id}`} className="relative aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden block">
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
      </Link>

      <div className="flex gap-2">
        {/* Channel Avatar */}
        <Link href={`/channels/${video.channel.id}`} className="flex-shrink-0 pt-1">
          <Avatar className="size-8">
            <AvatarImage src={video.channel.imageUrl || video.channel.user?.image} />
            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-[10px]">
              {video.channel.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-start gap-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight">
              {video.title}
            </h3>
            <Button variant="ghost" size="icon" className="size-8 -mr-2 flex-shrink-0 opacity-0 group-hover:opacity-100 rounded-full">
              <MoreVertical className="size-4 text-slate-500" />
            </Button>
          </div>

          <div className="flex flex-col mt-1">
            <Link href={`/channels/${video.channel.id}`} className="flex items-center gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                {video.channel.name}
              </span>
              <CheckCircle className="size-3 text-slate-400" />
            </Link>
            
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span>{video.viewCount} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
