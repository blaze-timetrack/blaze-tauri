import React, { useEffect } from "react";
import { useBasicStore } from "@/lib/zustand/basic-store.ts";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";

const opts = {
  height: "400", // Hide video
  width: "800",
  playerVars: {
    loop: 1,
    playlist: "8of5w7RgcTc",
    autoplay: 1,
    controls: 0,
    disablekb: 1,
    rel: 0,
  },
};

export default function Timer() {
  const state = useSettingStore((state) => state.state);
  const setState = useSettingStore((state) => state.setState);

  const stateTrackingTimer = useBasicStore((state) => state.stateTrackingTimer);
  const setStateTrackingTimer = useBasicStore(
    (state) => state.setStateTrackingTimer,
  );

  useEffect(() => {
    if (stateTrackingTimer >= 0 || state !== "TRACKING") return;

    const timer = setInterval(() => {
      setStateTrackingTimer(stateTrackingTimer + 5);
    }, 1000);

    return () => clearInterval(timer);
  }, [stateTrackingTimer]);

  const minutes = Math.floor(stateTrackingTimer / 60);
  const seconds = stateTrackingTimer % 60;

  return (
    <div>
      Timer
      <p
        className={"flex w-full justify-center"}
      >{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</p>
      {/*<YouTube videoId={"8of5w7RgcTc"} opts={opts} />*/}
    </div>
  );
}
