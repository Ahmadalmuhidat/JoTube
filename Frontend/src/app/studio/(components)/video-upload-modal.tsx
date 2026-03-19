"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  UploadIcon, 
  VideoIcon, 
  ImageIcon, 
  CheckCircle2, 
  Sparkles,
  GlobeIcon,
  LockIcon,
  ChevronRightIcon
} from "lucide-react";
import { toast } from "sonner";
import { useUploadModal } from "@/hooks/use-upload-modal";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const videoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(5000).optional(),
  videoUrl: z.string().url("Wait for video to upload"),
  thumbnailUrl: z.string().url("Please upload a thumbnail").optional(),
  categoryIds: z.array(z.string()).min(1, "Please select at least one category"),
  isPublished: z.boolean(),
});

type VideoFormValues = z.infer<typeof videoSchema>;

const DEFAULT_CATEGORIES = [
  { id: "1", name: "Music" },
  { id: "2", name: "Gaming" },
  { id: "3", name: "Education" },
  { id: "4", name: "Entertainment" },
  { id: "5", name: "Technology" },
  { id: "6", name: "Vlogs" },
  { id: "7", name: "News" },
  { id: "8", name: "Sports" },
  { id: "9", name: "Travel" },
  { id: "10", name: "Food" },
  { id: "11", name: "Fashion" },
  { id: "12", name: "Science" },
  { id: "13", name: "History" },
  { id: "14", name: "Art" },
  { id: "15", name: "Education" },
  { id: "16", name: "Health" },
  { id: "17", name: "Finance" },
  { id: "18", name: "Politics" },
  { id: "19", name: "Movies" },
  { id: "20", name: "Podcasts" },
];

export default function VideoUploadModal() {
  const { isOpen, onClose } = useUploadModal();
  const [step, setStep] = useState<"upload" | "details" | "success">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      categoryIds: [],
      isPublished: true,
    },
  });

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        // Seek to 1 second (or 10% of duration) to get a good frame
        video.currentTime = Math.min(1, video.duration / 2);
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        URL.revokeObjectURL(video.src);
        resolve(dataUrl);
      };

      video.onerror = (error) => {
        URL.revokeObjectURL(video.src);
        reject(error);
      };
    });
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload
    setIsUploading(true);
    setStep("upload");

    try {
      // Auto-generate thumbnail from the video file
      const autoThumbnail = await generateThumbnail(file);
      form.setValue("thumbnailUrl", autoThumbnail);
    } catch (error) {
      console.error("Thumbnail generation failed:", error);
    }
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          form.setValue("videoUrl", "https://example.com/video.mp4"); // Mock URL
          form.setValue("title", file.name.replace(/\.[^/.]+$/, ""));
          setStep("details");
        }, 500);
      }
      setUploadProgress(progress);
    }, 400);
  };

  const onThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate thumbnail upload
    toast.info("Uploading thumbnail...");
    setTimeout(() => {
      form.setValue("thumbnailUrl", "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"); // Mock image
      toast.success("Thumbnail uploaded");
    }, 1000);
  };

  const { getToken } = useAuth();

  const onSubmit = async (values: VideoFormValues) => {
    try {
      const token = await getToken();
      
      const response = await axios.post("http://localhost:3000/api/videos", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Video created:", response.data);
      setStep("success");
      toast.success("Video uploaded and saved successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to save video details");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] shadow-2xl">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-500/20">
                <VideoIcon className="size-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-extrabold tracking-tight">Upload Video</DialogTitle>
                <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {step === "upload" ? "Select a video file to share with your audience" : 
                   step === "details" ? "Add some details to help people find your video" : 
                   "Your video is ready to be published!"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8">
            {step === "upload" && (
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
            )}

            {step === "details" && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Title and Description */}
                    <div className="md:col-span-2 space-y-6">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                          {form.watch("thumbnailUrl") ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={form.watch("thumbnailUrl")} 
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

                      <FormField
                        control={form.control}
                        name="categoryIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200">Categories</FormLabel>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {DEFAULT_CATEGORIES.map((cat) => {
                                const isSelected = field.value?.includes(cat.id);
                                return (
                                  <Badge
                                    key={cat.id}
                                    variant={isSelected ? "secondary" : "outline"}
                                    className={cn(
                                      "cursor-pointer py-1.5 px-3 rounded-xl font-bold transition-all duration-300 select-none",
                                      isSelected 
                                        ? "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-md shadow-red-600/20" 
                                        : "hover:border-red-600/50 hover:bg-red-50/10 text-slate-500 dark:text-slate-400"
                                    )}
                                    onClick={() => {
                                      const newValue = isSelected
                                        ? field.value.filter((id: string) => id !== cat.id)
                                        : [...(field.value || []), cat.id];
                                      field.onChange(newValue);
                                    }}
                                  >
                                    {cat.name}
                                  </Badge>
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 space-y-4">
                        <FormField
                          control={form.control}
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
                        onClick={() => setStep("upload")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="rounded-xl font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20 h-11 px-8 group transition-all"
                      >
                        Save & Continue
                        <ChevronRightIcon className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle2 className="size-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-black mb-2">Upload Complete!</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mb-8">
                  Your video is being processed and will be available to watch shortly.
                </p>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="rounded-xl font-bold border-slate-200 dark:border-slate-800"
                    onClick={() => {
                      onClose();
                      setStep("upload");
                      form.reset();
                    }}
                  >
                    Close
                  </Button>
                  <Button 
                    className="rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Go to Content
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
