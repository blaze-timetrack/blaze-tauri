import { Moon, Sun } from "lucide-react";

import { useEffect, useState } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet } from "react-router";

import StateOfFlow from "@/components/shared/stage-of-flow";
import Tabs from "@/components/shared/tabs";
import TopBar from "@/components/shared/top-bar";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
// import type { Route } from "./+types/root";
import type { Route } from "../.react-router/types/src/+types/root";
import "./app.css";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList = "";
    root.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="bg-background border-border hover:bg-accent fixed right-4 bottom-4 rounded-full border p-2 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Blaze - Time Tracker</title>
        <Meta />
        <Links />
      </head>
      <body className="">
        <div className="grid h-screen grid-flow-row-dense grid-cols-12 grid-rows-24">
          <TopBar />
          <Tabs />
          {children}
          <StateOfFlow />
           {/*<ThemeToggle />*/}
        </div>
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <>
      <Outlet />;
      <TanStackRouterDevtools initialIsOpen={true} />
    </>
  );
}

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
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="text-accent mx-auto flex flex-1 flex-col items-center justify-center text-2xl bg-accent-foreground">
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
