"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import axios from "@/config/axios";
import { VideoFormValues } from "./types";

interface Category {
  id: string;
  name: string;
}

export function CategoryField() {
  const { control } = useFormContext<VideoFormValues>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <FormField
      control={control}
      name="categoryIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</FormLabel>
          <div className="flex flex-wrap gap-2 pt-1 relative min-h-[40px]">
            {isLoading ? (
              <div className="flex gap-2 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-xs text-slate-400">No categories found</p>
            ) : (
              categories.map((cat) => {
                const isSelected = field.value?.includes(cat.id);
                return (
                  <Badge
                    key={cat.id}
                    variant={isSelected ? "secondary" : "outline"}
                    className={cn(
                      "cursor-pointer py-1 px-3 rounded font-medium transition-colors select-none text-xs",
                      isSelected 
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow-none" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
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
              })
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
