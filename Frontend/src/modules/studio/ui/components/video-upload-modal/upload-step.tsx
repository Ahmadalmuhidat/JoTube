"use client";

import { UploadIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadStepProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function UploadStep({ onUpload, isUploading, uploadProgress }: UploadStepProps) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 bg-slate-50/30 dark:bg-slate-900/30 transition-all duration-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 group relative overflow-hidden">
      {isUploading ? (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm relative z-10">
          <div className="relative">
            <div className="size-20 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-red-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
              {Math.round(uploadProgress)}%
            </div>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm font-bold animate-pulse">Uploading your video...</p>
        </div>
      ) : (
        <>
          <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-500">
            <UploadIcon className="size-12 text-red-600" />
          </div>
          <h3 className="text-xl font-black mb-2">Drag and drop video files to upload</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
            Your videos will be private until you publish them
          </p>
          <Input
            type="file"
            accept="video/*"
            className="hidden"
            id="video-upload"
            onChange={onUpload}
          />
          <Button 
            asChild 
            className="rounded-2xl px-8 h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20"
          >
            <label htmlFor="video-upload" className="cursor-pointer">
              Select Files
            </label>
          </Button>
          <div className="mt-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>MP4, WebM or MOV</span>
            <span className="size-1 bg-slate-400 rounded-full" />
            <span>Up to 2GB</span>
          </div>
        </>
      )}
      
      {/* Background Sparkles for Premium look */}
      <div className="absolute -top-10 -right-10 opacity-10">
        <Sparkles className="size-40 text-red-600" />
      </div>
    </div>
  );
}
