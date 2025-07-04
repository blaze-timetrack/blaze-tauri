import { useHydrateStore } from "@/lib/zustand/hydrate-store.ts";
import React from "react";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";

export interface StoreLoadedProps {
  children: React.ReactNode;
}

export const HydrateStoreLoad = (props: StoreLoadedProps) => {
  const hydrated = useHydrateStore((state) => state._hydrated);
  const hydratedSetting = useSettingStore((state) => state._hydrated);
  if (!hydrated && !hydratedSetting) {
    return null;
  }

  return <>{props.children}</>;
};

export default HydrateStoreLoad;
