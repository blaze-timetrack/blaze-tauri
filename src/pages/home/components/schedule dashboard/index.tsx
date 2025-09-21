import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import TimeColumn from "./TimeColumn.tsx";
import ColumnHeader from "./ColumnHeader.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import BaseColumn from "@/pages/home/components/schedule dashboard/BaseColumn.tsx";
import { cn } from "@/lib/utils.ts";
import { useHydrateStore } from "@/lib/zustand/hydrate-store.ts";
import { connectToDB } from "@/db";
import { Circle, CircleDot } from "lucide-react";
import spacetime from "spacetime";

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
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  blockColor: string;
  activities: Array<any>;
}

export interface Event {}

const ScheduleDashboard = () => {
  const [zoomActive, setZoomActive] = useState(false);

  const scheduleDashboardColVisible = useSettingStore(
    (state) => state.scheduleDashboardColVisible,
  );
  const state = useSettingStore((state) => state.state);
  const currentActiveDay = useHydrateStore((state) => state.currentActiveDay);
  const setCurrentActiveDay = useHydrateStore(
    (state) => state.setCurrentActiveDay,
  );
  const currentTime = useHydrateStore((state) => state.currentTime);
  const tauriTimezone = useSettingStore((state) => state.timezone);
  const zoomLevel = useSettingStore((state) => state.zoomLevel);
  const setZoomLevel = useSettingStore((state) => state.setZoomLevel);

  const d = spacetime(currentActiveDay, tauriTimezone.value);

  const [activities, setActivities] = useState<Event[] | []>([]);

  const [flowSessions, setFlowSessions] = useState<Event[] | []>([]);

  const [projects, setProjects] = useState<Event[] | []>([]);

  const [clients, setClients] = useState<Event[] | []>([]);

  const [tasks, setTasks] = useState<Event[] | []>([]);

  const setActivitiesSession = async (state) => {
    try {
      const db = await connectToDB();
      // group blood
      // logic (5min, category) : create activity attach details ([...ids])
      let dateD = d.format("{date-pad}-{month-pad}-{year}-{timezone}");
      let timezoneChange = dateD.split("/");

      // todo can be removed with understanding spacetime
      if (timezoneChange[1] === "Kolkata") {
        dateD = timezoneChange[0] + "/Calcutta";
      }

      let eventBlocks: Array<any> =
        state === "programs" &&
        (await db.select(
          "SELECT *, prev_end_time, strftime('%s', start_time) - strftime('%s', prev_end_time) AS diff_seconds FROM ( SELECT *, LAG(end_time) OVER (ORDER BY start_time) AS prev_end_time FROM programs WHERE date_id = $1)",
          [dateD],
        ));
      if (state === "afks") {
        eventBlocks = await db.select(
          "SELECT *, prev_end_time, strftime('%s', start_time) - strftime('%s', prev_end_time) AS diff_seconds FROM ( SELECT *, LAG(end_time) OVER (ORDER BY start_time) AS prev_end_time FROM breaks WHERE date_id = $1)",
          [dateD],
        );
      }
      if (state === "flows") {
        eventBlocks = await db.select(
          "SELECT *, prev_end_time, strftime('%s', start_time) - strftime('%s', prev_end_time) AS diff_seconds FROM ( SELECT *, LAG(end_time) OVER (ORDER BY start_time) AS prev_end_time FROM flows WHERE date_id = $1)",
          [dateD],
        );
      }

      if (!eventBlocks) return;
      let title = null;
      if (state === "programs") {
        title = "Deep Activities";
      } else if (state === "afks") {
        title = "Break";
      } else if (state === "flows") {
        title = "Flow Sessions";
      }

      let latestObject: Array<any> = []; // blocks
      let latestAct: Array<any> = []; // programs
      let start_time: string | null = null;
      let end_time: string | null = null;
      eventBlocks.map((v, i) => {
        if (v.diff_seconds === null) {
          start_time = v.start_time;
          end_time = v.end_time;
          latestAct.push(v);
          return;
        } else if (v.diff_seconds >= 5 * 60) {
          latestObject.push({
            id: i,
            title,
            startTime: start_time,
            endTime: end_time,
            blockColor:
              state === "programs"
                ? "bg-purple-400"
                : state === "afks"
                  ? "bg-blue-300"
                  : state === "flows"
                    ? "bg-blue-600"
                    : "bg-purple-400",
            activities: latestAct,
          });
          start_time = v.start_time;
          latestAct = [];
        } else if (i === eventBlocks.length - 1) {
          latestObject.push({
            id: i,
            title,
            startTime: start_time,
            endTime: v.end_time,
            blockColor:
              state === "programs"
                ? "bg-purple-400"
                : state === "afks"
                  ? "bg-blue-300"
                  : state === "flows"
                    ? "bg-blue-600"
                    : "bg-purple-400",
            activities: latestAct,
          });
          return;
        }
        latestAct.push(v);
        end_time = v.end_time;
      });

      if (state === "programs") {
        setActivities(latestObject);
      } else if (state === "afks") {
        setFlowSessions(latestObject);S
      } else if (state === "flows") {
        setFlowSessions((prev) => [...prev, ...latestObject]);
      }

      console.log("eventBlocks: ", latestObject);
    } catch (error) {
      console.error(error);
    }
  };

  const groupRaw = async () => {
    ["programs", "afks", "flows"].forEach((v) => setActivitiesSession(v));
  };

  // handle zoom
  function clampZoom(current, delta) {
    const ZOOM_STEPS = [20, 30, 60, 90, 100];
    // Find the current index
    const idx = ZOOM_STEPS.indexOf(current);
    if (idx === -1) return 60;

    let nextIdx =
      delta < 0
        ? ZOOM_STEPS.indexOf(current) + 1
        : ZOOM_STEPS.indexOf(current) - 1;
    if (nextIdx === -1) return 60;

    return ZOOM_STEPS[nextIdx];
  }

  const handleWheel = useCallback(
    async (event) => {
      if (zoomActive) {
        setTimeout(async () => {
          try {
            const newZoom = clampZoom(zoomLevel, event.deltaY);
            await setZoomLevel(newZoom);
          } catch (e) {
            console.log(e);
          }
        }, 600);
      }
    },
    [zoomActive, zoomLevel],
  );

  // hold scroll position
  const scrollAreaRef = useRef(null);
  const handleScroll = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (viewport) {
      localStorage.setItem("scrollPosition", viewport.scrollTop);
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      await groupRaw();
    });

    const interval = setInterval(
      async () => {
        await groupRaw();
      },
      5 * 60 * 1000,
    );

    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    const savedPosition = localStorage.getItem("scrollPosition");
    if (viewport && savedPosition) {
      viewport.scrollTop = parseInt(savedPosition, 10);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentActiveDay, setCurrentActiveDay]);

  return (
    <div className="border-border bg-background text-foreground h-full w-full overflow-hidden rounded-lg border shadow-2xl">
      <div className="grid grid-cols-[auto_1fr]">
        <div
          onClick={() => setZoomActive((prev) => !prev)}
          onWheel={handleWheel}
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
      <ScrollArea
        onScrollCapture={handleScroll}
        ref={scrollAreaRef}
        className="ssc overflow-hidden"
        scrollHideDelay={0}
      >
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
              <span key={v.id} className={`${!v.checkValue && "hidden"}`}>
                <BaseColumn
                  events={
                    v.id === 0
                      ? flowSessions
                      : v.id === 1
                        ? projects
                        : v.id === 2
                          ? clients
                          : v.id === 3
                            ? tasks
                            : []
                  }
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
