import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "../components/home-navbar";
import { HomeSidebar } from "../components/home-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
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
