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

  const onSubmit = async (values: ChannelFormValues) => {
    setIsSaving(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.description) formData.append("description", values.description);
      if (selectedFile) formData.append("image", selectedFile);

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
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Channel customization</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your channel identity and description</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <Avatar className="size-40 md:size-48 ring-8 ring-slate-100 dark:ring-slate-800/50 shadow-2xl">
                      <AvatarImage src={previewImage || ""} className="object-cover" />
                      <AvatarFallback className="text-4xl font-black bg-slate-100 dark:bg-slate-800">
                        {form.getValues("name")?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <label 
                      htmlFor="image-upload"
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-full cursor-pointer backdrop-blur-sm border-4 border-white/20"
                    >
                      <CameraIcon className="size-8 text-white mb-2" />
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                    </label>
                    
                    <input 
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageChange}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Channel Picture</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-300">Channel Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Your channel name" 
                            className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-red-600/20 focus:border-red-600 font-semibold"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px] font-bold text-slate-400">
                          Choose a name that represents you and your content.
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
                        <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-300">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Tell viewers about your channel..." 
                            className="rounded-2xl min-h-[150px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-red-600/20 focus:border-red-600 font-medium resize-none"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px] font-bold text-slate-400">
                          Your description will appear in the About section of your channel.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                className="rounded-2xl h-12 px-8 font-bold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => router.push("/studio")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="rounded-2xl h-12 px-10 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2Icon className="size-5 animate-spin" />
                ) : (
                  <>
                    <SaveIcon className="size-5 mr-2" />
                    Publish Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
