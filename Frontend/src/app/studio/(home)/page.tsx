"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UsersIcon,
  VideoIcon,
  EyeIcon,
  TrendingUpIcon
} from "lucide-react";

export default function StudioView() {
  const stats = [
    { title: "Total Subscribers", value: "0", icon: UsersIcon, color: "text-blue-500" },
    { title: "Views (Last 28 days)", value: "0", icon: EyeIcon, color: "text-purple-500" },
    { title: "Watch Time (Hours)", value: "0.0", icon: TrendingUpIcon, color: "text-green-500" },
    { title: "Uploaded Videos", value: "0", icon: VideoIcon, color: "text-red-500" },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Channel Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here's what's happening with your channel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-3xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <stat.icon className={`size-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-3xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
            <CardTitle className="text-xl font-extrabold">Recent Content</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col items-center justify-center text-center p-8">
            <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <VideoIcon className="size-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No videos yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2">
              Start sharing your passion with the world by uploading your first video.
            </p>
            <Button variant="outline" className="mt-6 rounded-xl border-slate-200 dark:border-slate-800 font-bold">
              Learn more
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
            <CardTitle className="text-xl font-extrabold">Latest News</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                  {i === 1 ? "New Creator Guidelines for 2026" : "Protecting your channel from phishing"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  15 minutes ago • YouTube Team
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
