"use client";

import { UserCircleIcon } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  return (
    <>
      <SignedIn>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-slate-900 dark:bg-white rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center justify-center p-0.5 bg-white dark:bg-slate-900 rounded-full">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "size-8",
                }
              }}
            />
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="rounded-xl px-4 py-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 transition-all duration-300 shadow-sm flex items-center gap-2 group"
          >
            <UserCircleIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold tracking-tight">Sign in</span>
            <div className="absolute inset-0 rounded-xl bg-slate-900/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
