"use client";

import { useAuth } from "@clerk/nextjs";
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
  };
}

export const ChannelHeader = ({ channel }: ChannelHeaderProps) => {
  const { getToken, isSignedIn } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false); // TODO: Fetch initial subscription status
  const [subCount, setSubCount] = useState(channel._count.subscribers);

  const onSubscribe = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      const token = await getToken();
      // TODO: Implement toggle subscription endpoint or use existing one if it exists
      // For now, just a placeholder UI toggle
      setIsSubscribed(!isSubscribed);
      setSubCount(prev => isSubscribed ? prev - 1 : prev + 1);
      toast.success(isSubscribed ? "Unsubscribed" : "Subscribed!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="relative w-full aspect-[6/1] md:aspect-[7/1] lg:aspect-[8/1] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden group/banner shadow-inner">
        {channel.bannerUrl ? (
          <img 
            src={channel.bannerUrl} 
            alt={`${channel.name} banner`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-900/50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-20" />
            <span className="text-slate-400 dark:text-slate-600 font-black text-4xl opacity-10 tracking-widest uppercase select-none">JoTube Discoveries</span>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 -mt-6 md:-mt-8 relative z-10 pb-4">
        <Avatar className="size-20 md:size-32 border-4 border-white dark:border-slate-950 shadow-2xl ring-4 ring-slate-100/10 transition-transform duration-500 hover:scale-105">
          <AvatarImage src={channel.imageUrl || channel.user.image} />
          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-2xl font-black">
            {channel.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-end gap-1 flex-1 pt-4 md:pt-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {channel.name}
            </h1>
            <CheckCircle className="size-5 text-red-600 fill-red-600/10" />
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-bold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <Users className="size-3.5" />
              <span>{subCount.toLocaleString()} sub</span>
            </div>
            <span>•</span>
            <span>{channel._count.videos} vid</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline max-w-md truncate opacity-70 font-medium">{channel.description || "No description provided."}</span>
          </div>
        </div>

        <div className="flex items-end pb-1">
          <Button 
            onClick={onSubscribe}
            className={`rounded-full px-6 py-5 h-auto text-sm font-black transition-all duration-300 shadow-lg active:scale-95 ${
              isSubscribed 
              ? "bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-800 dark:text-white" 
              : "bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/25"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>
    </div>
  );
};
