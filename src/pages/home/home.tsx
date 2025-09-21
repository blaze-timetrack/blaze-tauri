import ActivitiesSummaryDemo from "@/components/shared/activities-summary-demo.tsx";
import { connectToDB } from "@/db";
import { useEffect } from "react";
import { Event, listen } from "@tauri-apps/api/event";
import TopBar2 from "@/components/shared/top-bar2.tsx";
import {
  HeartbeatStopTypes,
  HeartbeatTypes,
} from "@/lib/types/heartbeat.types.ts";
import ScheduleDashboard from "@/pages/home/components/schedule dashboard";
import { useHydrateStore } from "@/lib/zustand/hydrate-store.ts";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";

function Home() {
  const currentDay = useHydrateStore((state) => state.currentDay);
  const groupedPrograms = useSettingStore((state) => state.groupedPrograms);
  const categoriesStates = useSettingStore((state) => state.categoryStates);

  const awayFromKeyboard = async () => {
    return listen("afk", async (event: Event<HeartbeatStopTypes>) => {
      console.log("listening afk");
      try {
        const db = await connectToDB();
        await db.execute(
          "INSERT INTO breaks (duration, start_time, end_time, date_id) VALUES ($1, $2, $3, $4)",
          [
            event.payload.time.duration,
            event.payload.time.start,
            event.payload.time.end,
            currentDay,
          ],
        );

        // group afk => breaks => get afks of today : logic (delay < 5min then bind and create break) : delete afk
        // await db.execute("");

        console.log(
          `afk event start:${event.payload.time.start} end:${event.payload.time.end} duration:${event.payload.time.duration}`,
        );
      } catch (e) {
        console.log(`afk error ${e}`);
      }
    });
  };

  const heartbeat = async () => {
    const db = await connectToDB();
    return listen("heartbeat", async (event: Event<HeartbeatTypes>) => {
      console.log("listening blood");
      const inGroupProgram = groupedPrograms.findIndex((v) => {
        return (
          v.name.toLowerCase() ===
          event.payload.process_name.toLowerCase().split(".")[0]
        );
      });
      let categoryOfGroupProgram;
      if (inGroupProgram == -1) {
        categoryOfGroupProgram = "uncategorized";
        // show option to change the category
      } else {
        categoryOfGroupProgram = groupedPrograms[inGroupProgram].category;
        if (categoryOfGroupProgram == undefined) {
          categoryOfGroupProgram = "unknown";
        }
      }
      try {
        // check program category
        const program_name = event.payload.process_name.split(".")[0];

        await db.execute(
          "INSERT INTO programs (name, title, url, duration, start_time, end_time, category, date_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [
            program_name,
            event.payload.title,
            event.payload.url,
            event.payload.time.duration,
            event.payload.time.start,
            event.payload.time.end,
            categoryOfGroupProgram,
            currentDay,
          ],
        );

        let found = categoriesStates.findIndex(
          (v) => v.name.toLowerCase() === categoryOfGroupProgram.toLowerCase(),
        );

        if (found == -1) {
        } else {
          let categoryStateOfFlow = categoriesStates[found].state_flow.state;
          if (categoryStateOfFlow) {
            await db.execute(
              "INSERT INTO flows (duration, start_time, end_time, category, date_id) VALUES ($1, $2, $3, $4, $5)",
              [
                event.payload.time.duration,
                event.payload.time.start,
                event.payload.time.end,
                categoryOfGroupProgram,
                currentDay,
              ],
            );
            console.log(
              "adding to flow session as the category belongs to flow sessions.",
            );
          }
        }

        console.log(
          `heartbeat event start: ${event.payload.time.start} end:${event.payload.time.end} duration:${event.payload.time.duration}`,
        );
      } catch (e) {
        console.log(`heartbeat error ${e}`);
      }
    });
  };

  const FIVE_MINUTES_MS = 5 * 60 * 1000;

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cleanup2: (() => void) | undefined;

    const init = async () => {
      cleanup = await awayFromKeyboard();
      cleanup2 = await heartbeat();
      // afk and blood will generate raw data
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
          <ScheduleDashboard /> {/* show activities */}
          <ActivitiesSummaryDemo /> {/*summary of activities*/}
        </div>
      </div>
    </div>
  );
}

export default Home;
