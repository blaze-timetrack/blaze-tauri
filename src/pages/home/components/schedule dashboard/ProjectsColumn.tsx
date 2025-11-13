import { BaseColumn } from "./BaseColumn.tsx";
import { Event } from "./index.tsx";

interface ProjectsColumnProps {
  events: Event[];
}

const ProjectsColumn = ({ events }: ProjectsColumnProps) => {
  return <BaseColumn events={events} className="bg-black/30" id="projects" />;
};

export default ProjectsColumn;
