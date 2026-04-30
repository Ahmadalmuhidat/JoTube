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
    <Sidebar className="pt-14 z-40 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" collapsible="icon">
      <SidebarContent className="bg-white dark:bg-slate-950">
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
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
                    <Link href={item.url} className="flex items-center gap-4 w-full">
                      <item.icon className={cn(
                        "size-5",
                        pathname === item.url ? "text-red-600" : ""
                      )} />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="mx-0 bg-slate-200 dark:bg-slate-800" />
        
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {personalItems.map((item) => (
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
                    onClick={(e) => {
                      if (!isSignedIn) {
                        e.preventDefault();
                        clerk.openSignIn();
                      }
                    }}
                  >
                    <Link href={item.url} className="flex items-center gap-4 w-full">
                      <item.icon className={cn(
                        "size-5",
                        pathname === item.url ? "text-red-600" : ""
                      )} />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isSignedIn && subscriptions.length > 0 && (
          <>
            <SidebarSeparator className="mx-0 bg-slate-200 dark:bg-slate-800" />
            <SidebarGroup className="py-2">
              <div className="px-6 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase">Subscriptions</h3>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {subscriptions.slice(0, 15).map((channel: any) => (
                    <SidebarMenuItem key={channel.id}>
                      <SidebarMenuButton
                        tooltip={channel.name}
                        asChild
                        className="rounded-none px-6 py-5 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Link href={`/channels/${channel.id}`} className="flex items-center gap-4 w-full">
                          <Avatar className="size-6">
                            <AvatarImage src={channel.imageUrl || channel.user?.image} />
                            <AvatarFallback>{channel.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate">{channel.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  {subscriptions.length > 15 && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="rounded-none px-6 py-5 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Link href="/subscriptions" className="flex items-center gap-4">
                          <ChevronDownIcon className="size-4 text-slate-500" />
                          <span className="text-sm">Show more</span>
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
