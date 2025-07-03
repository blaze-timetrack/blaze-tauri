import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { emit } from "@tauri-apps/api/event";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const reloadWidget = async () => {
  await emit("reload", { windowLabel: "widget" });
};

const getTimePosition = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 6;
};

export const getPositionInDash = (currentTime: string) => {
  const startPosition = getTimePosition(currentTime);

  // Each hour is timeScale pixels tall
  const top = startPosition * parseInt(currentTime);

  console.log(top);

  return {
    top,
  };
};
