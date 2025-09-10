import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, LayoutGrid, Settings2 } from "lucide-react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import DropdownAnimateScheduleCol from "@/components/custom ui/dropdown-animate-scheduleCol.tsx";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { useState } from "react";
import { useHydrateStore } from "@/lib/zustand/hydrate-store.ts";
import { timeD } from "@/lib/utils.ts";

export default function TopBar2() {
  const [open, setOpen] = useState(false);

  const currentActiveDay = useHydrateStore((state) => state.currentActiveDay);
  const setCurrentActiveDay = useHydrateStore(
    (state) => state.setCurrentActiveDay,
  );

  const timezone = useSettingStore((state) => state.timezone);
  const [dateDe, setDateDe] = useState<string | undefined>(null);
  const d = timeD(dateDe, timezone.value);
  const [date, setDate] = useState<Date | undefined>(d.toNativeDate());

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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant={"icon_label_btn"} className={""}>
              <span className={"text-muted-foreground"}>Day:</span>
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);

                setDateDe(date.toLocaleString());

                setCurrentActiveDay(date.toLocaleString());
                console.log("changing current Active date", d.format("day"));
                console.log(
                  "changing current Active date",
                  date.toLocaleString(),
                );
              }}
            />
          </PopoverContent>
        </Popover>
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
