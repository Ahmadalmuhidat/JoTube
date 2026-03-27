"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { useUploadModal } from "@/modules/studio/hooks/use-upload-modal";
import { useAuth } from "@clerk/nextjs";
import axios from "@/config/axios";
import { videoSchema, VideoFormValues } from "./types";
import { UploadStep } from "./upload-step";
import { DetailsStep } from "./details-step";
import { SuccessStep } from "./success-step";

export default function VideoUploadModal() {
  const { isOpen, onClose } = useUploadModal();
  const [step, setStep] = useState<"upload" | "details" | "success">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | Blob | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<{ videoUrl: string, thumbnailUrl: string } | null>(null);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      categoryIds: [],
      visibility: "PUBLIC",
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

  const { getToken } = useAuth();

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    setStep("upload");

    try {
      // 1. Local Preview & Preparation
      const autoThumbnail = await generateThumbnail(file);
      form.setValue("thumbnailUrl", autoThumbnail);
      form.setValue("title", file.name.replace(/\.[^/.]+$/, ""));
      
      const res = await fetch(autoThumbnail);
      const thumbnailBlob = await res.blob();
      setThumbnailFile(thumbnailBlob);

      // 2. Authentication
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to upload.");
        setIsUploading(false);
        setStep("upload");
        return;
      }

      // 3. Multipart Form Data
      const formData = new FormData();
      formData.append("video", file);
      formData.append("thumbnail", thumbnailBlob, "thumbnail.jpg");

      // 4. Real Upload with Progress Tracking (Upload Only, No DB Record)
      const response = await axios.post('/videos/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (response.status === 200) {
        setUploadedUrls(response.data);
        setIsUploading(false);
        setStep("details");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed. Please try again.");
      setIsUploading(false);
      setStep("upload");
    }
  };

  const onSubmit = async (values: VideoFormValues) => {
    setIsSaving(true);
    try {
      const token = await getToken();
      
      if (!token || !uploadedUrls?.videoUrl) {
        toast.error("Video upload not completed. Please try again.");
        return;
      }
      
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.description) formData.append("description", values.description);
      formData.append("visibility", values.visibility);
      values.categoryIds.forEach(id => formData.append("categoryIds", id));
      
      // Use the videoUrl we got from the upload step
      formData.append("videoUrl", uploadedUrls.videoUrl);
      
      // If a new thumbnail file was manually selected, upload it
      // Otherwise, use the auto-generated thumbnailUrl from the upload step
      if (values.thumbnailFile) {
        formData.append("thumbnail", values.thumbnailFile);
      } else {
        formData.append("thumbnailUrl", uploadedUrls.thumbnailUrl);
      }

      const response = await axios.post('/videos', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      if (response.status === 201) {
        setStep("success");
        toast.success("Video created successfully!");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to create video");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setUploadedUrls(null);
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
    form.reset();
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
            <FormProvider {...form}>
              <Form {...form}>
                {step === "upload" && (
                  <UploadStep 
                    onUpload={onUpload} 
                    isUploading={isUploading} 
                    uploadProgress={uploadProgress} 
                  />
                )}

                {step === "details" && (
                  <DetailsStep 
                    onBack={() => setStep("upload")} 
                    onSubmit={onSubmit} 
                    isSaving={isSaving}
                  />
                )}

                {step === "success" && (
                  <SuccessStep 
                    onClose={onClose} 
                    onReset={handleReset} 
                  />
                )}
              </Form>
            </FormProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
