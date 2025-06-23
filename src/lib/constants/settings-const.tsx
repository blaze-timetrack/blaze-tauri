import AccountTab from "@/pages/settings/account-tab.tsx";
import CategoryTab from "@/pages/settings/category-tab.tsx";
import GroupingTab from "@/pages/settings/grouping-tab.tsx";
import {
  CategoryActionTypes,
  categoryStateTypes,
} from "@/lib/types/store-settings-types.ts";

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
    content: () => <></>,
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
    name: "App Category",
    value: "grouping",
    content: () => <GroupingTab />,
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
