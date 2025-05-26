import BaseColumn from "./BaseColumn";
import { Event } from "./index";

interface CalendarColumnProps {
  events: Event[];
}

const CalendarColumn = ({ events }: CalendarColumnProps) => {
  return <BaseColumn events={events} className="bg-black/20" id="calendar" />;
};

export default CalendarColumn;