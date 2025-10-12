import { cn } from "@/lib/utils.ts";
import { Event } from "./index.tsx";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { Card } from "@/components/ui/card.tsx";
import { CommandLoading } from "cmdk";

interface EventBlockProps {
  event: Event;
  timeScale: number;
}

const EventBlock = ({ event, timeScale }: EventBlockProps) => {
  const zoomLevel = useSettingStore((state) => state.zoomLevel);
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
      >
        <h3 className={cn(`mt-2 text-sm font-medium`, heightInMin && "hidden")}>
          {event.title}
        </h3>
        <div className={`mt-1 text-xs opacity-80 ${heightInMin && "hidden"}`}>
          {event.startTime.slice(0, -3)} - {event.endTime.slice(0, -3)}
        </div>
      </div>
      <div className={cn("hidden group-hover:block")}>
        <EventBlockDetails startPosition={startPosition} />
      </div>
    </div>
  );
};

export default EventBlock;

const EventBlockDetails = ({ startPosition }) => {
  return (
    <Card
      style={{
        top: `${startPosition}px`,
      }}
      className={cn(
        "text-background/80 absolute left-11/12 z-50 w-2xs rounded-md bg-black pl-2",
      )}
    >
      <CommandLoading />
    </Card>
  );
};
