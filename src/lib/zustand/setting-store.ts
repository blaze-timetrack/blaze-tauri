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
} from "@/lib/types/store-settings.types.ts";
import { create } from "zustand/react";
import { z } from "zod";
import { SettingsKeys } from "@/lib/constants/settings-const.tsx";
import { ITimezone, ITimezoneOption } from "react-timezone-select";

const tauriStore = new LazyStore(".settings.dat", { autoSave: true });

export interface defaultScheduleDashboardColVisibleTypes {
  label: string;
  value: string;
  checkValue: boolean;
}

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

// export const defaultFlowTimer = 45 * 60;
export const defaultFlowTimer = 5 * 60;
export const defaultBreakTimer = 5 * 60;

export const defaultScheduleDashboardColVisible: defaultScheduleDashboardColVisibleTypes[] =
  [
    {
      label: "Flow Sessions",
      value: "flow_session",
      checkValue: true,
    },
    {
      label: "Projects",
      value: "project",
      checkValue: true,
    },
    {
      label: "Clients",
      value: "client",
      checkValue: true,
    },
    {
      label: "Tasks",
      value: "task",
      checkValue: true,
    },
  ];

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const now = new Date();

export interface SettingsStore {
  categoryStates: categoryStateTypes[];
  groupedPrograms: groupProgramsType[];
  theme: ThemeTypes;
  themeMode: ThemeModeTypes;
  timezone: ITimezoneOption;
  currentTime12: boolean;
  currentTimeStart: number;
  state: StateTypes;
  defaultFlowTimer: number;
  defaultBreakTimer: number;
  scheduleDashboardColVisible: defaultScheduleDashboardColVisibleTypes[];
  currentMusic: MusicTypes;
  volume: number;
  isPlaying: boolean;
  zoomLevel: number;
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
  setTimezone: (timezone: ITimezoneOption) => Promise<void>;
  setCurrentTime12: (currentTime12: boolean) => Promise<void>;
  setState: (state: StateTypes) => Promise<void>;
  setDefaultFlowTimer: (defaultFlowTimer: number) => Promise<void>;
  setDefaultBreakTimer: (defaultBreakTimer: number) => Promise<void>;
  setScheduleDashboardColVisible: (
    scheduleDashboardColVisible: defaultScheduleDashboardColVisibleTypes,
  ) => Promise<void>;
  setCurrentMusic: (currentMusic: MusicTypes) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setIsPlaying: (isPlaying: boolean) => Promise<void>;
  setZoomLevel: (zoomLevel: number) => Promise<void>;
  _hydrated: boolean;
}

export const useSettingStore = create<SettingsStore>((set) => ({
  categoryStates: defaultCategoryStates,
  groupedPrograms: defaultGroupingPrograms,
  theme: "system",
  themeMode: "default",
  timezone: {
    value: Intl.DateTimeFormat().resolvedOptions().timeZone,
    label: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  currentTime12: true,
  currentTimeStart: 12,
  state: "TRACKING",
  defaultFlowTimer: defaultFlowTimer,
  defaultBreakTimer: defaultBreakTimer,
  scheduleDashboardColVisible: defaultScheduleDashboardColVisible,
  currentMusic: {
    name: "Silent",
    value: "silent",
  },
  volume: 100,
  isPlaying: false,
  zoomLevel: 60,
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

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      // @todo system here & window native theme also
      // await tauriStore.set("theme", theme);
      return;
    }

    root.classList.add(theme);
    await tauriStore.set("theme", theme);
  },
  setThemeMode: async (themeMode: ThemeModeTypes) => {
    set({ themeMode });
    const root = window.document.getElementsByTagName("body")[0];

    root.setAttribute("data-theme", themeMode);

    await tauriStore.set("themeMode", themeMode);
  },
  setTimezone: async (timezone: ITimezoneOption) => {
    set({ timezone });
    await tauriStore.set("timezone", timezone);
  },
  setCurrentTime12: async (currentTime12: boolean) => {
    set({ currentTime12 });
    await tauriStore.set("currentTime12", currentTime12);
  },
  setState: async (state: StateTypes) => {
    set({ state });
    if (state === "TRACKING" || state === "NO_TRACKING") {
      await tauriStore.set("state", state);
    } else {
      await tauriStore.set("state", "TRACKING");
    }
  },
  setDefaultFlowTimer: async (defaultFlowTimer) => {
    set({ defaultFlowTimer });
    await tauriStore.set("defaultFlowTimer", defaultFlowTimer);
  },
  setDefaultBreakTimer: async (defaultBreakTimer) => {
    set({ defaultBreakTimer });
    await tauriStore.set("defaultBreakTimer", defaultBreakTimer);
  },
  setScheduleDashboardColVisible: async (scheduleDashboardColVisible) => {
    let past_data = useSettingStore
      .getState()
      .scheduleDashboardColVisible.filter(
        (v) => v.value !== scheduleDashboardColVisible.value,
      );
    past_data = [...past_data, scheduleDashboardColVisible].sort((a, b) =>
      a.value.localeCompare(b.value),
    );
    set({ scheduleDashboardColVisible: past_data });
    await tauriStore.set("scheduleDashboardColVisible", past_data);
  },
  setCurrentMusic: async (currentMusic: MusicTypes) => {
    set({ currentMusic });
    await tauriStore.set("currentMusic", currentMusic);
  },
  setVolume: async (volume: number) => {
    set({ volume });
    await tauriStore.set("volume", volume);
  },
  setIsPlaying: async (isPlaying: boolean) => {
    set({ isPlaying });
    await tauriStore.set("isPlaying", isPlaying);
  },
  setZoomLevel: async (zoomLevel) => {
    set({ zoomLevel });
    await tauriStore.set("zoomLevel", zoomLevel);
  },
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
  const themeMode = (await tauriStore.get("themeMode")) as ThemeModeTypes;
  const timezone = (await tauriStore.get("timezone")) as ITimezone;
  const state = (await tauriStore.get("state")) as StateTypes;
  const defaultFlowTimerCheck = (await tauriStore.get(
    "defaultFlowTimer",
  )) as number;
  const defaultBreakTimerCheck = (await tauriStore.get(
    "defaultBreakTimer",
  )) as number;
  const scheduleDashboardColVisible = (await tauriStore.get(
    "scheduleDashboardColVisible",
  )) as defaultScheduleDashboardColVisibleTypes[];
  const currentTime12 = (await tauriStore.get("currentTime12")) as boolean;
  const currentMusic = (await tauriStore.get("currentMusic")) as MusicTypes;
  const volume = (await tauriStore.get("volume")) as number;
  const isPlaying = (await tauriStore.get("isPlaying")) as boolean;
  const zoomLevel = (await tauriStore.get("zoomLevel")) as number;

  const parsedCategoryStates = zodCategoryStateSchema.safeParse(categoryStates);
  const parseGroupedPrograms = zodGroupProgramsSchema.safeParse(categoryStates);
  const parsedTheme = z.enum(["dark", "light", "system"]).safeParse(theme);
  const parsedThemeMode = z
    .enum(["default", "mono", "catppuccin"])
    .safeParse(themeMode);
  const parsedTimezone =
    z
      .object({
        value: z.string(),
        label: z.string(),
        abbrev: z.string().optional(),
        altName: z.string().optional(),
        offset: z.number().optional(),
      })
      .safeParse(timezone) || z.string().safeParse(timezone);
  const parsedState = z
    .enum([
      "FETCH",
      "TRACKING",
      "FLOW",
      "BREAK",
      "MEETING",
      "WORKOUT",
      "NO_TRACKING",
    ])
    .safeParse(state);
  const parsedDefaultFlowTimerCheck = z
    .number()
    .safeParse(defaultFlowTimerCheck);
  const parsedDefaultBreakTimerCheck = z
    .number()
    .safeParse(defaultBreakTimerCheck);
  const parsedScheduleDashboardColVisible = z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        checkValue: z.boolean(),
      }),
    )
    .safeParse(scheduleDashboardColVisible);
  const parsedCurrentTime12 = z.boolean().safeParse(currentTime12);
  const parsedCurrentMusic = z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .safeParse(currentMusic);
  const parsedVolume = z.number().safeParse(volume);
  const parsedIsPlaying = z.boolean().safeParse(isPlaying);
  const parsedZoomLevel = z.number().safeParse(zoomLevel);

  if (parsedCategoryStates.success) {
    useSettingStore.setState({ categoryStates: parsedCategoryStates.data });
  }
  if (parseGroupedPrograms.success) {
    useSettingStore.setState({ groupedPrograms: parseGroupedPrograms.data });
  }
  if (parsedTheme.success) {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (parsedTheme.data === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(parsedTheme.data);

    useSettingStore.setState({ theme: parsedTheme.data });
  }
  if (parsedThemeMode.success) {
    useSettingStore.setState({ themeMode: parsedThemeMode.data });
    const root = window.document.getElementsByTagName("body")[0];
    root.setAttribute("data-theme", parsedThemeMode.data);
  } else {
    const root = window.document.getElementsByTagName("body")[0];

    const val = useSettingStore.getState();
    root.setAttribute("data-theme", val.themeMode);
  }
  if (parsedTimezone.success) {
    useSettingStore.setState({ timezone: parsedTimezone.data });
  }
  if (parsedCurrentTime12.success) {
    useSettingStore.setState({ currentTime12: parsedCurrentTime12.data });
  }
  if (parsedState.success) {
    useSettingStore.setState({ state: parsedState.data });
  }
  if (parsedDefaultFlowTimerCheck.success) {
    useSettingStore.setState({
      defaultFlowTimer: parsedDefaultFlowTimerCheck.data,
    });
  }
  if (parsedDefaultBreakTimerCheck.success) {
    useSettingStore.setState({
      defaultBreakTimer: parsedDefaultBreakTimerCheck.data,
    });
  }
  if (parsedScheduleDashboardColVisible.success) {
    const data = parsedScheduleDashboardColVisible.data.sort((a, b) =>
      a.value.localeCompare(b.value),
    );
    useSettingStore.setState({
      scheduleDashboardColVisible: data,
    });
  }

  if (parsedCurrentMusic.success) {
    useSettingStore.setState({
      currentMusic: parsedCurrentMusic.data,
    });
  }
  if (parsedVolume.success) {
    useSettingStore.setState({
      volume: parsedVolume.data,
    });
  }
  if (parsedIsPlaying.success) {
    useSettingStore.setState({
      isPlaying: parsedIsPlaying.data,
    });
  }

  if (parsedZoomLevel.success) {
    useSettingStore.setState({
      zoomLevel: parsedZoomLevel.data,
    });
  }

  useSettingStore.setState({ _hydrated: true });
};

// @todo can be hydrated form rust
hydrate();
