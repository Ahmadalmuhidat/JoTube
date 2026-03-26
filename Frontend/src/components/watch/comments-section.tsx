"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "@/config/axios";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, ThumbsDown, User2, Send, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CommentsSectionProps {
  videoId: string;
  videoComments?: any[];
}

export const CommentsSection = ({ videoId, videoComments = [] }: CommentsSectionProps) => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [comments, setComments] = useState<any[]>(videoComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize internal state with props if they change
  useEffect(() => {
    setComments(videoComments);
  }, [videoComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    if (!isSignedIn) {
      toast.error("Please sign in to add a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const response = await axios.post("/videos/comment", {
        videoId,
        content: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments([response.data.comment, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const token = await getToken();
      await axios.delete(`/videos/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mt-8 px-4 sm:px-0">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="size-5" />
          {comments.length} Comments
        </h2>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
            Sort by: Newest
        </div>
      </div>
      
      {/* Add Comment */}
      {isSignedIn && (
        <div className="flex gap-4 mb-8 group/comment">
          <Avatar className="size-10 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <AvatarFallback className="bg-slate-100 dark:bg-slate-800"><User2 className="size-5 text-slate-500" /></AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Input 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="border-none border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 dark:border-slate-800 dark:focus-visible:border-white transition-all bg-transparent px-0 text-base"
            />
            <div className="flex justify-end gap-2 opacity-0 group-focus-within/comment:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                className="rounded-full font-bold"
                onClick={() => setNewComment("")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !newComment.trim()}
                className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold px-6 flex items-center gap-2"
              >
                {isSubmitting ? "Posting..." : "Comment"}
                {!isSubmitting && <Send className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group/item">
            <Avatar className="size-10 border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-transform group-hover/item:scale-105">
              <AvatarImage src={comment.user?.image} />
              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                {comment.user?.name?.[0] || comment.user?.clerkId?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    @{comment.user?.name || "anonymous"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) + " ago" : "just now"}
                  </span>
                </div>
                
                {user?.id === comment.user?.clerkId && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(comment.id)}
                    className="size-8 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 group/like cursor-pointer text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors">
                  <ThumbsUp className="size-3.5 group-hover/like:scale-110 transition-transform" />
                  <span className="text-xs font-bold">0</span>
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
