"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, VideoIcon, BellIcon, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthButton from "@/components/home/auth-button";

export default function HomeNavbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 z-50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 w-full justify-between">
        {/* Left Section: Menu and Logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-sm" />
          <Link href="/" className="flex items-center gap-2 ml-4">
            <div className="p-1.5 bg-red-600 rounded-sm">
              <VideoIcon className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              JoTube
            </span>
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 flex justify-center max-w-[720px]">
          <form onSubmit={handleSearch} className="flex items-center w-full">
            <div className="flex items-center flex-1 border border-slate-200 dark:border-slate-800 rounded-l-sm px-4 py-1 ml-10 transition-all duration-300 focus-within:ring-1 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 bg-slate-50 dark:bg-slate-900">
              <SearchIcon className="size-4 text-slate-400 mr-2" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none focus-visible:ring-0 h-9 p-0 bg-transparent text-sm placeholder:text-slate-500"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="rounded-r-sm border-l-0 border border-slate-200 dark:border-slate-800 px-6 h-[38px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <SearchIcon className="size-4 text-slate-600 dark:text-slate-400" />
            </Button>
          </form>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" className="rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800">
            <VideoIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 relative">
            <BellIcon className="size-5" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-slate-950"></span>
          </Button>
          <div className="pl-2 border-l border-slate-200 dark:border-slate-800 ml-1">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
