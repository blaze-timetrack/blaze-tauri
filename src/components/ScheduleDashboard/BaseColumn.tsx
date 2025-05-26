import { Event } from "./index";
import EventBlock from "./EventBlock";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface BaseColumnProps {
  events: Event[];
  className?: string;
  id: string;
}

const BaseColumn = ({ events, className, id }: BaseColumnProps) => {
  const timeScale = 56; // height of one hour in pixels (14px * 4)
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative col-span-1 border-r border-gray-800 transition-colors hover:bg-white/5 ${className}`}
    >
      {/* Grid lines for every hour */}
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={i}
          className={`h-14 border-t border-gray-800 ${i === 0 ? "border-t-0" : ""}`}
        />
      ))}

      {/* Event blocks */}
      <SortableContext
        items={events.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        {events.map((event) => (
          <EventBlock key={event.id} event={event} timeScale={timeScale} />
        ))}
      </SortableContext>
    </div>
  );
};

export default BaseColumn;
