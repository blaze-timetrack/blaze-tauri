import { cn } from "@/lib/utils";
import { Event } from "./index";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";

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
      minutes = minutes / zoomLevel;
    } else if (zoomLevel < 60) {
      minutes = minutes * zoomLevel;
    }

    return hours * 60 + minutes;
  };

  const startPosition = getTimePosition(event.startTime);
  const endPosition = getTimePosition(event.endTime);

  // Convert 7:00 AM to 0 position (420 minutes from midnight)
  const startOffset = 420;
  // const relativeStart = startPosition - startOffset;
  const duration = endPosition - startPosition;

  // Each hour is timeScale pixels tall
  // const top = relativeStart * timeScale;
  const height = (duration / zoomLevel) * timeScale;

  return (
    <div
      style={{
        top: `${startPosition}px`,
        height: `${height}px`,
        width: "calc(100% - 16px)",
        left: "8px",
      }}
      className={cn(
        "text-background/80 absolute rounded-md bg-purple-400 pl-2 transition-all hover:brightness-110",
      )}
    >
      <h3 className="mt-2 text-sm font-medium">{event.title}</h3>
      <div className="mt-1 text-xs opacity-80">
        {event.startTime.slice(0, -3)} - {event.endTime.slice(0, -3)}
      </div>
    </div>
  );
};

export default EventBlock;
