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
    <Sidebar className="pt-14 z-40 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" collapsible="icon">
      <SidebarContent className="bg-white dark:bg-slate-950">
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                  asChild
                  className="rounded-none px-6 py-5 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <a href="/" className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <ArrowLeftIcon className="size-5" />
                    <span className="text-sm">Back to JoTube</span>
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
                      "rounded-none px-6 py-5 hover:bg-slate-100 dark:hover:bg-slate-800",
                      pathname === item.url 
                        ? "bg-slate-100 dark:bg-slate-800 font-bold" 
                        : "text-slate-700 dark:text-slate-200"
                    )}
                  >
                    <a href={item.url} className="flex items-center gap-4 w-full">
                      <item.icon className={cn(
                        "size-5",
                        pathname === item.url ? "text-red-600" : ""
                      )} />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-2 mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className="rounded-none px-6 py-5 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <a href={item.url} className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                      <item.icon className="size-5" />
                      <span className="text-sm">{item.title}</span>
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
