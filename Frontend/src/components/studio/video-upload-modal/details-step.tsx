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
                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Add a catchy title" 
                    className="rounded-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-10 text-sm focus-visible:ring-1 focus-visible:ring-blue-500" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What's happening in this video?" 
                    className="min-h-[160px] rounded-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 resize-none text-sm focus-visible:ring-1 focus-visible:ring-blue-500" 
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <FormField
              control={control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visibility</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-2">
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
                            "flex items-center gap-3 p-3 rounded-md border transition-colors text-left",
                            field.value === opt.value 
                              ? "bg-white dark:bg-slate-800 border-blue-500" 
                              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                          )}
                        >
                          <opt.icon className={cn("size-4", field.value === opt.value ? "text-blue-500" : "text-slate-500")} />
                          <div>
                            <div className={cn(
                              "text-sm font-medium",
                              field.value === opt.value ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                            )}>{opt.label}</div>
                            <div className="text-[10px] text-slate-400">{opt.desc}</div>
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

      <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            className="rounded font-semibold h-10 px-6"
            onClick={onBack}
            disabled={isSaving}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="rounded font-semibold bg-blue-600 hover:bg-blue-700 text-white h-10 px-8 transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {uploadProgress && uploadProgress > 0 ? `Uploading (${uploadProgress}%)...` : 'Saving...'}
              </>
            ) : (
              <>
                Save & Continue
                <ChevronRightIcon className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
