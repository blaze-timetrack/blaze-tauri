import { useSettingStore } from "@/lib/zustand/store.ts";

export interface StoreLoadedProps {
  children: React.ReactNode;
}

export const SettingsStoreLoaded = (props: StoreLoadedProps) => {
  const hydrated = useSettingStore((state) => state._hydrated);

  if (!hydrated) {
    return null;
  }

  return <>{props.children}</>;
};

export default SettingsStoreLoaded;
