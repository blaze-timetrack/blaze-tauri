import { Route, Routes } from "react-router";
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

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
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

        {/*  Errors */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
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
