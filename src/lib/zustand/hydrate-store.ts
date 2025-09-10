import { create } from "zustand/react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { connectToDB } from "@/db";
import { timeD } from "@/lib/utils.ts";

export const timeFormat = "{hour-24-pad}:{minute-pad}:{second-pad}";

export interface HydrateStoreTypes {
  currentDay: string;
  currentTime: string;
  currentActiveDay: string | null;
  setCurrentDay: (currentDay: string) => void;
  setCurrentTime: (currentTime: string) => void;
  setCurrentActiveDay: (currentActiveDay: string | null) => void;
  _hydrated: boolean;
}

export const useHydrateStore = create<HydrateStoreTypes>((set) => ({
  currentDay: "",
  currentTime: "",
  currentActiveDay: null,
  setCurrentDay: (currentDay) => {
    set({ currentDay });
  },
  setCurrentTime: (currentTime: string) => {
    set({ currentTime });
  },
  setCurrentActiveDay: (currentActiveDay) => {
    set({ currentActiveDay });
  },
  _hydrated: false,
}));

const hydrate = async () => {
  const tauriTimezone = useSettingStore.getState().timezone;
  let d = timeD(null, tauriTimezone.value);
  useHydrateStore.setState({ currentTime: d.format(timeFormat) });
  useHydrateStore.setState({
    currentDay: d.format("{date-pad}-{month-pad}-{year}-{timezone}"),
  });

  // useHydrateStore.setState({
  //   currentActiveDay: d.format("{date-pad}-{month-pad}-{year}-{timezone}"),
  // });

  const currentDay = useHydrateStore.getState().currentDay;

  try {
    const db = await connectToDB();
    // check if today row present handle edge case like (change the day, timezone change)
    await db.execute("INSERT INTO days (date_id) VALUES ($1)", [currentDay]);
  } catch (e) {
    console.log(`error from hydratestore: ${e}`);
  }

  useHydrateStore.setState({ _hydrated: true });
};

hydrate();
