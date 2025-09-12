import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";

const DropdownMenuScheduleCol = ({
  triggerElement,
}: {
  triggerElement: React.ReactNode;
}) => {
  const scheduleDashboardColVisible = useSettingStore(
    (state) => state.scheduleDashboardColVisible,
  );
  const setScheduleDashboardColVisible = useSettingStore(
    (state) => state.setScheduleDashboardColVisible,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerElement}</DropdownMenuTrigger>
      <DropdownMenuContent className="data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-bottom-20 data-[state=open]:slide-in-from-bottom-20 data-[state=closed]:zoom-out-100 w-56 duration-400">
        <ul className="flex w-full flex-col divide-y">
          {scheduleDashboardColVisible.map(
            ({ id, label, value, checkValue }) => (
              <li key={label}>
                <Label
                  htmlFor={label}
                  className="flex items-center justify-between gap-2 px-5 py-3"
                >
                  <span className="flex items-center gap-2">
                    {/*<Icon className="size-4" />*/}
                    {label}
                  </span>
                  <Checkbox
                    id={label}
                    checked={checkValue}
                    onCheckedChange={(v) =>
                      setScheduleDashboardColVisible({
                        id,
                        label,
                        value,
                        checkValue: v === "indeterminate" ? false : v,
                      })
                    }
                  />
                </Label>
              </li>
            ),
          )}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuScheduleCol;
