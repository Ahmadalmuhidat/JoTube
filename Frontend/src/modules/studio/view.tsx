"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/config/axios";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UsersIcon,
  VideoIcon,
  EyeIcon,
  TrendingUpIcon,
  MessageSquare,
  ThumbsUp,
  Clock
} from "lucide-react";

interface StudioStats {
  subscribers: number;
  videos: number;
  views: number;
  watchTime: string;
}

interface StudioVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  createdAt: string;
  _count: {
    comments: number;
    likes: number;
    dislikes: number;
  };
}

export default function StudioView() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [stats, setStats] = useState<StudioStats | null>(null);
  const [videos, setVideos] = useState<StudioVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();
        if (!token) return;

        const [statsRes, videosRes] = await Promise.all([
          axios.get<StudioStats>("/studio/stats", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get<StudioVideo[]>("/studio/videos", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats(statsRes.data);
        setVideos(videosRes.data);
      } catch (error) {
        console.error("Failed to fetch studio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, getToken]);

  const statCards = [
    { title: "Total Subscribers", value: stats?.subscribers ?? "0", icon: UsersIcon, color: "text-blue-500" },
    { title: "Total Views", value: stats?.views ?? "0", icon: EyeIcon, color: "text-purple-500" },
    { title: "Estimated Watch Time", value: stats?.watchTime ?? "0.0", icon: TrendingUpIcon, color: "text-green-500" },
    { title: "Uploaded Videos", value: stats?.videos ?? "0", icon: VideoIcon, color: "text-red-500" },
  ];

  if (isLoading) {
    return <div className="p-6 space-y-6">
        <div className="h-8 w-40 bg-slate-100 dark:bg-slate-900 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900 rounded" />)}
        </div>
        <div className="h-[300px] bg-slate-100 dark:bg-slate-900 rounded" />
    </div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Channel Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back! Here's what's happening with your channel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <stat.icon className={`size-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none overflow-hidden">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <CardTitle className="text-lg font-bold">Recent Content</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {videos.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {videos.map((video) => (
                  <div key={video.id} className="p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="relative aspect-video w-32 flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 overflow-hidden">
                      {video.thumbnailUrl ? (
                         <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
                      )}
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{video.title}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                           {formatDistanceToNow(new Date(video.createdAt))} ago
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <EyeIcon className="size-3.5" />
                          <span className="text-xs font-semibold">{video.viewCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MessageSquare className="size-3.5" />
                          <span className="text-xs font-semibold">{video._count.comments}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <ThumbsUp className="size-3.5" />
                          <span className="text-xs font-semibold">{video._count.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full mb-4">
                  <VideoIcon className="size-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No videos yet</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-2">
                  Start sharing your passion with the world by uploading your first video.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none overflow-hidden">
             <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <CardTitle className="text-lg font-bold">Creator Tips</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                 <div className="flex gap-4">
                    <div className="size-10 shrink-0 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <TrendingUpIcon className="size-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Optimizing Thumbnails</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vibrant colors and clear text can increase click-through rates.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="size-10 shrink-0 rounded bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                        <Clock className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Posting Schedule</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consistency is key. Try to post at least once a week.</p>
                    </div>
                 </div>
             </CardContent>
        </Card>
      </div>
    </div>
  );
}
