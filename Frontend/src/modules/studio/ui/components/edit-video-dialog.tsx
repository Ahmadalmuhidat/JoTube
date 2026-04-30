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
      <DialogContent className="sm:max-w-[600px] rounded-lg p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
        <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle className="text-xl font-bold">Edit video details</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">Update your video's metadata and visibility settings.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="p-8 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10 rounded-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 font-medium text-base focus-visible:ring-1 focus-visible:ring-blue-500 transition-colors" />
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
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[120px] rounded-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 resize-none transition-colors" 
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
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visibility</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
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
                            "flex items-center gap-3 p-3 rounded-md border transition-colors text-left",
                            field.value === opt.value 
                              ? "bg-slate-50 dark:bg-slate-900 border-blue-500" 
                              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                          )}
                        >
                          <opt.icon className={cn("size-4", field.value === opt.value ? "text-blue-500" : "text-slate-500")} />
                          <span className={cn(
                            "text-sm font-medium",
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

            <DialogFooter className="pt-4 flex gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                className="rounded-md font-semibold text-slate-500"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="rounded-md px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex gap-2"
              >
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                Save Change
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
