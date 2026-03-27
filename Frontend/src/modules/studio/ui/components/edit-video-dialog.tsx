"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  GlobeIcon, 
  LockIcon, 
  EyeIcon, 
  Loader2,
  SaveIcon
} from "lucide-react";
import axios from "@/config/axios";
import { cn } from "@/lib/utils";

const editSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(5000).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED", "DRAFT"]),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditVideoDialogProps {
  video: {
    id: string;
    title: string;
    description: string;
    visibility: "PUBLIC" | "PRIVATE" | "UNLISTED" | "DRAFT";
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditVideoDialog({ video, open, onOpenChange }: EditVideoDialogProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: video.title,
      description: video.description || "",
      visibility: video.visibility,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: EditFormValues) => {
      const token = await getToken();
      const response = await axios.put(`/videos/${video.id}`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-videos"] });
      toast.success("Video updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update video");
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
        <DialogHeader className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/50">
          <DialogTitle className="text-2xl font-black">Edit video details</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">Update your video's metadata and visibility settings.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="p-8 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest pl-1">Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-6 font-bold text-lg focus-visible:ring-red-600 transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest pl-1">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[160px] rounded-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 font-medium focus-visible:ring-red-600 resize-none transition-all" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest pl-1">Visibility</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'PUBLIC', label: 'Public', icon: GlobeIcon },
                        { value: 'PRIVATE', label: 'Private', icon: LockIcon },
                        { value: 'UNLISTED', label: 'Unlisted', icon: EyeIcon },
                        { value: 'DRAFT', label: 'Draft', icon: Loader2 },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 text-left",
                            field.value === opt.value 
                              ? "bg-white dark:bg-slate-800 border-red-500 shadow-sm ring-4 ring-red-500/5" 
                              : "bg-white/50 dark:bg-slate-900/30 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-xl",
                            field.value === opt.value ? "bg-red-50 dark:bg-red-900/20 text-red-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          )}>
                            <opt.icon className="size-4" />
                          </div>
                          <span className={cn(
                            "text-sm font-bold",
                            field.value === opt.value ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                          )}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6 gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                className="rounded-2xl h-12 px-8 font-bold text-slate-500"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="rounded-2xl h-12 px-10 bg-red-600 hover:bg-red-700 text-white font-black shadow-xl shadow-red-600/20 gap-2"
              >
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
