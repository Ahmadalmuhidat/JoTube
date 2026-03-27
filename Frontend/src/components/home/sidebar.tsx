"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  FlameIcon,
  ListVideoIcon,
  HistoryIcon,
  UserIcon,
  ClockIcon,
  ThumbsUpIcon,
  ChevronDownIcon,
  PlaySquareIcon as SubscriptionsIcon
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    url: "/liked",
    icon: ThumbsUpIcon
  },
];

export default function HomeSidebar() {
  const pathname = usePathname();
  const clerk = useClerk();
  const { isSignedIn, getToken } = useAuth();

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscriptions", isSignedIn],
    queryFn: async () => {
      if (!isSignedIn) return [];
      const token = await getToken();
      const response = await axios.get("/channels/subscriptions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data || [];
    },
    enabled: true,
  });

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
                    isActive={pathname === item.url}
                    className={cn(
                      "transition-all duration-300 rounded-xl mx-2 my-0.5 group",
                      pathname === item.url 
                        ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 shadow-sm" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-4">
                      <item.icon className={cn(
                        "transition-transform duration-300 group-hover:scale-110",
                        pathname === item.url ? "text-red-600 dark:text-red-500" : ""
                      )} />
                      <span className="text-sm font-semibold">{item.title}</span>
                    </Link>
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
                    isActive={pathname === item.url}
                    className={cn(
                      "transition-all duration-300 rounded-xl mx-2 my-0.5 group",
                      pathname === item.url 
                        ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 shadow-sm" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    )}
                    onClick={(e) => {
                      if (!isSignedIn) {
                        e.preventDefault();
                        clerk.openSignIn();
                      }
                    }}
                  >
                    <Link href={item.url} className="flex items-center gap-4">
                      <item.icon className={cn(
                        "transition-transform duration-300 group-hover:scale-110",
                        pathname === item.url ? "text-red-600 dark:text-red-500" : ""
                      )} />
                      <span className="text-sm font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isSignedIn && subscriptions.length > 0 && (
          <>
            <div className="px-4 py-2">
              <SidebarSeparator className="bg-slate-200/50 dark:bg-slate-800/50" />
            </div>
            <SidebarGroup>
              <div className="px-6 py-2">
                <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Subscriptions</h3>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {subscriptions.slice(0, 15).map((channel: any) => (
                    <SidebarMenuItem key={channel.id}>
                      <SidebarMenuButton
                        tooltip={channel.name}
                        asChild
                        className="transition-all duration-300 rounded-xl mx-2 my-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 group"
                      >
                        <Link href={`/channels/${channel.id}`} className="flex items-center gap-4">
                          <Avatar className="size-6 border border-slate-200 dark:border-slate-800 transition-transform group-hover:scale-110">
                            <AvatarImage src={channel.imageUrl || channel.user?.image} />
                            <AvatarFallback className="text-[8px] font-black">{channel.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold truncate">{channel.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  {subscriptions.length > 15 && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="transition-all duration-300 rounded-xl mx-2 my-0.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Link href="/subscriptions" className="flex items-center gap-4 px-1">
                          <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <ChevronDownIcon className="size-4 text-slate-500" />
                          </div>
                          <span className="text-sm font-semibold">View all</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
