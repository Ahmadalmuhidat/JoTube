"use client";

import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { FormLabel } from "@/components/ui/form";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { VideoFormValues } from "./types";

export function ThumbnailField() {
  const { watch, setValue } = useFormContext<VideoFormValues>();
  const thumbnailUrl = watch("thumbnailUrl");

  const onThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate thumbnail upload
    toast.info("Uploading thumbnail...");
    setTimeout(() => {
      setValue("thumbnailUrl", "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"); // Mock image
      toast.success("Thumbnail uploaded");
    }, 1000);
  };

  return (
    <div className="space-y-3">
      <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-2">
        Thumbnail
        <Badge variant="outline" className="text-[9px] font-black tracking-tight rounded-md py-0 h-4 border-slate-200 uppercase">Recommended</Badge>
      </FormLabel>
      
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="thumbnail-upload"
        onChange={onThumbnailUpload}
      />
      
      <label 
        htmlFor="thumbnail-upload"
        className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-red-600/50 hover:bg-red-50/10 transition-all overflow-hidden relative"
      >
        {thumbnailUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={thumbnailUrl} 
              alt="Thumbnail preview" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform duration-300">
            <ImageIcon className="size-8 text-slate-400 group-hover:text-red-600 transition-colors" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Upload Image</span>
          </div>
        )}
      </label>
    </div>
  );
}
