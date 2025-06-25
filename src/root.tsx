import React from "react";
// @ts-ignore
import { isRouteErrorResponse, Outlet, type Route } from "react-router";

import StateOfFlow from "@/components/shared/stage-of-flow";
import Tabs from "@/components/shared/tabs";
import { Commands } from "@/components/custom ui/commands.tsx";
import { cn } from "@/lib/utils.ts";
import TitleBar from "@/components/backend components/title-bar.tsx";
import TopBar from "@/components/shared/top-bar.tsx";

export function RootLayout({
  commandsRef,
  commandsOpen,
}: {
  commandsRef: React.MutableRefObject<HTMLDivElement | null>;
  commandsOpen: boolean;
}) {
  return (
    <div className="grid h-screen grid-flow-row-dense grid-cols-12 grid-rows-24 select-none">
      <TitleBar />
      <TopBar />
      <div className={"col-span-full row-span-19 grid grid-cols-[auto_1fr]"}>
        <Tabs />
        <div className={"mx-8 my-4 lg:mx-12"}>
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
        <Commands commandsRef={commandsRef} commandsOpen={commandsOpen} />
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
