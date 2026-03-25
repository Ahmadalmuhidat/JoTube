"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  VideoIcon,
  SettingsIcon,
  HelpCircleIcon,
  ArrowLeftIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const studioItems = [
  {
    title: "Dashboard",
    url: "/studio",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Content",
    url: "/studio/content",
    icon: VideoIcon,
  }
];

const bottomItems = [
  {
    title: "Settings",
    url: "/studio/settings",
    icon: SettingsIcon,
  },
  {
    title: "Send feedback",
    url: "/feedback",
    icon: HelpCircleIcon,
  },
];

export default function StudioSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-24 z-40 border-none bg-transparent" collapsible="icon">
      <SidebarContent className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 shadow-sm rounded-tr-3xl flex flex-col justify-between pb-4">
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-4">
                <SidebarMenuButton
                  asChild
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 rounded-xl mx-2 my-0.5"
                >
                  <a href="/" className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <ArrowLeftIcon className="size-5" />
                    <span className="text-sm font-semibold">Back to JoTube</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {studioItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={pathname === item.url}
                    className={cn(
                      "transition-all duration-300 rounded-xl mx-2 my-0.5 group",
                      pathname === item.url 
                        ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 shadow-sm" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    )}
                  >
                    <a href={item.url} className="flex items-center gap-4">
                      <item.icon className={cn(
                        "transition-transform duration-300 group-hover:scale-110",
                        pathname === item.url ? "text-red-600 dark:text-red-500" : ""
                      )} />
                      <span className="text-sm font-semibold">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 rounded-xl mx-2 my-0.5 group"
                  >
                    <a href={item.url} className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                      <item.icon className="transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm font-semibold">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
