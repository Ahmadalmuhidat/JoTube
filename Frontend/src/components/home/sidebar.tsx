"use client";

import {
  HomeIcon,
  PlaySquareIcon,
  FlameIcon,
  ListVideoIcon,
  HistoryIcon,
  UserIcon,
  ClockIcon,
  ThumbsUpIcon
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
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
  }
];

const personalItems = [
  {
    title: "Subscriptions",
    url: "/subscriptions",
    icon: PlaySquareIcon,
  },
  {
    title: "History",
    url: "/history",
    icon: HistoryIcon
  },
  {
    title: "Playlists",
    url: "/playlists",
    icon: ListVideoIcon
  },
  {
    title: "Studio",
    url: "/studio",
    icon: UserIcon
  },
  {
    title: "Watch later",
    url: "/watch-later",
    icon: ClockIcon
  },
  {
    title: "Liked videos",
    url: "/liked-videos",
    icon: ThumbsUpIcon
  },
];

export default function HomeSidebar() {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <Sidebar className="pt-24 z-40 border-none bg-transparent" collapsible="icon">
      <SidebarContent className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 shadow-sm rounded-tr-3xl">
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={false} // TODO: Add active state logic
                    onClick={() => { }} // TODO: Add navigation logic
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 rounded-xl mx-2 my-0.5 group"
                  >
                    <a href={item.url} className="flex items-center gap-4 text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                      <item.icon className="transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm font-semibold">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="px-4 py-2">
          <SidebarSeparator className="bg-slate-200/50 dark:bg-slate-800/50" />
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {personalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={false} // TODO: Add active state logic
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 rounded-xl mx-2 my-0.5 group"
                    onClick={(e) => {
                      e.preventDefault();

                      if (!isSignedIn) {
                        clerk.openSignIn();
                      } else {
                        clerk.navigate(item.url);
                      }
                    }} // TODO: Add navigation logic
                  >
                    <a href={item.url} className="flex items-center gap-4 text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
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
};
