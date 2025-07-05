import AccountTab from "@/pages/settings/account-tab.tsx";
import CategoryTab from "@/pages/settings/category-tab.tsx";
import GroupingTab from "@/pages/settings/grouping-tab.tsx";
import {
  CategoryActionTypes,
  categoryStateTypes,
} from "@/lib/types/store-settings.types.ts";
import ThemeTab from "@/pages/settings/theme-tab.tsx";
import ActivityTab from "@/pages/settings/activity-tab.tsx";

export enum SettingsKeys {
  CATEGORY_STATES = "categoryStates",
  GROUPING_PROGRAMS = "groupedPrograms",
  THEME = "THEME",
}

export const settingsTabList = [
  {
    id: 1,
    name: "Account",
    value: "account",
    content: () => <AccountTab />,
  },
  {
    id: 2,
    name: "Activity",
    value: "activity",
    content: () => <ActivityTab />,
  },
  {
    id: 3,
    name: "Billing",
    value: "billing",
    content: () => <></>,
  },
  {
    id: 4,
    name: "Category",
    value: "categories",
    content: () => <CategoryTab />,
  },
  {
    id: 5,
    name: "Categorise Programs",
    value: "grouping",
    content: () => <GroupingTab />,
  },
  {
    id: 6,
    name: "Theme",
    value: "theme",
    content: () => <ThemeTab />,
  },
  {
    id: 7,
    name: "Privacy",
    value: "privacy",
    content: () => <></>,
  },
  {
    id: 8,
    name: "Planning",
    value: "planning",
    content: () => <></>,
  },
  {
    id: 9,
    name: "Notification",
    value: "notification",
    content: () => <></>,
  },
  {
    id: 10,
    name: "Distraction Blocker",
    value: "distraction_blocker",
    content: () => <></>,
  },
  {
    id: 11,
    name: "Data Export",
    value: "data_export",
    content: () => <></>,
  },
];

export const defaultCategoryState: categoryStateTypes = {
  name: "",
  state_flow: {
    state: true,
    action: CategoryActionTypes.ENABLE_CATEGORY,
  },
  state_work: {
    state: true,
    action: CategoryActionTypes.ENABLE_CATEGORY,
  },
  state_block: {
    state: true,
    action: CategoryActionTypes.ENABLE_CATEGORY,
  },
  state_idle: {
    state: true,
    action: CategoryActionTypes.ENABLE_CATEGORY,
  },
};

export const shortcuts: string[] = [
  "h",
  "t",
  "c",
  "p",
  "g",
  "?",
  ".",
  "ctrl+p",
  "ctrl+f",
  "ctrl+shift+f",
  "ctrl+b",
  "ctrl+shift+b",
  "ctrl+s",
];
