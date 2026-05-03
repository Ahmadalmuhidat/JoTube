"use client";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

interface SearchFiltersProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export function SearchFilters({ currentSort, onSortChange }: SearchFiltersProps) {
  const sortLabels: Record<string, string> = {
    latest: "Most Recent",
    views: "Most Viewed",
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full gap-2 font-bold px-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-slate-200 dark:border-slate-800">
            <ListFilter className="size-4" />
            Filters: <span className="text-red-600 dark:text-red-500">{sortLabels[currentSort] || "Most Recent"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
          <DropdownMenuItem 
            onClick={() => onSortChange("latest")}
            className="font-bold cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800"
          >
            Upload date (latest)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onSortChange("views")}
            className="font-bold cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800"
          >
            View count (most views)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
