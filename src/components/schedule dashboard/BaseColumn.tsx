import { Event } from "./index";
import EventBlock from "./EventBlock";
import React, { useRef, useState } from "react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { cn } from "@/lib/utils.ts";

interface BaseColumnProps {
  events: Event[];
  className?: string;
  id: string;
}

const BaseColumn = ({ events, className, id }: BaseColumnProps) => {
  const timeScale = 60;
  const [positionTimeline, setPositionTimeline] = useState({ y: 0 });
  const [isHovering, setIsHovering] = useState(false); // State to track hover
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false); // New state for selection
  const [selectionStart, setSelectionStart] = useState<number | null>(null); // Start Y position of selection
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const currentTime12 = useSettingStore((state) => state.currentTime12);
  const currentTimeStart = useSettingStore((state) => state.currentTimeStart);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      // Check if ref is available
      const containerRect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - containerRect.top; // Calculate relative Y position
      setPositionTimeline({ y });
      if (isSelecting && selectionStart !== null) {
        setSelectionEnd(y); // Update the end of selection while dragging
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false); // Stop selecting
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - containerRect.top;
      setIsSelecting(true); // Start selecting
      setSelectionStart(y); // Set the start of selection
      setSelectionEnd(y); // Initially, end is same as start
    }
  };
  const handleMouseEnter = () => {
    setIsHovering(true); // Set hovering to true when mouse enters
  };

  const handleMouseLeave = () => {
    setIsHovering(false); // Set hovering to false when mouse leaves
    // Clear selection if mouse leaves while selecting
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  // Function to calculate time based on vertical position
  const calculateTime = (y: number) => {
    const gridLineHeight = 60;
    const hours = Math.floor(y / gridLineHeight);
    const minutes = Math.floor((y / gridLineHeight - hours) * 60);

    if (currentTime12) {
      let hour12 = hours % currentTimeStart;
      hour12 = hours === 0 || hours === 12 ? 12 : hour12;
      const period12 = hours < 12 ? "AM" : "PM";

      return `${hour12}:${String(minutes).padStart(2, "0")} ${period12}`;
    }

    // Format the time (e.g., HH:mm)
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  // Calculate the selection area's position and height
  const getSelectionStyles = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd);
      const height = end - start;
      return {
        top: `${start}px`,
        height: `${height}px`,
      };
    }
    return {}; // Return empty object if no selection
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        `border-border relative col-span-1 border-r transition-colors`,
        className,
        !isSelecting && "hover:bg-foreground/5",
      )}
      onMouseDown={handleMouseDown} // Start selection on mouse down
      onMouseMove={handleMouseMove} // Track mouse movement
      onMouseUp={handleMouseUp} // Stop selection on mouse up
      onMouseEnter={handleMouseEnter} // Detect mouse entering
      onMouseLeave={handleMouseLeave} // Detect mouse leaving
    >
      {/* Conditionally render the line based on isHovering */}
      {isHovering && !isSelecting && (
        <>
          {/* Horizontal Line */}
          <div
            className={"bg-foreground/80 absolute z-50 h-[1px] w-full"}
            style={{
              top: `${positionTimeline.y}px`,
            }}
          />

          {/* Time Display */}
          <div
            className={
              "text-foreground bg-background absolute z-50 rounded-r-sm p-1 text-xs"
            }
            style={{
              top: `${positionTimeline.y - 12}px`, // Adjust for vertical alignment
              left: 0, // Position on the left side
            }}
          >
            {calculateTime(positionTimeline.y)}
          </div>
        </>
      )}

      {/* Selection Highlight */}
      {selectionStart !== null && selectionEnd !== null && (
        <div
          className={"bg-foreground/10 absolute z-40 w-full"} // Added z-40 to be below line and time
          style={getSelectionStyles()}
        />
      )}

      {/* Grid lines (optional, keep if needed) */}
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
