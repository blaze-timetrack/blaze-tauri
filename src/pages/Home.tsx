import ActivitiesSummaryDemo from "@/components/shared/activities-summary-demo.tsx";
import { connectToDB } from "@/db";
import { useEffect, useState } from "react";
import { Event, listen } from "@tauri-apps/api/event";
import TopBar2 from "@/components/shared/top-bar2.tsx";
import {
  HeartbeatStopTypes,
  HeartbeatTypes,
} from "@/lib/types/heartbeat.types.ts";
import ScheduleDashboard from "@/components/schedule dashboard";

function Home() {
  const [activities, setActivities] = useState<Array<any>>([]);
  const awayFromKeyboard = async () => {
    const unlisten = listen("afk", async (event: Event<HeartbeatStopTypes>) => {
      try {
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
          console.log(
            `heartbeat event start: ${event.payload.time.start} end:${event.payload.time.end}`,
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
          {/*<Timeline />*/}
          <ActivitiesSummaryDemo />
        </div>
      </div>
    </div>
  );
}

export default Home;
