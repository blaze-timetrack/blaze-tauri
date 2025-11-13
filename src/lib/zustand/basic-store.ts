import { create } from "zustand/react";

export interface BasicStore {
  settingTab: string;
  stateTrackingTimer: number;
  stateFlowTimer: number;
  stateBreakTimer: number;
  stateMeetingTimer: number;
  stateFlowValue: StateFlowValueTypes | null;
  commandOpen: boolean;
  eventBlockDetails: any; // add types
  eventBlockDetailsPosition: {
    x: number;
    y: number;
  };
  setSettingTab: (settingTab: string) => void;
  setStateFlowValue: (stateFlowValue: StateFlowValueTypes) => void;
  setStateTrackingTimer: (stateTrackingTimer: number) => void;
  setStateFlowTimer: (stateFlowTimer: number) => void;
  setStateBreakTimer: (stateBreakTimer: number) => void;
  setStateMeetingTimer: (stateMeetingTimer: number) => void;
  setCommandOpen: (commandOpen: boolean) => void;
  setEventBlockDetails: (blockDetails: any) => void;
  setEventBlockDetailsPosition: (eventBlockDetailsPosition: {
    x: number;
    y: number;
  }) => void;
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
  stateMeetingTimer: 0,
  commandOpen: false,
  eventBlockDetails: null,
  eventBlockDetailsPosition: {
    x: 0,
    y: 0,
  },
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
  setStateBreakTimer: (stateBreakTimer) => {
    set({ stateBreakTimer });
  },
  setStateMeetingTimer: (stateMeetingTimer) => {
    set({ stateMeetingTimer });
  },
  setCommandOpen: (commandOpen: boolean) => {
    set({ commandOpen });
  },
  setEventBlockDetails: (eventBlockDetails) => {
    set({ eventBlockDetails });
  },
  setEventBlockDetailsPosition: (eventBlockDetailsPosition) => {
    set({ eventBlockDetailsPosition });
  },
}));
