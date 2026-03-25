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
          <FormLabel className="text-sm font-extrabold text-slate-700 dark:text-slate-200">Categories</FormLabel>
          <div className="flex flex-wrap gap-2 pt-1 relative min-h-[40px]">
            {isLoading ? (
              <div className="flex gap-2 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">No categories found</p>
            ) : (
              categories.map((cat) => {
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
              })
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
