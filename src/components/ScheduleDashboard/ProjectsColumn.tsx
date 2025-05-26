import BaseColumn from "./BaseColumn";
import { Event } from "./index";

interface ProjectsColumnProps {
  events: Event[];
}

const ProjectsColumn = ({ events }: ProjectsColumnProps) => {
  return <BaseColumn events={events} className="bg-black/30" id="projects" />;
};

export default ProjectsColumn;