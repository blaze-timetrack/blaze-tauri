import { ScrollArea } from "@/components/ui/scroll-area";
import TimeColumn from "./TimeColumn";
import ColumnHeader from "./ColumnHeader";
import { useEffect, useState } from "react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import BaseColumn from "@/components/schedule dashboard/BaseColumn.tsx";
import { cn } from "@/lib/utils.ts";

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

const ScheduleDashboard = () => {
  const scheduleDashboardColVisible = useSettingStore(
    (state) => state.scheduleDashboardColVisible,
  );

  const [activities, setActivities] = useState<Event[]>([
    {
      id: "1",
      title: "Deep Work Session",
      startTime: "01:00",
      endTime: "05:45",
      color: "bg-purple-400",
    },
  ]);

  const [flowSessions, setFlowSessions] = useState<Event[]>([
    {
      id: "2",
      title: "Focused Coding",
      startTime: "10:00",
      endTime: "11:30",
      color: "bg-amber-400",
    },
    {
      id: "3",
      title: "Review Session",
      startTime: "12:00",
      endTime: "13:00",
      color: "bg-lavender-400",
    },
    {
      id: "4",
      title: "Planning",
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-amber-500",
    },
  ]);

  const [calendarEvents, setCalendarEvents] = useState<Event[]>([
    {
      id: "5",
      title: "Team Meeting",
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-teal-400",
    },
    {
      id: "6",
      title: "Lunch Break",
      startTime: "13:00",
      endTime: "14:00",
      color: "bg-sky-400",
    },
  ]);

  const [projects, setProjects] = useState<Event[]>([
    {
      id: "7",
      title: "Dashboard Redesign",
      startTime: "09:00",
      endTime: "11:00",
      color: "bg-rose-400",
    },
    {
      id: "8",
      title: "API Integration",
      startTime: "15:00",
      endTime: "17:00",
      color: "bg-emerald-500",
    },
  ]);

  useEffect(() => {}, []);

  return (
    <div className="border-border bg-background text-foreground h-full w-full overflow-hidden rounded-lg border shadow-2xl">
      <div className="grid grid-cols-[auto_1fr]">
        <div className="border-border w-16.5 border-r"></div>
        <div
          className={cn("grid grid-cols-2")}
          style={{
            gridTemplateColumns: `repeat(${scheduleDashboardColVisible.filter((v) => v.checkValue).length + 2}, minmax(0, 1fr))`,
          }}
        >
          <span className={"col-span-2"}>
            <ColumnHeader title={"Activities"} />
          </span>
          {scheduleDashboardColVisible.map(({ label, checkValue }, i) => (
            <span key={i} className={`${!checkValue && "hidden"}`}>
              <ColumnHeader title={label} />
            </span>
          ))}
        </div>
      </div>
      <ScrollArea className="ssc overflow-hidden" scrollHideDelay={0}>
        <div className="grid grid-cols-[auto_1fr]">
          <TimeColumn />
          <div
            className={cn("grid grid-cols-2")}
            style={{
              gridTemplateColumns: `repeat(${scheduleDashboardColVisible.filter((v) => v.checkValue).length + 2}, minmax(0, 1fr))`,
            }}
          >
            <span className={`col-span-2`}>
              <BaseColumn
                events={activities}
                className={`bg-background`}
                id={"activity"}
              />
            </span>
            {scheduleDashboardColVisible.map((v, i) => (
              <span key={i} className={`${!v.checkValue && "hidden"}`}>
                <BaseColumn
                  events={flowSessions}
                  className={`bg-background`}
                  id={v.value}
                />
              </span>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ScheduleDashboard;
