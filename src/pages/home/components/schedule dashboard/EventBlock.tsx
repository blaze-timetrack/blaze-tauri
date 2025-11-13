import { cn } from "@/lib/utils.ts";
import { Event } from "./index.tsx";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { useBasicStore } from "@/lib/zustand/basic-store.ts";
import React from "react";

interface EventBlockProps {
  event: Event;
  timeScale: number;
  setEventBlockClick: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventBlock = ({
  event,
  timeScale,
  setEventBlockClick,
}: EventBlockProps) => {
  const zoomLevel = useSettingStore((state) => state.zoomLevel);

  const eventBlockDetailsPosition = useBasicStore(
    (state) => state.eventBlockDetailsPosition,
  );
  const eventBlockDetails = useBasicStore((state) => state.eventBlockDetails);
  const setEventBlockDetailsPosition = useBasicStore(
    (state) => state.setEventBlockDetailsPosition,
  );
  const setEventBlockDetails = useBasicStore(
    (state) => state.setEventBlockDetails,
  );

  // Calculate position and height based on start and end times
  const getTimePosition = (timeString: string) => {
    let [hours, minutes, seconds] = timeString.split(":").map(Number);

    if (zoomLevel > 60) {
      minutes = minutes * 2;
    } else if (zoomLevel < 60) {
      minutes = minutes * zoomLevel;
    }

    return hours * 60 + minutes;
  };

  const startPosition = getTimePosition(event.startTime);
  const endPosition = getTimePosition(event.endTime);

  // Convert 7:00 AM to position 0 (420 minutes from midnight)
  const startOffset = 420;
  // const relativeStart = startPosition - startOffset;
  const duration = endPosition - startPosition;

  // Each hour is timeScale pixels tall
  // const top = relativeStart * timeScale;
  const height = (duration / 60) * timeScale;

  const heightInMin = height / 2 < 15;

  const handleLeftClick = (e) => {
    console.log("left click mouse");
    if (e.button === 0) {
      setEventBlockDetailsPosition({
        y: startPosition + 172, // (adding all upper components' height)
        x: endPosition + 75,
      });
    }
    // Execute your function here
  };

  const handleMouseLeave = () => {
    setEventBlockDetailsPosition({
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="group">
      <div
        style={{
          top: `${startPosition}px`,
          height: `${height}px`,
          width: "calc(100% - 16px)",
          left: "8px",
        }}
        className={cn(
          "text-background/80 absolute rounded-md pl-2 transition-all hover:brightness-110",
          event.blockColor,
        )}
        onClick={(e) => {
          console.log("click in event block");
          if (e.button === 0) {
            setEventBlockClick(true);
          }
        }}
        onMouseLeave={handleMouseLeave}
      >
        <h3 className={cn(`mt-2 text-sm font-medium`, heightInMin && "hidden")}>
          {event.title}
        </h3>
        <div className={`mt-1 text-xs opacity-80 ${heightInMin && "hidden"}`}>
          {event.startTime.slice(0, -3)} - {event.endTime.slice(0, -3)}
        </div>
      </div>
    </div>
  );
};

export default EventBlock;
