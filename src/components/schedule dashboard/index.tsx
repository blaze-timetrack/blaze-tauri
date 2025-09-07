import { ScrollArea } from "@/components/ui/scroll-area";
import TimeColumn from "./TimeColumn";
import ColumnHeader from "./ColumnHeader";
import { useEffect, useState } from "react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import BaseColumn from "@/components/schedule dashboard/BaseColumn.tsx";
import { cn } from "@/lib/utils.ts";
import { useHydrateStore } from "@/lib/zustand/hydrate-store.ts";
import { connectToDB } from "@/db";
import { Circle, CircleDot } from "lucide-react";

interface BloodProp {
  id: number;
  name: string;
  title: string;
  url: string;
  start_time: string;
  end_time: string;
  duration: number;
  category: string;
  date_id: string;
}

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  activities: Array<any>;
}

const ScheduleDashboard = () => {
  const [zoomActive, setZoomActive] = useState(false);

  const scheduleDashboardColVisible = useSettingStore(
    (state) => state.scheduleDashboardColVisible,
  );
  const state = useSettingStore((state) => state.state);
  const currentDay = useHydrateStore((state) => state.currentDay);
  const currentTime = useHydrateStore((state) => state.currentTime);
  const tauriTimezone = useSettingStore((state) => state.timezone);
  const zoomLevel = useSettingStore((state) => state.zoomLevel);
  const setZoomLevel = useSettingStore((state) => state.setZoomLevel);

  const [activities, setActivities] = useState<Event[] | []>([]);

  const [flowSessions, setFlowSessions] = useState<Event[] | []>([
    {
      id: "2",
      title: "Focused Coding",
      startTime: "10:00",
      endTime: "11:30",
    },
    {
      id: "3",
      title: "Review Session",
      startTime: "12:00",
      endTime: "13:00",
    },
    {
      id: "4",
      title: "Planning",
      startTime: "14:00",
      endTime: "15:00",
    },
  ]);

  const [calendarEvents, setCalendarEvents] = useState<Event[]>([
    {
      id: "5",
      title: "Team Meeting",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: "6",
      title: "Lunch Break",
      startTime: "13:00",
      endTime: "14:00",
    },
  ]);

  const [projects, setProjects] = useState<Event[]>([
    {
      id: "7",
      title: "Dashboard Redesign",
      startTime: "09:00",
      endTime: "11:00",
    },
    {
      id: "8",
      title: "API Integration",
      startTime: "15:00",
      endTime: "17:00",
    },
  ]);

  const groupRaw = async () => {
    const db = await connectToDB();
    // group blood
    // logic (5min, category) : create activity attach details ([...ids])
    const res: Array<any> = await db.select(
      "SELECT *, prev_end_time, strftime('%s', start_time) - strftime('%s', prev_end_time) AS diff_seconds FROM ( SELECT *, LAG(end_time) OVER (ORDER BY start_time) AS prev_end_time FROM programs WHERE date_id = $1)",
      [currentDay],
    );

    console.log("res: ", res);
    if (!res) return;

    let latestObject: Array<any> = [];
    let latestAct: Array<any> = [];
    let start_time: string | null = null;
    let end_time: string | null = null;
    let title = null;
    res.map((v, i) => {
      if (v.diff_seconds === null) {
        start_time = v.start_time;
        end_time = v.end_time;
        latestAct.push(v);
        return;
      } else if (v.diff_seconds >= 5 * 60) {
        latestObject.push({
          id: i,
          title: "Deep Activity",
          startTime: start_time,
          endTime: end_time,
          activities: latestAct,
        });
        start_time = v.start_time;
        latestAct = [];
      } else if (i === res.length - 1) {
        latestObject.push({
          id: i,
          title: "Deep Activity",
          startTime: start_time,
          endTime: v.end_time,
          activities: latestAct,
        });
        return;
      }
      latestAct.push(v);
      end_time = v.end_time;
    });

    setActivities(latestObject);
  };

  const ZOOM_STEPS = [0, 30, 60, 90, 120];

  function clampZoom(current, delta) {
    // Find the current index
    const idx = ZOOM_STEPS.indexOf(current);
    if (idx === -1) return 60;
    let nextIdx = delta < 0 ? idx + 1 : idx - 1;
    // Clamp index to [0, last]
    nextIdx = Math.max(0, Math.min(ZOOM_STEPS.length - 1, nextIdx));
    return ZOOM_STEPS[nextIdx];
  }

  useEffect(() => {
    setTimeout(async () => {
      await groupRaw();
    });
    const listener = async (event: WheelEvent) => {
      event.preventDefault();
      console.log("inside wheel");
      if (zoomActive) {
        console.log("zoom active");
        const newZoom = clampZoom(zoomLevel, event.deltaY);
        await setZoomLevel(newZoom);
      } else {
      }
    };

    const interval = setInterval(
      async () => {
        await groupRaw();
      },
      5 * 60 * 1000,
    );

    document.addEventListener("wheel", listener);

    return () => {
      clearInterval(interval);
      document.removeEventListener("wheel", listener);
    };
  }, []);

  return (
    <div className="border-border bg-background text-foreground h-full w-full overflow-hidden rounded-lg border shadow-2xl">
      <div className="grid grid-cols-[auto_1fr]">
        <div
          onClick={() => {
            setZoomActive((prev) => !prev);
          }}
          className="border-border flex w-16.5 cursor-pointer items-center justify-center border-r"
        >
          {zoomActive ? (
            <CircleDot className={"h-5 w-5"} />
          ) : (
            <Circle className={"h-5 w-5"} />
          )}
        </div>
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
