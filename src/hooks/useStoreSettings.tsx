import { useEffect, useState } from "react";
import { LazyStore, load } from "@tauri-apps/plugin-store";
import { ZodSchema } from "zod";

export function useStoreSettings<G extends string, T>(
  key: G,
  defaultValue: T,
  schema: ZodSchema<T>,
): [T, (newValue: T) => void, () => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const [store, setStore] = useState<LazyStore | null>(null);

  useEffect(() => {
    async function initStore() {
      try {
        const s = await load(".settings.json");
        setStore(s);
        const val = (await s.get(key)) as unknown;
        const result = schema.safeParse(val ?? defaultValue);
        if (!result.success) {
          console.error("Validation error:", result.error);
          await s.set(key, defaultValue);
          await s.save();
          setValue(defaultValue);
          return;
        }
        setValue(result.data);
      } catch (error) {
        console.error("Store initialization error:", error);
        setValue(defaultValue);
      }
    }

    initStore();
  }, [key, defaultValue, schema]);

  const set = async (newValue: T) => {
    if (!store) return;

    const result = schema.safeParse(newValue);
    if (!result.success) {
      console.error("Validation error:", result.error);
      return;
    }

    try {
      await store.set(key, result.data);
      await store.save();
      setValue(result.data);
    } catch (error) {
      console.error("Store update error:", error);
    }
  };

  const reset = async () => {
    if (!store) return;

    const result = schema.safeParse(defaultValue);
    if (!result.success) {
      console.error("Validation error:", result.error);
      return;
    }
    try {
      await store.delete(key);
      await store.set(key, defaultValue);
      await store.save();
      setValue(defaultValue);
    } catch (error) {
      console.error("Store reset error:", error);
    }
  };

  return [value, set, reset];
}
