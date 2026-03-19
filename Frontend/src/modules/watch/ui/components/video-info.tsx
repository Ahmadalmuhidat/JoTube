"use client";

import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const VideoInfo = () => {
  return (
    <div className="mt-4 px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
        10 Professional Tips for Modern Web Design in 2026
      </h1>
      
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Channel Info */}
        <div className="flex items-center gap-4 group">
          <div className="relative p-0.5 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-800 shadow-sm group-hover:shadow-md transition-all">
            <Avatar className="size-10 border-2 border-white dark:border-slate-950">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JT</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
                <span className="font-bold text-slate-900 dark:text-white text-base">JoTube Studio</span>
                <CheckCircle className="size-3.5 text-slate-500 fill-slate-500 dark:text-slate-400 dark:fill-slate-400" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">1.5M subscribers</span>
          </div>
          
          <Button variant="outline" className="ml-4 rounded-full px-6 font-bold bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-opacity border-none">
            Subscribe
          </Button>
        </div>
        
        {/* Actions Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
           <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-full h-10 p-1 border border-slate-200/50 dark:border-slate-700/50">
             <Button variant="ghost" size="sm" className="rounded-l-full px-4 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold border-r border-slate-200/50 dark:border-slate-700/50">
               <ThumbsUp className="size-4" /> 124K
             </Button>
             <Button variant="ghost" size="sm" className="rounded-r-full px-4 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold">
               <ThumbsDown className="size-4" />
             </Button>
           </div>
           
           <Button variant="secondary" className="rounded-full h-10 px-4 flex items-center gap-2 font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
             <Share2 className="size-4" /> Share
           </Button>
           
           <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50">
             <MoreHorizontal className="size-4" />
           </Button>
        </div>
      </div>
      
      {/* Video Description Mockup */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-100 hover:bg-slate-200/60 transition-colors dark:bg-slate-800/80 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-slate-200/20 dark:border-slate-700/20 group/desc">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
            <span>2.4M views</span>
            <span className="text-slate-400">•</span>
            <span>2 days ago</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Discover the future of video sharing with JoTube. Our platform offers a premium, modern, and high-performance environment for creators and viewers alike. Join our community and experience the next level of entertainment.
          </p>
          <div className="mt-2 flex gap-3 text-slate-900 dark:text-white font-bold text-sm cursor-pointer hover:underline underline-offset-4 w-fit">
            ...more
          </div>
      </div>
    </div>
  );
};
