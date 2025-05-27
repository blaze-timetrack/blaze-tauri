import { cn } from "@/lib/utils";
import { Event } from "./index";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EventBlockProps {
  event: Event;
  timeScale: number;
}

const EventBlock = ({ event, timeScale }: EventBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 1,
  };

  // Calculate position and height based on start and end times
  const getTimePosition = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const startPosition = getTimePosition(event.startTime);
  const endPosition = getTimePosition(event.endTime);
  
  // Convert 7:00 AM to 0 position (420 minutes from midnight)
  const startOffset = 420; 
  const relativeStart = startPosition - startOffset;
  const duration = endPosition - startPosition;
  
  // Each hour is timeScale pixels tall
  const top = (relativeStart / 60) * timeScale;
  const height = (duration / 60) * timeScale;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        top: `${top}px`,
        height: `${height}px`,
        width: "calc(100% - 16px)",
        left: "8px",
      }}
      className={cn(
        "absolute rounded-md p-3 transition-all hover:brightness-110 cursor-grab active:cursor-grabbing",
        event.color,
        isDragging && "shadow-2xl scale-105 opacity-90"
      )}
      {...attributes}
      {...listeners}
    >
      <h3 className="font-medium text-sm">{event.title}</h3>
      <div className="text-xs opacity-80 mt-1">
        {event.startTime} - {event.endTime}
      </div>
    </div>
  );
};

export default EventBlock