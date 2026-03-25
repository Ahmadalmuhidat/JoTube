"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/config/axios";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuggestionsSectionProps {
  videoId: string;
}

export const SuggestionsSection = ({ videoId }: SuggestionsSectionProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`/videos/suggestions/${videoId}`);
        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [videoId]);

  if (isLoading) {
    return <div className="space-y-4 px-4 sm:px-0">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex gap-3">
          <div className="w-[160px] aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-[60%] bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>;
  }

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
        {suggestions.map((video) => (
          <Link 
            key={video.id} 
            href={`/watch/${video.id}`}
            className="group flex gap-3 p-1 rounded-xl transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800/40 cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-[160px] flex-shrink-0 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow">
               {video.thumbnailUrl ? (
                 <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 />
               ) : (
                 <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center">
                    <div className="size-8 bg-black/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white/60 border-b-[4px] border-b-transparent ml-0.5" />
                    </div>
                 </div>
               )}
            </div>
            
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-start gap-1">
                 <h3 className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                   {video.title}
                 </h3>
                 <Button variant="ghost" size="icon" className="size-6 -mr-1 opacity-0 group-hover:opacity-100 transition-all rounded-full bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700">
                   <MoreVertical className="size-3.5" />
                 </Button>
              </div>
              <div className="flex flex-col gap-0.5">
                 <div className="flex items-center gap-1 group/channel">
                   <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover/channel:text-slate-700 dark:group-hover/channel:text-slate-200 transition-colors uppercase tracking-tight">{video.channel.name}</span>
                   <CheckCircle className="size-2.5 text-slate-400 fill-slate-400/20" />
                 </div>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                   <span>{video.viewCount} views</span>
                   <span>•</span>
                   <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
