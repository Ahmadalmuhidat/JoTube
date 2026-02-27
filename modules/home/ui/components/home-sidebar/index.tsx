"use client";

import { HomeIcon, PlaySquareIcon, FlameIcon, ListVideoIcon, HistoryIcon, UserIcon, ClockIcon, ThumbsUpIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Shorts",
    url: "/shorts",
    icon: FlameIcon,
  },
  {
    title: "Subscriptions",
    url: "/subscriptions",
    icon: PlaySquareIcon,
  },
];

const personalItems = [
  {
    title: "History",
    url: "/history",
    icon: HistoryIcon,
  },
  {
    title: "Playlists",
    url: "/playlists",
    icon: ListVideoIcon,
  },
  {
    title: "Your videos",
    url: "/your-videos",
    icon: UserIcon,
  },
  {
    title: "Watch later",
    url: "/watch-later",
    icon: ClockIcon,
  },
  {
    title: "Liked videos",
    url: "/liked-videos",
    icon: ThumbsUpIcon,
  },
];

export const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={false} // TODO: Add active state logic
                    onClick={() => { }} // TODO: Add navigation logic
                  >
                    <a href={item.url} className="flex items-center gap-4">
                      <item.icon />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {personalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={false} // TODO: Add active state logic
                    onClick={() => { }} // TODO: Add navigation logic
                  >
                    <a href={item.url} className="flex items-center gap-4">
                      <item.icon />
                      <span className="text-sm font-medium">{item.title}</span>
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
};
