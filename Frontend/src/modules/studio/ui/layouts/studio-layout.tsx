"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import StudioNavbar from "@/components/studio/studio-navbar";
import StudioSidebar from "@/components/studio/studio-sidebar";
import VideoUploadModal from "@/components/studio/video-upload-modal";

export function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="w-full relative min-h-screen bg-white dark:bg-slate-950">
        <StudioNavbar />
        <div className="flex min-h-screen pt-14 relative z-10 w-full">
          <StudioSidebar />
          <SidebarInset className="bg-white dark:bg-slate-950 w-full">
            {children}
          </SidebarInset>
        </div>
        <VideoUploadModal />
      </div>
    </SidebarProvider>
  );
}
