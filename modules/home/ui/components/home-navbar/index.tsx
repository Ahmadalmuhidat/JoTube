"use client";

import Image from "next/image";
import Link from "next/link";
import { MenuIcon, SearchIcon, VideoIcon, BellIcon, UserCircleIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b">
      <div className="flex items-center gap-4 w-full justify-between">
        {/* Left Section: Menu and Logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/" className="flex items-center gap-1 ml-4">
            <Image src="/logo.svg" alt="JobTube Logo" width={32} height={32} />
            <span className="text-xl font-bold tracking-tighter">JobTube</span>
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 flex justify-center max-w-[720px]">
          <div className="flex items-center w-full">
            <div className="flex items-center flex-1 border rounded-l-full px-4 py-1 ml-10 shadow-inner group-focus-within:border-blue-500">
              <SearchIcon className="size-4 text-gray-500 mr-2 hidden group-focus-within:block" />
              <Input
                placeholder="Search"
                className="border-none focus-visible:ring-0 h-8 p-0"
              />
            </div>
            <Button
              variant="secondary"
              className="rounded-r-full border-l-0 border px-5 h-[34px] bg-gray-50 hover:bg-gray-100"
            >
              <SearchIcon className="size-4 text-gray-800" />
            </Button>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" className="rounded-full">
            <VideoIcon className="size-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <BellIcon className="size-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircleIcon className="size-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}