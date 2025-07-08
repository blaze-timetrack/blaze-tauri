import { cn } from "@/lib/utils";
import { Event } from "./index";

interface EventBlockProps {
  event: Event;
  timeScale: number;
}

const EventBlock = ({ event, timeScale }: EventBlockProps) => {
  // Calculate position and height based on start and end times
  const getTimePosition = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
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
  const height = (duration / 60) * timeScale;

  return (
    <div
      style={{
        top: `${startPosition}px`,
        height: `${height}px`,
        width: "calc(100% - 16px)",
        left: "8px",
      }}
      className={cn(
        "text-background/80 absolute rounded-md p-3 transition-all hover:brightness-110",
        event.color,
      )}
    >
      <h3 className="text-sm font-medium">{event.title}</h3>
      <div className="mt-1 text-xs opacity-80">
        {event.startTime} - {event.endTime}
      </div>
    </div>
  );
};

export default EventBlock;
