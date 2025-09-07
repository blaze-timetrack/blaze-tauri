import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { useEffect, useState } from "react";
import { FlowStateSession } from "@/components/extented ui/flow-state-session.tsx";
import { reloadWidget } from "@/lib/utils.ts";
import { useBasicStore } from "@/lib/zustand/basic-store.ts";
import MusicPlayer from "@/components/shared/music-player.tsx";

function StateOfFlow() {
  const state = useSettingStore((state) => state.state);
  const setState = useSettingStore((state) => state.setState);

  const secondsLeft = useBasicStore((state) => state.stateFlowTimer);
  const setSecondsLeft = useBasicStore((state) => state.setStateFlowTimer);

  const [flowEndBell, setFlowEndBell] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0 || state !== "FLOW") return;

    setFlowEndBell(false);

    const timer = setInterval(() => {
      setSecondsLeft(secondsLeft - 1);
      if (secondsLeft <= 5 * 60) {
        setFlowEndBell(true);
        console.log("ringing bell");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, state]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="bg-primary/10 z-50 col-span-full row-span-2 flex justify-between border-t px-4">
      {/* state */}
      <div className="flex h-full items-center gap-4 text-lg">
        <div className="flex items-center">
          <Button
            variant={"icon_btn"}
            size={"icon"}
            className={`${state === "TRACKING" && "text-green-300"}`}
            onClick={() => {
              setState(state === "TRACKING" ? "NO_TRACKING" : "TRACKING");
              reloadWidget();
            }}
          >
            <Power />
          </Button>
          {/* <Activity className="text-green-400" /> */}
        </div>
        <div className="capitalize">
          {state === "TRACKING" || state === "NO_TRACKING"
            ? state.toString().toLowerCase()
            : ""}
          {state === "FLOW" && (
            <p className={"flex items-center gap-4"}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              <FlowStateSession />
            </p>
          )}
        </div>
      </div>

      {/* music */}
      <div className="flex h-full items-center gap-2">
        <MusicPlayer />
      </div>
      {flowEndBell && (
        <audio src={"/music/BHUVI - HALDIGHATI RAP 3.mp3"} autoPlay></audio>
      )}
    </div>
  );
}

export default StateOfFlow;
