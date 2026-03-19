import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "@/app/(components)/navbar";
import HomeSidebar from "@/app/(components)/sidebar";

export default function WatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="w-full relative min-h-screen bg-slate-50 dark:bg-slate-950">
        <HomeNavbar />
        <div className="flex min-h-screen pt-24 relative z-10 w-full">
          <HomeSidebar />
          <SidebarInset className="bg-transparent w-full">
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
