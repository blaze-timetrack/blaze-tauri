import { Route, Routes, useNavigate } from "react-router";
import { RootLayout } from "@/root";
import HomePage from "@/pages/home.tsx";
import CategoriesPage from "@/pages/categories.tsx";
import Tasks from "@/pages/work/tasks.tsx";
import Clients from "@/pages/work/clients.tsx";
import Trends from "@/pages/productivity/trends.tsx";
import Insights from "@/pages/productivity/insights.tsx";
import Goals from "@/pages/productivity/goals.tsx";
import Projects from "@/pages/work/projects.tsx";
import Teams from "@/pages/teams/teams.tsx";
import { Button } from "@/components/ui/button.tsx";
import Widget from "@/pages/widget.tsx";
import Notification from "@/pages/notification.tsx";
import Settings from "@/pages/settings.tsx";
import { useRef, useState } from "react";
import useSetShortcuts, { Keys } from "@/hooks/useSetShortcuts.tsx";
import { SettingsStoreLoaded } from "@/lib/zustand/settings-store-loaded.tsx";

function App() {
  // const [isWidget, setIsWidget] = useState(true);
  const [commandsOpen, setCommandsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // shortcuts
  useSetShortcuts(
    containerRef,
    () => {
      setCommandsOpen(false);
    },
    (key, event) => {
      if (key === Keys.ESCAPE) {
        console.log("escape");
        setCommandsOpen(false);
      } else if (key == Keys.G) {
        console.log("Go to Page");
      } else if (key == Keys.H) {
        console.log("home");
        navigate("/");
      } else if (key == Keys.C) {
        console.log("Categories");
        navigate("/categories");
      } else if (key == Keys.P) {
        console.log("Projects");
        navigate("/work/projects");
      } else if (key == Keys.I) {
        console.log("Insights");
        navigate("/insights");
      } else if (key == Keys.FORWARD_SLASH) {
        console.log("Commands");
        // @error: undergoing loop what is the reason
        // if (commandsOpen) {
        //   setCommandsOpen(false);
        // } else {
        //   setCommandsOpen(true);
        // }
        setCommandsOpen(true);
      } else if (key == Keys.QUESTION) {
        console.log("Question");
        navigate("/support");
      } else if (key == Keys.COMMA) {
        console.log("Settings");
        navigate("/settings");
      }
    },
  );

  return (
    <SettingsStoreLoaded>
      <Routes>
        <Route
          element={
            <RootLayout
              commandsRef={containerRef}
              commandsOpen={commandsOpen}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path={"work/projects"} element={<Projects />} />
          <Route path={"work/tasks"} element={<Tasks />} />
          <Route path={"work/clients"} element={<Clients />} />
          {/* productivity */}
          <Route path={"productivity/trends"} element={<Trends />} />
          <Route path={"productivity/goals"} element={<Goals />} />
          <Route path={"productivity/insights"} element={<Insights />} />

          {/* teams */}
          <Route path={"teams"} element={<Teams />} />

          <Route path={"/settings"} element={<Settings />} />

          {/*  Errors */}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path={"widget"} element={<Widget />} />
        <Route path={"notification"} element={<Notification />} />
      </Routes>
    </SettingsStoreLoaded>
  );
}

const NotFound = () => {
  return (
    <main className="row-span-20 flex w-full flex-col items-center justify-center text-2xl">
      <h1>404 - Not Found</h1>
      <p>
        this path is invalid to
        <a href="/">
          <Button variant={"link"} className={"text-2xl"}>
            Go Home
          </Button>
        </a>
      </p>
    </main>
  );
};
export default App;
