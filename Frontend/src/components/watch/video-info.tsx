"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/config/axios";
import { toast } from "sonner";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, CheckCircle, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface VideoInfoProps {
  video?: {
    id: string;
    title: string;
    description: string | null;
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    isLiked: boolean;
    isDisliked: boolean;
    isSubscribed: boolean;
    isWatchLater: boolean;
    createdAt: string;
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

export const VideoInfo = ({ video }: VideoInfoProps) => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [likes, setLikes] = useState(video?.likeCount || 0);
  const [dislikes, setDislikes] = useState(video?.dislikeCount || 0);
  const [isLiked, setIsLiked] = useState(video?.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(video?.isDisliked || false);
  const [isSubscribed, setIsSubscribed] = useState(video?.isSubscribed || false);
  const [isWatchLater, setIsWatchLater] = useState(video?.isWatchLater || false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isTogglingWatchLater, setIsTogglingWatchLater] = useState(false);

  if (!video) return null;
 
  const handleWatchLater = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to save videos");
      return;
    }

    setIsTogglingWatchLater(true);
    try {
      const token = await getToken();
      const response = await axios.post(`/videos/watch-later/${video.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const added = response.data.action === "added";
      setIsWatchLater(added);
      toast.success(added ? "Added to Watch Later" : "Removed from Watch Later");
    } catch (error) {
      console.error("Watch Later error:", error);
      toast.error("Failed to update Watch Later");
    } finally {
      setIsTogglingWatchLater(false);
    }
  };

  const handleLike = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to like this video");
      return;
    }

    setIsLiking(true);
    try {
      const token = await getToken();
      const response = await axios.post("/videos/like", { videoId: video.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.action === 'liked') {
        setLikes(prev => prev + 1);
        setIsLiked(true);
        if (response.data.removedDislike) {
          setDislikes(prev => prev - 1);
          setIsDisliked(false);
        }
        toast.success("Liked!");
      } else if (response.data.action === 'removed_like') {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to dislike this video");
      return;
    }

    setIsDisliking(true);
    try {
      const token = await getToken();
      const response = await axios.post("/videos/dislike", { videoId: video.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.action === 'disliked') {
        setDislikes(prev => prev + 1);
        setIsDisliked(true);
        if (response.data.removedLike) {
          setLikes(prev => prev - 1);
          setIsLiked(false);
        }
        toast.success("Disliked");
      } else if (response.data.action === 'removed_dislike') {
        setDislikes(prev => prev - 1);
        setIsDisliked(false);
      }
    } catch (error) {
      console.error("Dislike error:", error);
      toast.error("Failed to update dislike");
    } finally {
      setIsDisliking(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to subscribe");
      return;
    }

    setIsSubscribing(true);
    try {
      const token = await getToken();
      if (isSubscribed) {
        await axios.post("/videos/unsubscribe", { videoId: video.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubscribed(false);
        toast.success("Unsubscribed");
      } else {
        await axios.post("/videos/subscribe", { videoId: video.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubscribed(true);
        toast.success("Subscribed!");
      }
      
      // Invalidate subscriptions query to update sidebar
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (error) {
      console.error("Subscribe error:", error);
      toast.error("Failed to update subscription");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="mt-4 px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
        {video.title}
      </h1>
      
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Channel Info */}
        <div className="flex items-center gap-4 group">
          <Link href={`/channels/${video.channel.id}`} className="relative p-0.5 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-800 shadow-sm group-hover:shadow-md transition-all">
            <Avatar className="size-10 border-2 border-white dark:border-slate-950">
              <AvatarImage src={video.channel.imageUrl || video.channel.user?.image} />
              <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex flex-col">
            <Link href={`/channels/${video.channel.id}`} className="flex items-center gap-1">
                <span className="font-bold text-slate-900 dark:text-white text-base hover:text-red-600 transition-colors">{video.channel.name}</span>
                <CheckCircle className="size-3.5 text-slate-500 fill-slate-500 dark:text-slate-400 dark:fill-slate-400" />
            </Link>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Channel</span>
          </div>
          
          {isSignedIn && (
            <Button 
              variant={isSubscribed ? "secondary" : "default"}
              disabled={isSubscribing}
              onClick={handleSubscribe}
              className={cn(
                "ml-4 rounded-full px-6 font-bold transition-all border-none",
                !isSubscribed && "bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90",
                isSubscribed && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
              )}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
        </div>
        
        {/* Actions Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
           {isSignedIn && (
             <>
               <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-full h-10 p-1 border border-slate-200/50 dark:border-slate-700/50">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   disabled={isLiking}
                   onClick={handleLike}
                   className={cn(
                     "rounded-l-full px-4 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold border-r border-slate-200/50 dark:border-slate-700/50",
                     isLiked && "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                   )}
                 >
                   <ThumbsUp className={cn("size-4", isLiked && "fill-current")} /> {likes}
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   disabled={isDisliking}
                   onClick={handleDislike}
                   className={cn(
                     "rounded-r-full px-4 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold",
                     isDisliked && "text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20"
                   )}
                 >
                   <ThumbsDown className={cn("size-4", isDisliked && "fill-current")} /> {dislikes > 0 && dislikes}
                 </Button>
               </div>

               <Button 
                 variant="secondary" 
                 onClick={handleWatchLater}
                 disabled={isTogglingWatchLater}
                 className={cn(
                   "rounded-full h-10 px-4 flex items-center gap-2 font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 transition-all",
                   isWatchLater && "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200/50 dark:border-red-800/50"
                 )}
               >
                 {isWatchLater ? <Check className="size-4" /> : <Clock className="size-4" />}
                 Watch Later
               </Button>
             </>
           )}
           
           <Button variant="secondary" className="rounded-full h-10 px-4 flex items-center gap-2 font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
             <Share2 className="size-4" /> Share
           </Button>
           
           <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50">
             <MoreHorizontal className="size-4" />
           </Button>
        </div>
      </div>
      
      {/* Video Description */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-100 hover:bg-slate-200/60 transition-colors dark:bg-slate-800/80 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-slate-200/20 dark:border-slate-700/20 group/desc">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
            <span>{video.viewCount} views</span>
            <span className="text-slate-400">•</span>
            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
            {video.description || "No description provided."}
          </p>
      </div>
    </div>
  );
};
