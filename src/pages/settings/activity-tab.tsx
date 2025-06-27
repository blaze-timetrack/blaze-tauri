import React, { useEffect, useState } from "react";
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

function ActivityTab() {
  const selectedTimezone = useSettingStore((state) => state.timezone);
  const setSelectedTimezone = useSettingStore((state) => state.setTimezone);
  const [] = useState<string | null>(null);
  const currentTime = useSettingStore((state) => state.currentTime);
  const setCurrentTime = useSettingStore((state) => state.setCurrentTime);

  useEffect(() => {
    if (!selectedTimezone?.value) return;

    const interval = setInterval(() => {
      // !!! spacetime
      const d = spacetime(null, selectedTimezone?.value || selectedTimezone);
      setCurrentTime(d.unixFmt("hh:mm:ss a"));
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
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default ActivityTab;
