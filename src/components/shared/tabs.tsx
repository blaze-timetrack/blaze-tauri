import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChartPie,
  CircleHelp,
  Command,
  FolderTree,
  Home,
  Settings,
  TimerIcon,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router";
import "./shared.module.css";
import { useBasicStore } from "@/lib/zustand/basic-store.ts";

function Tabs() {
  const setCommandOpen = useBasicStore((state) => state.setCommandOpen);

  return (
    <div className="bg-primary/10 row-span-19 flex w-16 flex-col items-center justify-between border-r py-6">
      {/* top-tabs */}
      <div className="flex flex-col gap-3">
        <NavLink to="/">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <Home />
            </Button>
          )}
        </NavLink>
        <NavLink to="/timer">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <TimerIcon />
            </Button>
          )}
        </NavLink>
        <NavLink to="/categories">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <ChartPie />
            </Button>
          )}
        </NavLink>
        <NavLink to="/projects">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <FolderTree />
            </Button>
          )}
        </NavLink>
        <NavLink to="/calender">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <Calendar />
            </Button>
          )}
        </NavLink>
        <NavLink to="/productivity/insight">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <Zap />
            </Button>
          )}
        </NavLink>
      </div>
      {/* bottom-tabs */}
      <div className="flex flex-col gap-3">
        <Button
          variant={"icon_btn"}
          size={"icon"}
          onClick={() => setCommandOpen(true)}
        >
          <Command />
        </Button>
        <NavLink to="/support">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <CircleHelp />
            </Button>
          )}
        </NavLink>
        <NavLink to="/settings">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <Settings />
            </Button>
          )}
        </NavLink>
      </div>
    </div>
  );
}

export default Tabs;
