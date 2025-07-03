import { cn } from "@/lib/utils";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { useEffect, useState } from "react";

const TimeColumn = () => {
  const currentTime12 = useSettingStore((state) => state.currentTime12);
  const currentTimeStart = useSettingStore((state) => state.currentTimeStart);
  let [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!currentTime12) {
      const time = Array.from({ length: 24 }, (_, i) => {
        return `${String(i).padStart(2, "0")}:00`;
      });
      setTimeSlots(time);
    }
    if (currentTime12) {
      const time = Array.from({ length: 24 }, (_, i) => {
        const hour = i % currentTimeStart || currentTimeStart;
        const period = i < 12 ? "AM" : "PM";
        return `${hour}:00 ${period}`;
      });
      setTimeSlots(time);
    }
  }, [currentTime12]);

  return (
    <div className="border-border w-fit border-r">
      {timeSlots.map((time, index) => (
        <div
          key={time}
          className={cn(
            "flex h-15 w-fit items-center px-2 text-xs text-gray-400",
            index !== 0 && "border-border border-t",
          )}
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
