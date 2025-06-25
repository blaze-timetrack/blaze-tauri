import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ThemeToggle } from "@/components/custom ui/theme-toggle.tsx";
import ThemeModeDropdown from "@/components/custom ui/theme-mode-dropdown.tsx";

function ThemeTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Setting</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className={"flex items-center gap-4"}>
          <p className={""}>Theme:</p>
          <ThemeToggle />
        </div>

        <div className={"flex items-center gap-4"}>
          <p className={""}>Theme mode:</p>
          <ThemeModeDropdown />
        </div>
      </CardContent>
    </Card>
  );
}

export default ThemeTab;
