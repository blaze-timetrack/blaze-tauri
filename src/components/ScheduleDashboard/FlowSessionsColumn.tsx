import BaseColumn from "./BaseColumn";
import { Event } from "./index";

interface FlowSessionsColumnProps {
  events: Event[];
}

const FlowSessionsColumn = ({ events }: FlowSessionsColumnProps) => {
  return <BaseColumn events={events} className="bg-black/30" id="flowSessions" />;
};

export default FlowSessionsColumn;