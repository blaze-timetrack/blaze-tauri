import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import TimezoneSelect from "react-timezone-select";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import spacetime from "spacetime";
import { timeFormat } from "@/app.tsx";
import { SelectedDropdownCurrentTime } from "@/components/custom ui/select-dropdown.tsx";

function ActivityTab() {
  const selectedTimezone = useSettingStore((state) => state.timezone);
  const setSelectedTimezone = useSettingStore((state) => state.setTimezone);

  const currentTime = useSettingStore((state) => state.currentTime);
  const setCurrentTime = useSettingStore((state) => state.setCurrentTime);

  useEffect(() => {
    if (!selectedTimezone?.value) return;

    const interval = setInterval(() => {
      const d = spacetime(null, selectedTimezone?.value || selectedTimezone);
      setCurrentTime(d.format(timeFormat));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTimezone]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>timezone, rules, behavior, etc...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={"flex items-center gap-4"}>
          <p className={""}>Time Zone:</p>
          <TimezoneSelect
            className={"w-sm max-w-sm"}
            value={selectedTimezone}
            onChange={setSelectedTimezone}
          />
        </div>
        <p className={"my-4"}>
          current time: <span className={"font-semibold"}>{currentTime}</span>
        </p>
        <div className={"border-border mt-4 rounded-lg border"}>
          <pre
            style={{
              margin: "0 20px",
              fontWeight: 500,
              fontFamily: "monospace",
            }}
          >
            {JSON.stringify(selectedTimezone, null, 2)}
          </pre>
        </div>

        <div className={"mt-8 flex items-center gap-4"}>
          <p className={""}>Hours: </p>
          <SelectedDropdownCurrentTime />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default ActivityTab;
