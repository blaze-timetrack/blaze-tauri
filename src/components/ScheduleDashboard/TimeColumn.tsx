import { cn } from "@/lib/utils";

const TimeColumn = () => {
  // Generate time slots from 7 AM to 9 PM
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 7;
    return hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? `${hour}:00 PM` : `${hour}:00 AM`;
  });

  return (
    <div className="col-span-1 border-r border-gray-800">
      {timeSlots.map((time, index) => (
        <div
          key={time}
          className={cn(
            "h-14 px-2 flex items-center text-xs text-gray-400",
            index !== 0 && "border-t border-gray-800"
          )}
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;