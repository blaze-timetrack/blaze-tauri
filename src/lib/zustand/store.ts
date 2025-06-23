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
} from "@/lib/types/store-settings-types.ts";
import { create } from "zustand/react";
import { z } from "zod";

const tauriStore = new LazyStore(".settings.dat");

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

export enum SettingsKeys {
  CATEGORY_STATES = "categoryStates",
  GROUPING_PROGRAMS = "groupingPrograms",
}

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
  setGroupedProgram: (groupedPrograms: groupProgramsType) => Promise<void>;
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
        const val = [...categoryStates, categoryState]
          .filter((v) => {
            if (v.name !== categoryState.name) return v;
            error = "already_exists";
            return;
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        tauriStore.set(tauriStoreKey, val);
        return { categoryStates: val };
      });
    } else if (actionName === ActionNameTypes.UPDATE) {
      set(({ categoryStates }) => {
        const val = categoryStates
          .filter((v) => v.name !== categoryState.name)
          .sort((a, b) => a.name.localeCompare(b.name));
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
  setGroupedProgram: async (groupedPrograms: groupProgramsType) => {},
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
  const theme = (await tauriStore.get("theme")) as ThemeTypes;
  const parsedThem = z.nativeEnum(ThemeTypes).safeParse(theme);

  if (parsedThem.success) {
    useSettingStore.setState({ theme: parsedThem.data });

    const root = window.document.documentElement;
    root.classList.value = "";
    root.classList.add(theme);
  }

  useSettingStore.setState({ _hydrated: true });
};

// @todo can be hydrated form rust
hydrate();
