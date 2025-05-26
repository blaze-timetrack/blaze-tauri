import { ScrollArea } from "@/components/ui/scroll-area";
import TimeColumn from "./TimeColumn";
import ActivitiesColumn from "./ActivitiesColumn";
import FlowSessionsColumn from "./FlowSessionsColumn";
import CalendarColumn from "./CalendarColumn";
import ProjectsColumn from "./ProjectsColumn";
import ColumnHeader from "./ColumnHeader";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis, snapCenterToCursor } from "@dnd-kit/modifiers";
import { useState } from "react";

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

const ScheduleDashboard = () => {
  const [activities, setActivities] = useState<Event[]>([
    {
      id: "1",
      title: "Deep Work Session",
      startTime: "09:00",
      endTime: "12:00",
      color: "bg-purple-400",
    },
  ]);

  const [flowSessions, setFlowSessions] = useState<Event[]>([
    {
      id: "2",
      title: "Focused Coding",
      startTime: "10:00",
      endTime: "11:30",
      color: "bg-amber-400",
    },
    {
      id: "3",
      title: "Review Session",
      startTime: "12:00",
      endTime: "13:00",
      color: "bg-lavender-400",
    },
    {
      id: "4",
      title: "Planning",
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-amber-500",
    },
  ]);

  const [calendarEvents, setCalendarEvents] = useState<Event[]>([
    {
      id: "5",
      title: "Team Meeting",
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-teal-400",
    },
    {
      id: "6",
      title: "Lunch Break",
      startTime: "13:00",
      endTime: "14:00",
      color: "bg-sky-400",
    },
  ]);

  const [projects, setProjects] = useState<Event[]>([
    {
      id: "7",
      title: "Dashboard Redesign",
      startTime: "09:00",
      endTime: "11:00",
      color: "bg-rose-400",
    },
    {
      id: "8",
      title: "API Integration",
      startTime: "15:00",
      endTime: "17:00",
      color: "bg-emerald-500",
    },
  ]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const eventId = active.id;
    const sourceColumn = getColumnByEventId(eventId);
    const targetColumn = over.id as string;

    if (sourceColumn === targetColumn) return;

    // Move event between columns
    const draggedEvent = findAndRemoveEvent(eventId);
    if (!draggedEvent) return;

    // Add event to target column
    switch (targetColumn) {
      case 'activities':
        setActivities(prev => [...prev, draggedEvent]);
        break;
      case 'flowSessions':
        setFlowSessions(prev => [...prev, draggedEvent]);
        break;
      case 'calendar':
        setCalendarEvents(prev => [...prev, draggedEvent]);
        break;
      case 'projects':
        setProjects(prev => [...prev, draggedEvent]);
        break;
    }
  };

  const getColumnByEventId = (eventId: string): string => {
    if (activities.find(e => e.id === eventId)) return 'activities';
    if (flowSessions.find(e => e.id === eventId)) return 'flowSessions';
    if (calendarEvents.find(e => e.id === eventId)) return 'calendar';
    if (projects.find(e => e.id === eventId)) return 'projects';
    return '';
  };

  const findAndRemoveEvent = (eventId: string): Event | undefined => {
    const column = getColumnByEventId(eventId);
    let event: Event | undefined;

    switch (column) {
      case 'activities':
        setActivities(prev => {
          event = prev.find(e => e.id === eventId);
          return prev.filter(e => e.id !== eventId);
        });
        break;
      case 'flowSessions':
        setFlowSessions(prev => {
          event = prev.find(e => e.id === eventId);
          return prev.filter(e => e.id !== eventId);
        });
        break;
      case 'calendar':
        setCalendarEvents(prev => {
          event = prev.find(e => e.id === eventId);
          return prev.filter(e => e.id !== eventId);
        });
        break;
      case 'projects':
        setProjects(prev => {
          event = prev.find(e => e.id === eventId);
          return prev.filter(e => e.id !== eventId);
        });
        break;
    }

    return event;
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-black text-white rounded-lg overflow-hidden">
      <div className="grid grid-cols-5">
        <div className="col-span-1 border-r border-gray-800"></div>
        <ColumnHeader title="Activities" />
        <ColumnHeader title="Flow Sessions" />
        <ColumnHeader title="Calendar" />
        <ColumnHeader title="Projects" />
      </div>

      <ScrollArea className="h-[600px]" scrollHideDelay={0}>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, snapCenterToCursor]}
        >
          <div className="grid grid-cols-5">
            <TimeColumn />
            <ActivitiesColumn events={activities} />
            <FlowSessionsColumn events={flowSessions} />
            <CalendarColumn events={calendarEvents} />
            <ProjectsColumn events={projects} />
          </div>
        </DndContext>
      </ScrollArea>
    </div>
  );
};

export default ScheduleDashboard;