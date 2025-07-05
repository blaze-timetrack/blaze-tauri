import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, LayoutGrid, Settings2 } from "lucide-react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import spacetime from "spacetime";
import DropdownAnimateScheduleCol from "@/components/custom ui/dropdown-animate-scheduleCol.tsx";

export default function TopBar2() {
  const timezone = useSettingStore((state) => state.timezone);

  const d = spacetime(null, timezone.value);

  return (
    <div className={"row-span-1 flex w-full items-center justify-between"}>
      <div className="flex items-center gap-2">
        <p
          className={"text-lg"}
        >{`${d.format("day")}, ${d.format("{date-ordinal} {month}")}`}</p>
        <DropdownAnimateScheduleCol
          triggerElement={
            <Button variant={"icon_btn"}>
              <Settings2 />
            </Button>
          }
        />
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
