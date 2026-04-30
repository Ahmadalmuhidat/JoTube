import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "@/components/home/navbar";
import HomeSidebar from "@/components/home/sidebar";

export default function WatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="w-full relative min-h-screen bg-white dark:bg-slate-950">
        <HomeNavbar />
        <div className="flex min-h-screen pt-14 relative z-10 w-full">
          <HomeSidebar />
          <SidebarInset className="bg-white dark:bg-slate-950 w-full">
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
