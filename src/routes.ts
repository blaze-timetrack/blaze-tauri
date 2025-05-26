import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("categories", "./pages/categories.tsx"),
  // work
  route("work/projects", "./pages/work/projects.tsx"),
  route("work/tasks", "./pages/work/tasks.tsx"),
  route("work/clients", "./pages/work/clients.tsx"),
  // productivity
  route("productivity/trends", "./pages/productivity/trends.tsx"),
  route("productivity/goals", "./pages/productivity/goals.tsx"),
  route("productivity/insights", "./pages/productivity/insights.tsx"),
  // teams
  route("teams", "./pages/teams/teams.tsx"),
] satisfies RouteConfig;
