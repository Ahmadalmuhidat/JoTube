"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStepProps {
  onClose: () => void;
  onReset: () => void;
}

export function SuccessStep({ onClose, onReset }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="size-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="size-10 text-green-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">Upload Complete!</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8">
        Your video is being processed and will be available to watch shortly.
      </p>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="rounded font-semibold border-slate-200 dark:border-slate-800"
          onClick={() => {
            onClose();
            onReset();
          }}
        >
          Close
        </Button>
        <Button 
          className="rounded font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          onClick={onClose}
        >
          Go to Content
        </Button>
      </div>
    </div>
  );
}
