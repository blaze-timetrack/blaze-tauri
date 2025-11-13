import { BaseColumn } from "./BaseColumn.tsx";
import { Event } from "./index.tsx";

interface ActivitiesColumnProps {
  events: Event[];
}

const ActivitiesColumn = ({ events }: ActivitiesColumnProps) => {
  return <BaseColumn events={events} className="bg-black/20" id="activities" />;
};

export default ActivitiesColumn;
