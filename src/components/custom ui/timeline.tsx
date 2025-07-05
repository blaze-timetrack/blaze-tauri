import React, { useCallback, useEffect, useRef, useState } from "react";
import spacetime from "spacetime";

const HOUR_HEIGHT = 60; // px per hour
const VISIBLE_HOURS = 8;
const TIMELINE_WIDTH = 400; // px (adjust as needed)

// @ts-ignore
function getTimeAtPosition(x, startTime, hourWidth) {
  // Returns spacetime object for the given position
  const minutesFromStart = (x / hourWidth) * 60;
  return startTime.add(minutesFromStart, "minute");
}

export default function Timeline() {
  const timelineRef = useRef(null);

  // Start of visible window (rounded to hour)
  const [startTime, setStartTime] = useState(() =>
    spacetime.now().startOf("hour"),
  );

  // For horizontal scroll
  const [scrollLeft, setScrollLeft] = useState(0);

  // For hover
  const [hoverX, setHoverX] = useState<number | null>(null);

  // Current time (updates every second)
  const [now, setNow] = useState(() => spacetime.now());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(spacetime.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll (horizontal)
  // @ts-ignore
  const handleScroll = useCallback((e) => {
    setScrollLeft(e.target.scrollLeft);
  }, []);

  // Calculate hour width based on timeline width and visible hours
  const hourWidth = TIMELINE_WIDTH / VISIBLE_HOURS;

  // Calculate position of current time line
  const minutesSinceStart = now.diff(startTime, "minute");
  const currentLineX = (minutesSinceStart / 60) * hourWidth;

  // Calculate hover time
  let hoverTime = null;
  if (hoverX !== null) {
    hoverTime = getTimeAtPosition(hoverX + scrollLeft, startTime, hourWidth);
  }

  // Render time slots
  const timeSlots = [];
  for (let i = 0; i <= VISIBLE_HOURS; i++) {
    const t = startTime.add(i, "hour");
    timeSlots.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: i * hourWidth,
          top: 0,
          height: "100%",
          width: 1,
          background: "#333",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 4,
            color: "#888",
            fontSize: 12,
          }}
        >
          {t.format("time-short")}
        </div>
      </div>,
    );
  }

  return (
    <div
      style={{
        background: "#222",
        color: "#fff",
        padding: 16,
        borderRadius: 8,
        width: TIMELINE_WIDTH + 32,
        overflow: "hidden",
      }}
    >
      <div
        ref={timelineRef}
        style={{
          position: "relative",
          width: TIMELINE_WIDTH,
          height: HOUR_HEIGHT,
          overflowX: "auto",
          background: "#222",
          border: "1px solid #333",
          cursor: "pointer",
        }}
        onScroll={handleScroll}
        onMouseMove={(e) => {
          // @ts-ignore
          const rect = timelineRef.current.getBoundingClientRect();
          setHoverX(e.clientX - rect.left);
        }}
        onMouseLeave={() => setHoverX(null)}
      >
        {/* Time slots */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: hourWidth * VISIBLE_HOURS,
            height: "100%",
          }}
        >
          {timeSlots}
        </div>

        {/* Current time line */}
        {currentLineX >= 0 && currentLineX <= hourWidth * VISIBLE_HOURS && (
          <div
            style={{
              position: "absolute",
              left: currentLineX,
              top: 0,
              width: 2,
              height: "100%",
              background: "red",
              zIndex: 2,
            }}
          />
        )}

        {/* Hover line and label */}
        {hoverX !== null && (
          <>
            <div
              style={{
                position: "absolute",
                left: hoverX,
                top: 0,
                width: 1,
                height: "100%",
                background: "#aaa",
                zIndex: 3,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: hoverX + 8,
                top: 8,
                background: "#333",
                color: "#fff",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 12,
                zIndex: 4,
                pointerEvents: "none",
              }}
            >
              {hoverTime ? hoverTime.format("time-short") : ""}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
