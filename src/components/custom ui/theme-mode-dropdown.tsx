import { ChevronDown, SwatchBook } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettingStore } from "@/lib/zustand/store.ts";
import { ThemeModeTypes } from "@/lib/types/store-settings.types.ts";
import { useCallback } from "react";
import { emit } from "@tauri-apps/api/event";

function ThemeModeDropdown() {
  const themeMode = useSettingStore((state) => state.themeMode);
  const setThemeMode = useSettingStore((state) => state.setThemeMode);

  const reloadFn = useCallback(() => {
    emit("reload", { windowLabel: "widget" });
    console.log("sending reload...");
  }, [themeMode, setThemeMode]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"icon_label_btn_2"}>
          <SwatchBook />
          Theme
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuRadioGroup
          value={themeMode}
          onValueChange={(v) => {
            setThemeMode(v as ThemeModeTypes);
            reloadFn();
          }}
        >
          <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="mono">Mono</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="catppuccin">
            Catppuccin
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeModeDropdown;
