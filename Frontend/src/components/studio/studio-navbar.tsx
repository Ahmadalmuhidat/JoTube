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
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 z-50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-sm" />
          <Link href="/studio" className="flex items-center gap-2 ml-4">
            <div className="p-1.5 bg-red-600 rounded-sm">
              <VideoIcon className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
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
            className="rounded-sm border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
            onClick={onOpen}
          >
            <UploadIcon className="size-4" />
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
