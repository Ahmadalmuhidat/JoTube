"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchIcon, VideoIcon, BellIcon, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavbar = () => {
  return (
    <nav className="fixed top-4 left-4 right-4 h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center px-4 z-50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 group/nav overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-center gap-4 w-full justify-between relative z-10">
        {/* Left Section: Menu and Logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-xl" />
          <Link href="/" className="flex items-center gap-2 ml-4 group">
            <div className="relative p-1.5 bg-slate-900 dark:bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
              <Sparkles className="size-5 text-white dark:text-slate-900" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              JoTube
            </span>
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 flex justify-center max-w-[720px]">
          <div className="flex items-center w-full group/search">
            <div className="flex items-center flex-1 border border-slate-200 dark:border-slate-800 rounded-l-2xl px-4 py-1 ml-10 shadow-sm transition-all duration-300 group-focus-within/search:ring-2 group-focus-within/search:ring-slate-900/10 dark:group-focus-within/search:ring-white/10 group-focus-within/search:border-slate-900 dark:group-focus-within/search:border-white bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <SearchIcon className="size-4 text-slate-400 mr-2 hidden group-focus-within/search:block transition-all" />
              <Input
                placeholder="Search anything..."
                className="border-none focus-visible:ring-0 h-10 p-0 bg-transparent text-base placeholder:text-slate-400"
              />
            </div>
            <Button
              variant="secondary"
              className="rounded-r-2xl border-l-0 border border-slate-200 dark:border-slate-800 px-6 h-[42px] bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <SearchIcon className="size-4 text-slate-700 dark:text-slate-300" />
            </Button>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
            <VideoIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300 relative">
            <BellIcon className="size-5" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
          </Button>
          <div className="pl-2 border-l border-slate-200 dark:border-slate-800 ml-1">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
