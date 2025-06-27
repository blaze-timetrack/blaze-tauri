import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import spacetime from "spacetime";

export default function TopBar2() {
  const timezone = useSettingStore((state) => state.timezone);
  const d = spacetime(null, timezone?.value || timezone);

  return (
    <div className={"row-span-1 flex w-full items-center justify-between"}>
      <div className="">
        <p
          className={"text-lg"}
        >{`${d.format("day")}, ${d.format("{date-ordinal} {month}")}`}</p>
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
