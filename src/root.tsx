import React from "react";
// @ts-ignore
import {
  isRouteErrorResponse,
  Outlet,
  type Route,
  useNavigate,
} from "react-router";

import StateOfFlow from "@/components/shared/stage-of-flow";
import Tabs from "@/components/shared/tabs";
import { Commands } from "@/components/custom ui/commands.tsx";
import { cn, reloadWidget } from "@/lib/utils.ts";
import { useHotkeys } from "react-hotkeys-hook";
import { shortcuts } from "@/lib/constants/settings-const.tsx";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { useBasicStore } from "@/lib/zustand/basic-store.ts";
import TitleBar from "@/components/shared/backend components/title-bar.tsx";
import TopBar from "@/components/shared/top-bar.tsx";

export function RootLayout() {
  const commandsOpen = useBasicStore((state) => state.commandOpen);
  const setCommandsOpen = useBasicStore((state) => state.setCommandOpen);
  const navigate = useNavigate();

  const state = useSettingStore((state) => state.state);
  const setState = useSettingStore((state) => state.setState);

  const defaultFlowTimer = useSettingStore((state) => state.defaultFlowTimer);
  const setStateFlowTimer = useBasicStore((state) => state.setStateFlowTimer);

  const defaultBreakTimer = useSettingStore((state) => state.defaultBreakTimer);
  const setStateBreakTimer = useBasicStore((state) => state.setStateBreakTimer);

  const defaultMeetingTimer = useSettingStore(
    (state) => state.defaultMeetingTimer,
  );
  const setStateMeetingTimer = useBasicStore(
    (state) => state.setStateMeetingTimer,
  );

  useHotkeys(shortcuts, async (e, handler) => {
    console.log(`hotkey: ${handler.keys}`);

    // general hotkeys
    if (handler.ctrl && handler.keys?.includes("r")) {
      await reloadWidget();
      window.location.reload();
      return;
    }
    if (handler.ctrl && handler.keys?.includes("p")) {
      await setState(state === "TRACKING" ? "NO_TRACKING" : "TRACKING");
      await reloadWidget();
      return;
    }
    if (handler.ctrl && handler.keys?.includes("s")) {
      await setState("TRACKING");
      await reloadWidget();
      return;
    }
    if (handler.ctrl && handler.keys?.includes("f")) {
      await setState("FLOW");
      setStateFlowTimer(defaultFlowTimer);
    }
    if (handler.ctrl && handler.shift && handler.keys?.includes("f")) {
    }
    if (handler.ctrl && handler.keys?.includes("b")) {
      await setState("BREAK");
      setStateBreakTimer(defaultBreakTimer);
    }
    if (handler.ctrl && handler.shift && handler.keys?.includes("b")) {
    }
    if (handler.ctrl && handler.keys?.includes("m")) {
      await setState("MEETING");
      setStateMeetingTimer(defaultMeetingTimer);
    }
    if (handler.ctrl && handler.shift && handler.keys?.includes("m")) {
    }

    switch (handler.keys?.join("")) {
      case "h":
        navigate("/");
        break;
      case "t":
        navigate("/timer");
        break;
      case "c":
        navigate("/categories");
        break;
      case "p":
        navigate("/work/projects");
        break;
      case "g":
        e.preventDefault();
        setCommandsOpen(true);
        break;
    }
  });

  useHotkeys(
    [".", "?", ","],
    async function (event, handle) {
      console.log(`handle: ${handle.keys}`);
      switch (handle.keys?.join("")) {
        case "?":
          navigate("/support");
          break;
        case ".":
          navigate("/settings");
          break;
      }
    },
    { useKey: true },
  );

  return (
    <div className="grid h-screen grid-flow-row-dense grid-cols-12 grid-rows-26 select-none">
      <TitleBar />
      <TopBar />
      <div className={"col-span-full row-span-21 grid grid-cols-[auto_1fr]"}>
        <Tabs />
        <div className={"mx-6 my-4"}>
          <Outlet />
        </div>
      </div>
      {/*<div className={"row-span-20"}></div>*/}
      <StateOfFlow />
      {/*<ThemeToggle />*/}
      <div
        className={cn(
          "absolute z-50 h-full w-full backdrop-blur-sm",
          !commandsOpen && "hidden",
        )}
      >
        <Commands
          commandsOpen={commandsOpen}
          setCommandsOpen={setCommandsOpen}
        />
      </div>
    </div>
  );
}

export function OutletLayout() {
  return (
    <div className="grid h-screen grid-flow-row-dense grid-cols-12 grid-rows-24">
      <Outlet />
    </div>
  );
}

// @ts-ignore
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
    //   @ts-ignore
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="text-accent bg-accent-foreground mx-auto flex flex-1 flex-col items-center justify-center text-2xl">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
