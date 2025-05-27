import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, LayoutGrid } from "lucide-react";

export default function TopBar2() {
  return (
    <div
      className={
        "row-span-1 flex w-full items-center justify-between px-8 pt-4 lg:px-12"
      }
    >
      <div className="">
        <p className={"text-lg"}>Friday, May 26 2025 </p>
      </div>

      {/* btn */}
      <div className="flex gap-2">
        <Button variant={"icon_label_btn"} className={""}>
          <span className={"text-muted-foreground"}>Day:</span>
          Today
          <ChevronDown />
        </Button>
        <Button variant={"icon_label_btn"} className={""}>
          <span className={"text-muted-foreground"}>Products:</span>
          All
          <ChevronDown />
        </Button>
        <Button variant={"icon_label_btn"} size={"icon"}>
          <LayoutGrid />
        </Button>
      </div>
    </div>
  );
}
