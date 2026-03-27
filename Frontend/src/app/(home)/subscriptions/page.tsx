"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/config/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionsPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const response = await axios.get("/channels/subscriptions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubscriptions(response.data || []);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchSubscriptions();
    }
  }, [isSignedIn, isLoaded, getToken]);

  if (!isLoaded || isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48 bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <Skeleton className="size-24 rounded-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-6 w-32 bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-4 w-24 bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-10 w-full mt-2 bg-slate-100 dark:bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
          <Users className="size-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Manage your subscriptions</h1>
        <p className="text-slate-500 max-w-md mb-8 font-medium">Sign in to see a list of all the channels you've subscribed to</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">All Subscriptions</h1>
          <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
            {subscriptions.length} {subscriptions.length === 1 ? 'channel' : 'channels'}
          </p>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">You haven't subscribed to any channels yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {subscriptions.map((channel) => (
            <Link 
              key={channel.id} 
              href={`/channels/${channel.id}`}
              className="group flex flex-col items-center p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-red-500/20 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <Avatar className="size-24 md:size-28 border-4 border-white dark:border-slate-950 shadow-lg ring-2 ring-slate-100 dark:ring-slate-800 transition-transform duration-500 group-hover:scale-110">
                <AvatarImage src={channel.imageUrl || channel.user?.image} />
                <AvatarFallback className="text-2xl font-black bg-slate-100 dark:bg-slate-800">{channel.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="mt-4 flex flex-col items-center text-center">
                <div className="flex items-center gap-1">
                  <span className="font-black text-slate-900 dark:text-white text-base group-hover:text-red-600 transition-colors line-clamp-1">{channel.name}</span>
                  <CheckCircle className="size-3.5 text-slate-400 fill-slate-400/10" />
                </div>
                <div className="flex items-center gap-1 mt-1 text-[13px] font-bold text-slate-500 dark:text-slate-400">
                  <Users className="size-3.5" />
                  <span>{channel._count.subscribers.toLocaleString()} sub</span>
                </div>
              </div>
              
              <Button className="w-full mt-6 rounded-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white font-black text-xs uppercase tracking-widest transition-all">
                Visit Channel
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
