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
import { motion, useAnimate } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils.ts";

function Tabs() {
  const setCommandOpen = useBasicStore((state) => state.setCommandOpen);
  // const [animateTabs, setAnimateTabs] = useState<boolean>(false);
  //
  // const [isPresent, safeToRemove] = usePresence();
  const [tabsScope, animate] = useAnimate();
  //
  useEffect(() => {});

  return (
    <motion.div
      // onMouseEnter={() => setAnimateTabs(true)}
      // onMouseLeave={() => setAnimateTabs(false)}
      ref={tabsScope}
      whileHover={{
        width: "112px",
        // alignItems: "start",
        // paddingLeft: "12px",
      }}
      // transition={{
      //   duration: 0.4,
      //   delay: 0.1,
      //   ease: [0, 0.71, 0.2, 1.01],
      // }}
      className="bg-primary/10 group flex w-14 flex-col items-center justify-between border-r px-1 py-6 hover:cursor-pointer hover:items-start"
    >
      {/* top-tabs */}
      <div className="flex flex-col gap-3">
        <NavLink to="/">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={cn(
                "group-hover:w-full group-hover:justify-start group-hover:px-4 group-hover:transition-all",
                isActive ? "bg-accent" : "",
              )}
            >
              <Home />
              <span
                className={
                  "hidden group-hover:inline group-hover:transition-all"
                }
              >
                Home
              </span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/timer">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={cn(
                "group-hover:w-full group-hover:justify-start group-hover:px-4 group-hover:transition-all",
                isActive ? "bg-accent" : "",
              )}
            >
              <TimerIcon />
              <span
                className={
                  "hidden group-hover:inline group-hover:transition-all"
                }
              >
                Timer
              </span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/categories">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={cn(
                "group-hover: group-hover:w-full group-hover:justify-start group-hover:transition-all",
                isActive ? "bg-accent" : "",
              )}
            >
              <ChartPie />
              <span
                className={
                  "hidden group-hover:inline group-hover:transition-all"
                }
              >
                Analysing
              </span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/projects">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={cn(
                "group-hover: group-hover:w-full group-hover:justify-start group-hover:transition-all",
                isActive ? "bg-accent" : "",
              )}
            >
              <FolderTree />
              <span
                className={
                  "hidden group-hover:inline group-hover:transition-all"
                }
              >
                Projects
              </span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/calender">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={cn(
                "group-hover: group-hover:w-full group-hover:justify-start group-hover:transition-all",
                isActive ? "bg-accent" : "",
              )}
            >
              <Calendar />
              <span
                className={
                  "hidden group-hover:inline group-hover:transition-all"
                }
              >
                Calender
              </span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/productivity/insight">
          {({ isActive }) => (
            <Button
              variant={"icon_btn"}
              size={"icon"}
              autoFocus={isActive}
              className={cn(
                "group-hover: group-hover:w-full group-hover:justify-start group-hover:transition-all",
                isActive ? "bg-accent" : "",
              )}
            >
              <Zap />
              <span
                className={
                  "hidden group-hover:inline group-hover:transition-all"
                }
              >
                insight
              </span>
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
    </motion.div>
  );
}

export default Tabs;
