"use client";

import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "@/config/axios";

interface ChannelHeaderProps {
  channel: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    bannerUrl: string | null;
    _count: {
      subscribers: number;
      videos: number;
    };
    user: {
      image: string;
    };
    isSubscribed: boolean;
  };
}

export const ChannelHeader = ({ channel }: ChannelHeaderProps) => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(channel.isSubscribed);
  const [subCount, setSubCount] = useState(channel._count.subscribers);
  const [isLoading, setIsLoading] = useState(false);

  const onSubscribe = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to subscribe");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      if (isSubscribed) {
        await axios.post(`/channels/${channel.id}/unsubscribe`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubscribed(false);
        setSubCount(prev => prev - 1);
        toast.success("Unsubscribed");
      } else {
        await axios.post(`/channels/${channel.id}/subscribe`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubscribed(true);
        setSubCount(prev => prev + 1);
        toast.success("Subscribed!");
      }
      
      // Invalidate subscriptions query to update sidebar
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="relative w-full aspect-[6/1] md:aspect-[7/1] lg:aspect-[8/1] bg-slate-200 dark:bg-slate-800 overflow-hidden">
        {channel.bannerUrl ? (
          <img 
            src={channel.bannerUrl} 
            alt={`${channel.name} banner`} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
            <span className="text-slate-300 dark:text-slate-700 font-bold text-4xl tracking-widest uppercase select-none opacity-50">JoTube</span>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-8 relative z-10 bg-white dark:bg-slate-950">
        <Avatar className="size-24 md:size-40 rounded-full border-none shadow-none">
          <AvatarImage src={channel.imageUrl || channel.user.image} />
          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-3xl font-bold text-slate-500">
            {channel.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center gap-2 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
              {channel.name}
            </h1>
            <CheckCircle className="size-5 text-slate-400" />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="font-bold text-slate-900 dark:text-white">{subCount.toLocaleString()} Subscribers</span>
            <span>•</span>
            <span>{channel._count.videos} videos</span>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl mt-1">
            {channel.description || "No description provided."}
          </p>

          <div className="pt-2">
            <Button 
              onClick={onSubscribe}
              disabled={isLoading}
              className={`rounded-full px-6 py-2.5 h-auto font-bold transition-colors ${
                isSubscribed 
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700" 
                : "bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-none"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
