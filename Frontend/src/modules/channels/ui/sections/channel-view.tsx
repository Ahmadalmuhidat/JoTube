"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/config/axios";
import { ChannelHeader } from "../components/channel-header";
import { ChannelVideos } from "../components/channel-videos";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelViewProps {
  channelId: string;
}

export const ChannelView = ({ channelId }: ChannelViewProps) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [channel, setChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const token = isSignedIn ? await getToken() : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(`/channels/${channelId}`, { headers });
        setChannel(response.data);
      } catch (error) {
        console.error("Failed to fetch channel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchChannel();
    }
  }, [channelId, isLoaded, isSignedIn, getToken]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full max-w-[1800px] mx-auto animate-pulse">
        <div className="w-full aspect-[6/1] md:aspect-[5/1] bg-slate-200 dark:bg-slate-800" />
        <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 -mt-6 md:-mt-10 relative z-10 pb-8">
          <div className="size-24 md:size-40 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-950" />
          <div className="flex flex-col justify-end gap-3 flex-1 pt-4 md:pt-0">
             <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
             <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
             <div className="h-16 w-full max-w-2xl bg-slate-100 dark:bg-slate-800 rounded mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Channel Not Found</h2>
        <p className="text-sm text-slate-500">We couldn't find the creator you're looking for</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-transparent relative z-0">
      <div className="max-w-[1800px] mx-auto w-full">
        <ChannelHeader channel={channel} />
        <ChannelVideos videos={channel.videos || []} />
      </div>
    </div>
  );
};
