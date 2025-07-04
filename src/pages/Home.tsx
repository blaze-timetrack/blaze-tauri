import ActivitiesSummaryDemo from "@/components/shared/activities-summary-demo.tsx";
import { connectToDB } from "@/db";
import { useEffect } from "react";
import { Event, listen } from "@tauri-apps/api/event";
import TopBar2 from "@/components/shared/top-bar2.tsx";
import {
  HeartbeatStopTypes,
  HeartbeatTypes,
} from "@/lib/types/heartbeat.types.ts";
import ScheduleDashboard from "@/components/schedule dashboard";
import { useHydrateStore } from "@/lib/zustand/hydrate-store.ts";

function Home() {
  const awayFromKeyboard = async () => {
    const unlisten = listen("afk", async (event: Event<HeartbeatStopTypes>) => {
      try {
        const currentActiveDay = useHydrateStore(
          (state) => state.currentActiveDay,
        );
        const db = await connectToDB();
        await db.execute(
          "INSERT INTO breaks (duration, start_time, end_time, day_id) VALUES ($1, $2, $3, $4)",
          [
            event.payload.time.duration,
            event.payload.time.start,
            event.payload.time.end,
            currentActiveDay,
          ],
        );
        console.log(
          `afk event start:${event.payload.time.start} end:${event.payload.time.end} duration:${event.payload.time.duration}`,
        );
      } catch (e) {
        console.log(`afk error ${e}`);
      }
    });

    return unlisten;
  };
  const heartbeat = async () => {
    const db = await connectToDB();
    const unlisten = listen(
      "heartbeat",
      async (event: Event<HeartbeatTypes>) => {
        try {
          // check program category
          const program_name = event.payload.process_name.split(".")[0];
          await db.execute(
            "INSERT INTO programs (name, title, url, duration, start_time, end_time, category) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [
              program_name,
              event.payload.title,
              event.payload.url,
              event.payload.time.duration,
              event.payload.time.start,
              event.payload.time.end,
              "uncategorized",
            ],
          );
          console.log(
            `heartbeat event start: ${event.payload.time.start} end:${event.payload.time.end} duration:${event.payload.time.duration}`,
          );
        } catch (e) {
          console.log(`heartbeat error ${e}`);
        }
      },
    );

    return unlisten;
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cleanup2: (() => void) | undefined;

    const init = async () => {
      cleanup = await awayFromKeyboard();
      cleanup2 = await heartbeat();
    };

    init();

    return () => {
      if (cleanup) cleanup();
      if (cleanup2) cleanup2();
    };
  }, []);

  return (
    <div className={"row-span-16 grid grid-rows-[auto_1fr] gap-4"}>
      <TopBar2 />
      <div className={"row-span-16 w-full"}>
        <div className="row-span-16 flex justify-start gap-6">
          <ScheduleDashboard />
          <ActivitiesSummaryDemo />
        </div>
      </div>
    </div>
  );
}

export default Home;
