"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { UploadIcon, VideoIcon } from "lucide-react";
import AuthButton from "@/components/home/auth-button";
import { useUploadModal } from "@/modules/studio/hooks/use-upload-modal";

export default function StudioNavbar() {
  const { onOpen } = useUploadModal();

  return (
    <nav className="fixed top-4 left-4 right-4 h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center px-4 z-50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 overflow-hidden">
      <div className="flex items-center gap-4 w-full justify-between relative z-10">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-xl" />
          <Link href="/studio" className="flex items-center gap-2 ml-4 group">
            <div className="relative p-1.5 bg-red-600 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
              <VideoIcon className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 leading-none">
                JoTube
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-500 mt-0.5">
                Studio
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 group cursor-pointer"
            onClick={onOpen}
          >
            <UploadIcon className="size-4 transition-transform group-hover:-translate-y-0.5" />
            <span className="font-semibold">Create</span>
          </Button>
          <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
