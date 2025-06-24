import { LazyStore } from "@tauri-apps/plugin-store";
import {
  ActionNameTypes,
  CategoryActionTypes,
  categoryStateTypes,
  GroupProgramsPlatformType,
  groupProgramsType,
  MusicTypes,
  StateTypes,
  ThemeModeTypes,
  ThemeTypes,
  zodCategoryStateSchema,
  zodGroupProgramsSchema,
} from "@/lib/types/store-settings-types.ts";
import { create } from "zustand/react";
import { z } from "zod";
import { SettingsKeys } from "@/lib/constants/settings-const.tsx";

const tauriStore = new LazyStore(".settings.dat", { autoSave: true });

//       let res = await invoke<InstalledApplication[]>(
//         "get_installed_applications",
//       );
//       res = res.slice(0, 10);
//       console.log("from winreg: ", res);
//       setGroupPrograms([
//         ...res.map(({ name, publisher }) => ({
//           name,
//           publisher,
//           category: "browser",
//           platform: GroupProgramsPlatformType.WINDOWS,
//           point: 0,
//         })),
//       ]);
// @todo setup the default states on setup of application
export const defaultCategoryStates = [
  {
    name: "browser",
    state_flow: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
    state_work: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
    state_idle: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
    state_block: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
  },
  {
    name: "email",
    state_flow: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
    state_work: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
    state_idle: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
    state_block: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
  },
  {
    name: "social",
    state_flow: {
      state: false,
      action: CategoryActionTypes.DISABLE_CATEGORY,
    },
    state_work: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
    state_idle: {
      state: true,
      action: CategoryActionTypes.ENABLE_CATEGORY,
    },
    state_block: {
      state: true,
      action: CategoryActionTypes.DISABLE_CATEGORY,
    },
  },
];
export const defaultGroupingPrograms = [
  {
    name: "zen browser",
    publisher: "browser company",
    category: "browser",
    platform: GroupProgramsPlatformType.WINDOWS,
    point: 0,
  },
  {
    name: "key paint",
    publisher: "Apple Inc.",
    category: "paint",
    platform: GroupProgramsPlatformType.MACOS,
    point: 0,
  },
];

export interface SettingsStore {
  categoryStates: categoryStateTypes[];
  groupedPrograms: groupProgramsType[];
  theme: ThemeTypes;
  themeMode: ThemeModeTypes;
  state: StateTypes;
  volume: number;
  music: MusicTypes;
  setCategoryState: (
    categoryStates: categoryStateTypes,
    actionName?: ActionNameTypes,
  ) => Promise<string | undefined>;
  setGroupedProgram: (
    groupedProgram: groupProgramsType,
    actionName?: ActionNameTypes,
  ) => Promise<string | undefined>;
  setTheme: (theme: ThemeTypes) => Promise<void>;
  setThemeMode: (themeMode: ThemeModeTypes) => Promise<void>;
  setState: (state: StateTypes) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setMusic: (music: MusicTypes) => Promise<void>;
  _hydrated: boolean;
}

export const useSettingStore = create<SettingsStore>((set) => ({
  categoryStates: defaultCategoryStates,
  groupedPrograms: defaultGroupingPrograms,
  theme: ThemeTypes.SYSTEM,
  themeMode: ThemeModeTypes.DEFAULT,
  state: StateTypes.TRACKING,
  volume: 100,
  music: MusicTypes.SILENT,
  setCategoryState: async (categoryState, actionName = ActionNameTypes.SET) => {
    const tauriStoreKey = SettingsKeys.CATEGORY_STATES;
    let error = "";
    if (actionName === ActionNameTypes.SET) {
      set(({ categoryStates }) => {
        let val = categoryStates.filter((v) => {
          if (v.name.toLowerCase() !== categoryState.name.toLowerCase())
            return v;
          error = "already_exists";
          return;
        });
        if (error === "already_exists") {
          return { categoryStates: categoryStates };
        }
        val = [...val, categoryState].sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        tauriStore.set(tauriStoreKey, val);
        return { categoryStates: val };
      });
    } else if (actionName === ActionNameTypes.UPDATE) {
      set(({ categoryStates }) => {
        let val = categoryStates.filter(
          (v) => v.name.toLowerCase() !== categoryState.name.toLowerCase(),
        );
        val = [...val, categoryState].sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        tauriStore.set(tauriStoreKey, val);
        return {
          categoryStates: val,
        };
      });
    } else if (actionName === ActionNameTypes.RESET) {
      set(({ categoryStates }) => {
        tauriStore.set(tauriStoreKey, defaultCategoryStates);
        return { categoryStates: defaultCategoryStates };
      });
    }
    if (error === "") {
      return;
    }
    return error;
  },
  setGroupedProgram: async (
    groupedProgram: groupProgramsType,
    actionName = ActionNameTypes.SET,
  ) => {
    const tauriStoreKey = SettingsKeys.GROUPING_PROGRAMS;
    let error = "";

    if (actionName === ActionNameTypes.SET) {
      set(({ groupedPrograms }) => {
        let val = groupedPrograms.filter((v) => {
          if (v.name.toLowerCase() !== groupedProgram.name.toLowerCase())
            return v;
          error = "already_exists";
          return;
        });
        if (error === "already_exists") {
          return { groupedPrograms: groupedPrograms };
        }
        val = [...val, groupedProgram].sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        tauriStore.set(tauriStoreKey, val);
        return {
          groupedPrograms: val,
        };
      });
    } else if (actionName === ActionNameTypes.RESET) {
      set(({ groupedPrograms }) => {
        tauriStore.set(tauriStoreKey, defaultGroupingPrograms);
        return { groupedPrograms: defaultGroupingPrograms };
      });
    }
    if (error === "") {
      return;
    }
    return error;
  },
  setTheme: async (theme: ThemeTypes) => {
    set({ theme: theme });

    const root = window.document.documentElement;
    root.classList.value = "";
    root.classList.add(theme);

    await tauriStore.set("theme", theme);
  },
  setThemeMode: async (themeMode: ThemeModeTypes) => {},
  setState: async (state: StateTypes) => {},
  setVolume: async (volume: number) => {},
  setMusic: async (music: MusicTypes) => {},
  _hydrated: false,
}));

const hydrate = async () => {
  const categoryStates = (await tauriStore.get(
    "categoryStates",
  )) as categoryStateTypes[];
  const groupedPrograms = (await tauriStore.get(
    "groupedPrograms",
  )) as groupProgramsType[];
  const theme = (await tauriStore.get("theme")) as ThemeTypes;

  const parsedCategoryStates = zodCategoryStateSchema.safeParse(categoryStates);
  const parseGroupedPrograms = zodGroupProgramsSchema.safeParse(categoryStates);
  const parsedTheme = z.nativeEnum(ThemeTypes).safeParse(theme);

  if (parsedCategoryStates.success) {
    useSettingStore.setState({ categoryStates: parsedCategoryStates.data });
  }
  if (parseGroupedPrograms.success) {
    useSettingStore.setState({ groupedPrograms: parseGroupedPrograms.data });
  }
  if (parsedTheme.success) {
    useSettingStore.setState({ theme: parsedTheme.data });

    const root = window.document.documentElement;
    root.classList.value = "";
    root.classList.add(theme);
  }

  useSettingStore.setState({ _hydrated: true });
};

// @todo can be hydrated form rust
hydrate();
