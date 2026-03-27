"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  VideoIcon, 
  MoreVertical, 
  PencilIcon, 
  Trash2Icon, 
  GlobeIcon, 
  LockIcon, 
  EyeIcon, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import axios from "@/config/axios";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditVideoDialog } from "../ui/components/edit-video-dialog";

interface StudioVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED" | "DRAFT";
  viewCount: number;
  createdAt: string;
  _count: {
    comments: number;
    likes: number;
    dislikes: number;
  };
}

export default function ContentView() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [editingVideo, setEditingVideo] = useState<StudioVideo | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const { data: videos, isLoading } = useQuery<StudioVideo[]>({
    queryKey: ["studio-videos"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get("/studio/videos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      await axios.delete(`/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-videos"] });
      toast.success("Video deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete video");
    }
  });

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "PUBLIC": return <GlobeIcon className="size-4 text-green-500" />;
      case "PRIVATE": return <LockIcon className="size-4 text-slate-400" />;
      case "UNLISTED": return <EyeIcon className="size-4 text-blue-400" />;
      default: return <Loader2 className="size-4 text-slate-400" />;
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 w-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
          <div className="h-16 bg-slate-50 dark:bg-slate-900 animate-pulse border-b border-slate-200 dark:border-slate-800" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 animate-pulse px-6 flex items-center gap-4">
              <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-[40%] bg-slate-100 dark:bg-slate-800 rounded-md" />
                <div className="h-3 w-[20%] bg-slate-100 dark:bg-slate-800 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Channel content</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Manage your video library</p>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden backdrop-blur-3xl">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[450px] font-black uppercase text-[10px] tracking-widest h-14 px-6">Video</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest h-14">Visibility</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest h-14">Date</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest h-14 text-right">Views</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest h-14 text-right">Comments</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest h-14 text-right">Likes</TableHead>
              <TableHead className="w-[100px] text-right px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-80 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-full">
                      <VideoIcon className="size-10 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white text-lg">No content found</p>
                      <p className="text-sm text-slate-500">You haven't uploaded any videos yet.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              videos?.map((video) => (
                <TableRow key={video.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-4">
                      <div className="relative aspect-video w-32 flex-shrink-0 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            <VideoIcon className="size-6 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">{video.title}</h3>
                        <p className="text-xs text-slate-400 font-medium line-clamp-1">{video.description || "No description provided"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getVisibilityIcon(video.visibility)}
                      <span className="text-xs font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">{video.visibility}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {format(new Date(video.createdAt), "MMM d, yyyy")}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Published</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-black text-slate-900 dark:text-white">{video.viewCount}</TableCell>
                  <TableCell className="text-right font-bold text-slate-600 dark:text-slate-400">{video._count.comments}</TableCell>
                  <TableCell className="text-right font-bold text-slate-600 dark:text-slate-400">{video._count.likes}</TableCell>
                  <TableCell className="px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-none">
                          <MoreVertical className="size-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
                        <DropdownMenuItem 
                          onClick={() => setEditingVideo(video)}
                          className="rounded-xl gap-3 p-3 font-bold cursor-pointer"
                        >
                          <PencilIcon className="size-4" />
                          Edit metadata
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(video.id)}
                          className="rounded-xl gap-3 p-3 font-bold cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                        >
                          <Trash2Icon className="size-4" />
                          Delete video
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingVideo && (
        <EditVideoDialog
          video={editingVideo}
          open={!!editingVideo}
          onOpenChange={(open) => !open && setEditingVideo(null)}
        />
      )}
    </div>
  );
}
