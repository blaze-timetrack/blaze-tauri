import { BaseColumn } from "./BaseColumn.tsx";
import { Event } from "./index.tsx";

interface FlowSessionsColumnProps {
  events: Event[];
}

const FlowSessionsColumn = ({ events }: FlowSessionsColumnProps) => {
  return (
    <BaseColumn events={events} className="bg-black/30" id="flowSessions" />
  );
};

export default FlowSessionsColumn;
