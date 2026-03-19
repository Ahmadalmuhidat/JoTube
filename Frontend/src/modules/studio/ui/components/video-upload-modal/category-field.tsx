"use client";

import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DEFAULT_CATEGORIES, VideoFormValues } from "./types";

export function CategoryField() {
  const { control } = useFormContext<VideoFormValues>();

  return (
    <FormField
      control={control}
      name="categoryIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200">Categories</FormLabel>
          <div className="flex flex-wrap gap-2 pt-1">
            {DEFAULT_CATEGORIES.map((cat) => {
              const isSelected = field.value?.includes(cat.id);
              return (
                <Badge
                  key={cat.id}
                  variant={isSelected ? "secondary" : "outline"}
                  className={cn(
                    "cursor-pointer py-1.5 px-3 rounded-xl font-bold transition-all duration-300 select-none",
                    isSelected 
                      ? "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-md shadow-red-600/20" 
                      : "hover:border-red-600/50 hover:bg-red-50/10 text-slate-500 dark:text-slate-400"
                  )}
                  onClick={() => {
                    const newValue = isSelected
                      ? field.value.filter((id: string) => id !== cat.id)
                      : [...(field.value || []), cat.id];
                    field.onChange(newValue);
                  }}
                >
                  {cat.name}
                </Badge>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
