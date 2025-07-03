import { Event } from "./index";
import EventBlock from "./EventBlock";

interface BaseColumnProps {
  events: Event[];
  className?: string;
  id: string;
}

const BaseColumn = ({ events, className, id }: BaseColumnProps) => {
  const timeScale = 60;

  return (
    <div
      className={`border-border hover:bg-foreground/5 relative col-span-1 border-r transition-colors ${className}`}
    >
      {/* Grid lines for every hour */}
      {Array.from({ length: 24 }, (_, i) => (
        <div
          key={i}
          className={`border-border h-15 border-t ${i === 0 ? "border-t-0" : ""}`}
        />
      ))}

      {events.map((event) => (
        <EventBlock key={event.id} event={event} timeScale={timeScale} />
      ))}
    </div>
  );
};

export default BaseColumn;
