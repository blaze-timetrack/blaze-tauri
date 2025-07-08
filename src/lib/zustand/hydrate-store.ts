import { create } from "zustand/react";
import spacetime from "spacetime";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { connectToDB } from "@/db";

export const timeFormat = "{hour-24-pad}:{minute-pad}:{second-pad}";

export interface HydrateStoreTypes {
  currentDay: string;
  currentTime: string;
  currentActiveDay: string;
  setCurrentDay: (currentDay: string) => void;
  setCurrentTime: (currentTime: string) => void;
  setCurrentActiveDay: (currentActiveDay: string) => void;
  _hydrated: boolean;
}

export const useHydrateStore = create<HydrateStoreTypes>((set) => ({
  currentDay: "",
  currentTime: "",
  currentActiveDay: "",
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
  let d = spacetime(null, tauriTimezone.value);
  useHydrateStore.setState({ currentTime: d.format(timeFormat) });
  useHydrateStore.setState({
    currentDay: d.format("{date-pad}-{month-pad}-{year}-{timezone}"),
  });

  useHydrateStore.setState({
    currentActiveDay: d.format("{date-pad}-{month-pad}-{year}-{timezone}"),
  });

  const currentDay = useHydrateStore.getState().currentActiveDay;

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
