"use client";

import { MessageSquare, ThumbsUp, ThumbsDown, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_COMMENTS = [
  { id: 1, user: "Alice", avatar: "A", time: "2 hours ago", text: "This is exactly what I needed! The design is so clean and premium.", likes: 120 },
  { id: 2, user: "Bob", avatar: "B", time: "5 hours ago", text: "JoTube is the best YouTube clone I've seen so far. Great job!", likes: 85 },
  { id: 3, user: "Charlie", avatar: "C", time: "1 day ago", text: "Love the dark mode and the glassmorphism effects.", likes: 45 },
];

export const CommentsSection = () => {
  return (
    <div className="mt-8 px-4 sm:px-0">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="size-5" />
          5.2K Comments
        </h2>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
            Sort by: Top
        </div>
      </div>
      
      {/* Add Comment */}
      <div className="flex gap-4 mb-8 group/comment">
        <Avatar className="size-10 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <AvatarFallback className="bg-slate-100 dark:bg-slate-800"><User2 className="size-5 text-slate-500" /></AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Input 
            placeholder="Add a comment..." 
            className="border-none border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 dark:border-slate-800 dark:focus-visible:border-white transition-all bg-transparent px-0 text-base"
          />
          <div className="flex justify-end gap-2 opacity-0 group-focus-within/comment:opacity-100 transition-opacity">
            <Button variant="ghost" className="rounded-full font-bold">Cancel</Button>
            <Button className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold px-6">Comment</Button>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-8">
        {MOCK_COMMENTS.map((comment) => (
          <div key={comment.id} className="flex gap-4 group/item">
            <Avatar className="size-10 border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-transform group-hover/item:scale-105">
              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">{comment.user[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">@{comment.user.toLowerCase()}</span>
                <span className="text-xs text-slate-500">{comment.time}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {comment.text}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 group/like cursor-pointer text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors">
                  <ThumbsUp className="size-3.5 group-hover/like:scale-110 transition-transform" />
                  <span className="text-xs font-bold">{comment.likes}</span>
                </div>
                <div className="group/dislike cursor-pointer text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors">
                  <ThumbsDown className="size-3.5 group-hover/dislike:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white cursor-pointer transition-colors ml-2">Reply</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
