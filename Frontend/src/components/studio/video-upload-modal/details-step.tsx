"use client";

import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlobeIcon, LockIcon, EyeIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import { VideoFormValues } from "./types";
import { ThumbnailField } from "./thumbnail-field";
import { CategoryField } from "./category-field";
import { cn } from "@/lib/utils";

interface DetailsStepProps {
  onBack: () => void;
  onSubmit: (values: VideoFormValues) => void;
  isSaving?: boolean;
  uploadProgress?: number;
}

export function DetailsStep({ onBack, onSubmit, isSaving, uploadProgress }: DetailsStepProps) {
  const { control, handleSubmit } = useFormContext<VideoFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Title and Description */}
        <div className="md:col-span-2 space-y-6">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200">Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Add a catchy title" 
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 h-12 font-medium focus-visible:ring-red-600 transition-all" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tell viewers what your video is about
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What's happening in this video?" 
                    className="min-h-[220px] rounded-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 resize-none font-medium focus-visible:ring-red-600" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Right Column: Thumbnail, Category, Visibility */}
        <div className="space-y-8">
          <ThumbnailField />
          <CategoryField />

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 space-y-6">
            <FormField
              control={control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest pl-1">Visibility</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: 'PUBLIC', label: 'Public', icon: GlobeIcon, desc: 'Anyone can watch' },
                        { value: 'PRIVATE', label: 'Private', icon: LockIcon, desc: 'Only you can see' },
                        { value: 'UNLISTED', label: 'Unlisted', icon: EyeIcon, desc: 'Anyone with link' },
                        { value: 'DRAFT', label: 'Draft', icon: Loader2, desc: 'Work in progress' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left group",
                            field.value === opt.value 
                              ? "bg-white dark:bg-slate-800 border-red-500 shadow-md ring-4 ring-red-500/5" 
                              : "bg-white/50 dark:bg-slate-900/30 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          )}
                        >
                          <div className={cn(
                            "p-2.5 rounded-xl transition-colors",
                            field.value === opt.value ? "bg-red-50 dark:bg-red-900/20 text-red-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                          )}>
                            <opt.icon className="size-5" />
                          </div>
                          <div>
                            <div className={cn(
                              "text-sm font-bold",
                              field.value === opt.value ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                            )}>{opt.label}</div>
                            <div className="text-[10px] font-bold uppercase tracking-tight text-slate-400">{opt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            className="rounded-xl font-bold h-11 px-6 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onBack}
            disabled={isSaving}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="rounded-xl font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20 h-11 px-8 group transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {uploadProgress && uploadProgress > 0 ? `Uploading (${uploadProgress}%)...` : 'Saving...'}
              </>
            ) : (
              <>
                Save & Continue
                <ChevronRightIcon className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
