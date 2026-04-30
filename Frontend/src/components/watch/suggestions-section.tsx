"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/config/axios";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-4 px-4 sm:px-0">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {["All", "Related", "Live", "Music", "Tech", "Gaming"].map((tag) => (
          <Button key={tag} variant="secondary" size="sm" className={cn("rounded-md px-4 h-8 text-xs font-semibold transition-colors", tag === 'All' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700')}>
            {tag}
          </Button>
        ))}
      </div>
      
      <div className="space-y-3">
        {suggestions.map((video) => (
          <Link 
            key={video.id} 
            href={`/watch/${video.id}`}
            className="group flex gap-3 p-1 rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-[160px] flex-shrink-0 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
               {video.thumbnailUrl ? (
                 <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="absolute inset-0 bg-slate-300 dark:bg-slate-900 flex items-center justify-center">
                    <div className="size-8 bg-black/10 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white/60 border-b-[4px] border-b-transparent ml-0.5" />
                    </div>
                 </div>
               )}
            </div>
            
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-start gap-1">
                 <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                   {video.title}
                 </h3>
                 <Button variant="ghost" size="icon" className="size-6 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                   <MoreVertical className="size-3.5 text-slate-500" />
                 </Button>
              </div>
              <div className="flex flex-col">
                 <div className="flex items-center gap-1">
                   <span className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{video.channel.name}</span>
                   <CheckCircle className="size-2.5 text-slate-400" />
                 </div>
                 <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
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
