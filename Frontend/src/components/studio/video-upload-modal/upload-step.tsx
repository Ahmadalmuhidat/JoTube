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
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-12 bg-slate-50 dark:bg-slate-900 group relative overflow-hidden transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
      {isUploading ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm relative z-10">
          <div className="relative">
            <div className="size-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-red-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
              {Math.round(uploadProgress)}%
            </div>
          </div>
          <p className="text-sm font-semibold">Uploading your video...</p>
        </div>
      ) : (
        <>
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 transition-colors group-hover:bg-slate-200">
            <UploadIcon className="size-10 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">Select files to upload</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
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
            className="rounded px-8 h-10 font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            <label htmlFor="video-upload" className="cursor-pointer">
              Select Files
            </label>
          </Button>
          <div className="mt-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>MP4, WebM or MOV</span>
            <span>Up to 2GB</span>
          </div>
        </>
      )}
    </div>
  );
}
