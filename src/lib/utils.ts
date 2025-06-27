import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { emit } from "@tauri-apps/api/event";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const reloadWidget = async () => {
  await emit("reload", { windowLabel: "widget" });
};
