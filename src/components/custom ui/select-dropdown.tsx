"use client";

import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";

export const SelectedDropdownCurrentTime = () => {
  const currentTime12 = useSettingStore((state) => state.currentTime12);
  const setCurrentTime12 = useSettingStore((state) => state.setCurrentTime12);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-secondary flex items-center gap-2 rounded-md px-3 py-2.5">
        <div className="flex flex-col gap-1 text-start leading-none">
          <span className="max-w-[17ch] truncate text-sm leading-none font-semibold">
            {currentTime12 ? "12 Hours" : "24 Hours"}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-66">
        <DropdownMenuLabel>Hours Style</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setCurrentTime12(true)}>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1 text-start leading-none">
              <span className="max-w-[17ch] truncate text-sm leading-none font-semibold">
                12 Hours
              </span>
            </div>
          </div>
          {currentTime12 && <Check className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrentTime12(false)}>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1 text-start leading-none">
              <span className="max-w-[17ch] truncate text-sm leading-none font-semibold">
                24 Hours
              </span>
            </div>
          </div>
          {!currentTime12 && <Check className="ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
