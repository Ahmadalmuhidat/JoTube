"use client";

import { UserCircleIcon } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  return (
    <>
      <SignedIn>
        <div className="flex items-center">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "size-8",
              }
            }}
          />
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="rounded-full px-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2"
          >
            <UserCircleIcon className="size-5" />
            <span className="font-semibold">Sign in</span>
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
