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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { GlobeIcon, LockIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import { VideoFormValues } from "./types";
import { ThumbnailField } from "./thumbnail-field";
import { CategoryField } from "./category-field";

interface DetailsStepProps {
  onBack: () => void;
  onSubmit: (values: VideoFormValues) => void;
  isSaving?: boolean;
}

export function DetailsStep({ onBack, onSubmit, isSaving }: DetailsStepProps) {
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

          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 space-y-4">
            <FormField
              control={control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      {field.value ? <GlobeIcon className="size-4 text-green-500" /> : <LockIcon className="size-4 text-slate-400" />}
                      {field.value ? "Public" : "Private"}
                    </FormLabel>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      {field.value ? "Everyone can watch" : "Only you can see this"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="h-px bg-slate-200/60 dark:bg-slate-800/60" />
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
                Saving...
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
