import { ChevronDown, SwatchBook } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ThemeToggle({ selectedTheme }: any) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });
}

function ThemeDropdown() {
  const [theme, setTheme] = useState("cupcake");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList = "";
    root.classList.add(theme);
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"icon_label_btn"}>
          <SwatchBook />
          Theme
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="cupcake">Cupcake</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="corporate">
            Corporate
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="business">
            Business
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeDropdown;
