import ActivitiesSummaryDemo from "@/components/shared/activities-summary-demo.tsx";
import ScheduleDashboard from "src/components/schedule dashboard";
import { connectToDB } from "@/db";
import { useEffect, useState } from "react";
import { Event, listen } from "@tauri-apps/api/event";
import TopBar2 from "@/components/shared/top-bar2.tsx";

function Home() {
  const [activities, setActivities] = useState<Array<any>>([]);
  const setActivityFn = async () => {
    const db = await connectToDB();
    const res: Array<any> = await db.select("SELECT * FROM activity");
    setActivities(res);
    // console.log(res);
  };

  const listenProgramChange = async () => {
    const db = await connectToDB();
    const unlisten = listen("program_changed", async (event: Event<any>) => {
      try {
        await db.execute("INSERT INTO activity (name, time) VALUES ($1, $2)", [
          event.payload.process_name,
          event.payload.time,
        ]);
      } catch (error) {
        console.error("Failed to insert user:", error);
      }
    });

    return unlisten;
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      await setActivityFn();
      cleanup = await listenProgramChange();
    };

    init();

    return () => {
      if (cleanup) cleanup();
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
