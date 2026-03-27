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
    <div className="group flex flex-col gap-3 cursor-pointer">
      {/* Thumbnail */}
      <Link href={`/watch/${video.id}`} className="relative aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:-translate-y-1.5 transition-all duration-500 block">
        <img 
          src={video.thumbnailUrl || "/placeholder-thumbnail.jpg"} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/1280x720/1e293b/white?text=JoTube";
          }}
        />
        
        {/* Play overlay */}
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
      </Link>

      <div className="flex gap-3 px-1">
        {/* Channel Avatar */}
        <Link href={`/channels/${video.channel.id}`}>
          <Avatar className="size-9 ring-2 ring-transparent group-hover:ring-red-500/20 transition-all duration-300">
            <AvatarImage src={video.channel.imageUrl || video.channel.user?.image} />
            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
              {video.channel.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col flex-1 min-w-0 gap-1 mt-0.5">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-[17px] font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-[1.2] group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
              {video.title}
            </h3>
            <Button variant="ghost" size="icon" className="size-8 -mr-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <MoreVertical className="size-4 text-slate-400" />
            </Button>
          </div>

          <div className="flex flex-col gap-0.5 mt-0.5">
            <Link href={`/channels/${video.channel.id}`} className="flex items-center gap-1 group/channel cursor-pointer">
              <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 group-hover/channel:text-slate-900 dark:group-hover/channel:text-white transition-colors">
                {video.channel.name}
              </span>
              <CheckCircle className="size-3 text-slate-400 fill-slate-400/20" />
            </Link>
            
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
              <span>{video.viewCount} views</span>
              <span className="text-[8px] opacity-30">•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
