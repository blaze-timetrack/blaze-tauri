import BaseColumn from "./BaseColumn";
import { Event } from "./index";

interface ActivitiesColumnProps {
  events: Event[];
}

const ActivitiesColumn = ({ events }: ActivitiesColumnProps) => {
  return <BaseColumn events={events} className="bg-black/20" id="activities" />;
};

export default ActivitiesColumn;
