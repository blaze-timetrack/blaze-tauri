import { create } from "zustand/react";

export interface BasicStore {
  settingTab: string;
  stateTrackingTimer: number;
  stateFlowTimer: number;
  stateBreakTimer: number;
  stateFlowValue: StateFlowValueTypes | null;
  setSettingTab: (settingTab: string) => void;
  setStateFlowValue: (stateFlowValue: StateFlowValueTypes) => void;
  setStateTrackingTimer: (stateTrackingTimer: number) => void;
  setStateFlowTimer: (stateFlowTimer: number) => void;
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
}));
