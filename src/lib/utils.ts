import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { emit } from "@tauri-apps/api/event";
import { useEffect } from "react";
import spacetime from "spacetime";
import { invoke } from "@tauri-apps/api/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const reloadWidget = async () => {
  await emit("reload", { windowLabel: "widget" });
};

export async function quitApp() {
  await invoke("quit_app");
}

export const reloadMain = async () => {
  await emit("reload", { windowLabel: "main" });
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

export const useDebounce = (fn: () => void, delay: number) => {
  useEffect(() => {
    // Set a timeout to update the debounced value after the delay.
    const handler = setTimeout(() => {
      fn();
    }, delay);

    // Clean up the timeout if the value or delay changes before the timer completes.
    // This ensures that the value is only updated once the user has paused their input for the desired delay.
    return () => {
      clearTimeout(handler); //
    };
  }, [fn, delay]); // Re-run effect if value or delay changes.
};

export const timeD = (date: string | null, timezone: string | null) => {
  return spacetime(date, timezone);
};
