import { RefObject, useEffect } from "react";

export enum Keys {
  ENTER = "Enter",
  ESCAPE = "Escape",
  G = "g",
  H = "h",
  C = "c",
  P = "p",
  I = "i",
  FORWARD_SLASH = "/",
  QUESTION = "?",
  COMMA = ",",
  CTRL_P = "ctrl+p",
}

function useSetShortcuts<T extends HTMLElement>(
  ref: RefObject<T>,
  handler?: (event: MouseEvent | TouchEvent) => void,
  keyHandler?: (event: Keys) => void,
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!ref || !ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      if (!handler) return;
      handler(event);
    };
    const handleShortcuts = (event: KeyboardEvent) => {
      if (!keyHandler) return;
      if (event.key === "Escape") {
        keyHandler(Keys.ESCAPE);
      } else if (event.key === "g") {
        keyHandler(Keys.G);
      } else if (event.key === "h") {
        keyHandler(Keys.H);
      } else if (event.key === "c") {
        keyHandler(Keys.C);
      } else if (event.key === "p") {
        keyHandler(Keys.P);
      } else if (event.key === "i") {
        keyHandler(Keys.I);
      } else if (event.key === "/") {
        keyHandler(Keys.FORWARD_SLASH);
      } else if (event.key === "?") {
        keyHandler(Keys.QUESTION);
      } else if (event.key === ",") {
        keyHandler(Keys.COMMA);
      } else if (event.ctrlKey + event.key === "p") {
      } else if (event.ctrlKey + event.key === "f") {
      } else if (event.ctrlKey + event.key === "f" + event.shiftKey) {
      } else if (event.ctrlKey + event.key === "b") {
      } else if (event.ctrlKey + event.key === "b" + event.shiftKey) {
      } else if (event.ctrlKey + event.key === "m") {
      } else if (event.ctrlKey + event.key === "m" + event.shiftKey) {
      }
    };

    document.addEventListener("keydown", handleShortcuts);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.addEventListener("keydown", handleShortcuts);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, handler]);
}

export default useSetShortcuts;
