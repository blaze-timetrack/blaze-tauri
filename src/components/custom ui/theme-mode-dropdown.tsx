import { ChevronDown, SwatchBook } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { ThemeModeTypes } from "@/lib/types/store-settings.types.ts";
import { reloadWidget } from "@/lib/utils.ts";

function ThemeModeDropdown() {
  const themeMode = useSettingStore((state) => state.themeMode);
  const setThemeMode = useSettingStore((state) => state.setThemeMode);

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
            reloadWidget();
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
