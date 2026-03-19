"use client";

import { CheckCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_SUGGESTIONS = [
  { id: 1, title: "Building a YouTube Clone with Next.js & tRPC", channel: "CodeMaster", views: "1.2M", time: "3 days ago", duration: "12:34" },
  { id: 2, title: "Modern Design Trends in 2026", channel: "Design Hub", views: "850K", time: "1 week ago", duration: "8:12" },
  { id: 3, title: "Understanding React Server Components", channel: "Dev Academy", views: "500K", time: "2 weeks ago", duration: "15:45" },
  { id: 4, title: "The Power of Tailwind CSS v4", channel: "Tailwind Guru", views: "2.1M", time: "1 month ago", duration: "10:20" },
  { id: 5, title: "How to Build Scalable Backend Systems", channel: "System Architect", views: "340K", time: "5 days ago", duration: "22:15" },
  { id: 6, title: "UI/UX Best Practices for SaaS", channel: "Creative Mind", views: "150K", time: "2 months ago", duration: "14:50" },
];

export const SuggestionsSection = () => {
  return (
    <div className="flex flex-col gap-4 px-4 sm:px-0 scroll-mt-24">
      <div className="flex items-center gap-2 mb-2 overflow-x-auto no-scrollbar pb-2">
        {["All", "Related", "Live", "Music", "Tech", "Gaming"].map((tag) => (
          <Button key={tag} variant="secondary" size="sm" className={`rounded-lg px-4 h-8 text-xs font-bold transition-all ${tag === 'All' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            {tag}
          </Button>
        ))}
      </div>
      
      <div className="space-y-3">
        {MOCK_SUGGESTIONS.map((video) => (
          <div key={video.id} className="group flex gap-3 p-1 rounded-xl transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800/40 cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50">
            {/* Thumbnail Mockup */}
            <div className="relative aspect-video w-[160px] flex-shrink-0 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow">
               <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center">
                 <div className="size-8 bg-black/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white/60 border-b-[4px] border-b-transparent ml-0.5" />
                 </div>
               </div>
               <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-bold text-white px-1.5 py-0.5 rounded backdrop-blur-md">
                 {video.duration}
               </span>
            </div>
            
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-start gap-1">
                 <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                   {video.title}
                 </h3>
                 <Button variant="ghost" size="icon" className="size-6 -mr-1 opacity-0 group-hover:opacity-100 transition-all rounded-full bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700">
                   <MoreVertical className="size-3.5" />
                 </Button>
              </div>
              <div className="flex flex-col gap-0.5">
                 <div className="flex items-center gap-1 group/channel">
                   <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover/channel:text-slate-700 dark:group-hover/channel:text-slate-200 transition-colors">{video.channel}</span>
                   <CheckCircle className="size-3 text-slate-400 fill-slate-400" />
                 </div>
                 <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                   <span>{video.views} views</span>
                   <span>•</span>
                   <span>{video.time}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
