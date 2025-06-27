import { Bolt, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import React from "react";
import { reloadWidget } from "@/lib/utils.ts";

export function ThemeToggle() {
  const setTheme = useSettingStore((state) => state.setTheme);
  const theme = useSettingStore((state) => state.theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="icon_label_btn_2" size="icon">
          {theme === "light" && (
            <Sun className="text-background h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          )}
          {theme === "dark" && (
            <Moon className="text-foreground absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          )}
          {theme === "system" && (
            <Bolt
              className={
                "text-foreground absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              }
            />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => {
            setTheme("light");
            reloadWidget();
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
            reloadWidget();
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("system");
            reloadWidget();
          }}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
