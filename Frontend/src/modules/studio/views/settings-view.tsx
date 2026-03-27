"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { CameraIcon, Loader2Icon, SaveIcon } from "lucide-react";

import axios from "@/config/axios";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const channelSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  description: z.string().max(1000).optional(),
});

type ChannelFormValues = z.infer<typeof channelSchema>;

export default function SettingsView() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);

  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const token = await getToken();
        const response = await axios.get("/channels/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const channel = response.data;
        form.reset({
          name: channel.name,
          description: channel.description || "",
        });
        setPreviewImage(channel.imageUrl);
        setPreviewBanner(channel.bannerUrl);
      } catch (error) {
        console.error("Failed to fetch channel:", error);
        toast.error("Failed to load channel settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannel();
  }, [getToken, form]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBannerFile(file);
      setPreviewBanner(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ChannelFormValues) => {
    setIsSaving(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.description) formData.append("description", values.description);
      if (selectedFile) formData.append("image", selectedFile);
      if (selectedBannerFile) formData.append("banner", selectedBannerFile);

      await axios.patch("/channels/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Channel updated successfully");
    } catch (error: any) {
      console.error("Failed to update channel:", error);
      toast.error(error.response?.data?.error || "Failed to update channel");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2Icon className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-10 md:px-12 lg:px-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Channel customization</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic">Refine your identity on JoTube</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-2xl h-12 px-8 font-bold text-slate-600 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-all"
              onClick={() => router.push("/studio")}
            >
              Discard
            </Button>
            <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSaving}
                className="rounded-2xl h-12 px-10 bg-red-600 hover:bg-red-700 text-white font-bold shadow-2xl shadow-red-600/30 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
            >
                {isSaving ? (
                <Loader2Icon className="size-5 animate-spin" />
                ) : (
                <>
                    <SaveIcon className="size-5" />
                    Publish
                </>
                )}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="bg-white dark:bg-black/20 rounded-[4rem] border border-slate-200/50 dark:border-slate-800/50 p-12 md:p-20 shadow-2xl shadow-slate-200/10 dark:shadow-none backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full -mr-64 -mt-64" />
              
              <div className="flex flex-col gap-16 relative z-10">
                {/* Banner Upload Section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Channel Banner</h3>
                    <p className="text-base font-medium text-slate-500 dark:text-slate-400">
                        This image will appear across the top of your channel. We recommend a 2048 x 1152 pixels or larger.
                    </p>
                  </div>
                  
                  <div className="relative group/banner overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all hover:border-red-600/30">
                    <div className="aspect-[6/1] md:aspect-[8/1] w-full relative">
                        {previewBanner ? (
                            <img src={previewBanner} className="w-full h-full object-cover opacity-80 group-hover/banner:opacity-100 transition-opacity" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/20 dark:to-slate-900/20">
                                <span className="text-slate-300 dark:text-slate-700 font-black text-6xl tracking-[1em] uppercase opacity-20 select-none">JoTube Banner</span>
                            </div>
                        )}
                        
                        <label 
                          htmlFor="banner-upload"
                          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover/banner:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
                        >
                          <CameraIcon className="size-12 text-white mb-2" />
                          <span className="text-white text-sm font-black uppercase tracking-[0.4em]">Change Banner</span>
                        </label>
                        
                        <input 
                          id="banner-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onBannerChange}
                        />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">
                {/* Branding Left Column */}
                <div className="flex flex-col items-center lg:items-start gap-12 lg:w-[280px] flex-shrink-0">
                  <div className="relative group">
                    <div className="absolute -inset-6 bg-gradient-to-tr from-red-600/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Avatar className="size-40 md:size-44 ring-[16px] ring-slate-50 dark:ring-slate-900/50 shadow-2xl relative z-10 transition-all duration-700 border-4 border-white dark:border-slate-800">
                      <AvatarImage src={previewImage || ""} className="object-cover" />
                      <AvatarFallback className="text-5xl font-black bg-slate-100 dark:bg-slate-800">
                        {form.getValues("name")?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <label 
                      htmlFor="image-upload"
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-full cursor-pointer backdrop-blur-md border-[10px] border-white/10"
                    >
                      <CameraIcon className="size-10 text-white mb-2" />
                      <span className="text-white text-[12px] font-black uppercase tracking-[0.3em]">Replace</span>
                    </label>
                    
                    <input 
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageChange}
                    />
                  </div>
                  
                  <div className="space-y-4 text-center lg:text-left">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Avatar</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">This is your calling card across the JoTube universe.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800/80 p-2 px-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">2MB MAX</span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800/80 p-2 px-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">SQUARE</span>
                    </div>
                  </div>
                </div>

                {/* Info Right Column - Takes remaining width */}
                <div className="flex-1 space-y-12 max-w-[900px]">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="space-y-2">
                            <FormLabel className="text-2xl font-black text-slate-900 dark:text-white">Display Name</FormLabel>
                            <FormDescription className="text-base font-medium text-slate-500 dark:text-slate-400">
                                This is how you'll be known on JoTube. You can change this at any time.
                            </FormDescription>
                        </div>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="What's your persona?" 
                            className="rounded-[1.5rem] h-16 bg-slate-50 dark:bg-slate-950/30 border-2 border-slate-200/60 dark:border-slate-800/60 focus:ring-8 focus:ring-red-600/5 focus:border-red-600 font-extrabold text-xl px-8 transition-all shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="font-bold text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="space-y-2">
                            <FormLabel className="text-2xl font-black text-slate-900 dark:text-white">Bio</FormLabel>
                            <FormDescription className="text-base font-medium text-slate-500 dark:text-slate-400">
                                Tell your story. High-performing channels often have clear, engaging descriptions.
                            </FormDescription>
                        </div>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Share your vision with the world..." 
                            className="rounded-[2rem] min-h-[300px] bg-slate-50 dark:bg-slate-950/30 border-2 border-slate-200/60 dark:border-slate-800/60 focus:ring-8 focus:ring-red-600/5 focus:border-red-600 font-medium text-lg p-8 resize-none transition-all leading-loose shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="font-bold text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
