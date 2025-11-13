import { cn } from "@/lib/utils.ts";
import { Card } from "@/components/ui/card.tsx";

const EventBlockDetails = ({ startPosition, details }) => {
  if (startPosition.y === 0) {
    return null;
  }
  // 540 is from 9 time blocks of 60min = 60px
  if (startPosition.y > 540 && startPosition.y < 1080) {
    startPosition.y = startPosition.y - 540;
  } else if (startPosition.y > 1080) {
    startPosition.y = startPosition.y - 1080;
  }

  return (
    <Card
      style={{
        top: `${startPosition.y}px`,
        left: `${startPosition.x}px`,
      }}
      className={cn("absolute z-50 h-2/8 w-3xs rounded-md px-4 py-2")}
    >
      Hello
    </Card>
  );
};

export default EventBlockDetails;
