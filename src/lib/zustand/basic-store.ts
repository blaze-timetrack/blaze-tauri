import { create } from "zustand/react";

export interface BasicStore {
  settingTab: string;
  stateTrackingTimer: number;
  stateFlowTimer: number;
  stateBreakTimer: number;
  stateFlowValue: StateFlowValueTypes | null;
  commandOpen: boolean;
  setSettingTab: (settingTab: string) => void;
  setStateFlowValue: (stateFlowValue: StateFlowValueTypes) => void;
  setStateTrackingTimer: (stateTrackingTimer: number) => void;
  setStateFlowTimer: (stateFlowTimer: number) => void;
  setCommandOpen: (commandOpen: boolean) => void;
}

interface StateFlowValueTypes {
  start: string;
  end: string | null;
  duration: number;
  break:
    | {
        start: string;
        end: string | null;
        duration: number;
      }[]
    | null;
}

export const useBasicStore = create<BasicStore>((set) => ({
  settingTab: "account",
  stateFlowValue: null,
  stateTrackingTimer: 0,
  stateFlowTimer: 0,
  stateBreakTimer: 0,
  commandOpen: false,
  setSettingTab: (settingTab) => {
    set({ settingTab });
  },
  setStateFlowValue: (stateFlowValue) => {
    set({ stateFlowValue });
  },
  setStateTrackingTimer: (stateTrackingTimer) => {
    set({ stateTrackingTimer });
  },
  setStateFlowTimer: (stateFlowTimer) => {
    set({ stateFlowTimer });
  },
  setCommandOpen: (commandOpen: boolean) => {
    set({ commandOpen });
  },
}));
