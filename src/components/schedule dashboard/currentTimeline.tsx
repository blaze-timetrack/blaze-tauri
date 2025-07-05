import { useEffect, useState } from "react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import spacetime from "spacetime";
import { getPositionInDash } from "@/lib/utils.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { useHydrateStore } from "@/lib/zustand/hydrate-store.ts";

const CurrentTimeLine = () => {
  const selectedTimezone = useSettingStore((state) => state.timezone);

  const currentTime = useHydrateStore((state) => state.currentTime);
  const setCurrentTime = useHydrateStore((state) => state.setCurrentTime);

  const [topPosition, setTop] = useState<number>(0);

  useEffect(() => {
    if (!selectedTimezone?.value) return;

    const timer = setInterval(() => {
      const d = spacetime(null, selectedTimezone.value);
      const { top } = getPositionInDash(d.unixFmt("hh:mm:ss"));
      setTop(top);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={"pointer-events-none absolute z-50 w-full"}>
      <div
        className={"relative flex w-full items-center gap-2"}
        style={{
          top: `${topPosition}px`,
        }}
      >
        {/*<p*/}
        {/*  className={*/}
        {/*    "border-border text-foreground bg-background z-50 rounded-md border px-2 text-[8px]"*/}
        {/*  }*/}
        {/*>*/}
        {/*  {currentTime}*/}
        {/*</p>*/}

        <Separator className={"bg-foreground"} />
      </div>
    </div>
  );
};

export default CurrentTimeLine;
