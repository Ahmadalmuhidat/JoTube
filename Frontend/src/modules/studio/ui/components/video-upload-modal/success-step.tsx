"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStepProps {
  onClose: () => void;
  onReset: () => void;
}

export function SuccessStep({ onClose, onReset }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="size-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle2 className="size-12 text-green-600" />
      </div>
      <h3 className="text-2xl font-black mb-2">Upload Complete!</h3>
      <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mb-8">
        Your video is being processed and will be available to watch shortly.
      </p>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="rounded-xl font-bold border-slate-200 dark:border-slate-800"
          onClick={() => {
            onClose();
            onReset();
          }}
        >
          Close
        </Button>
        <Button 
          className="rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          onClick={onClose}
        >
          Go to Content
        </Button>
      </div>
    </div>
  );
}
