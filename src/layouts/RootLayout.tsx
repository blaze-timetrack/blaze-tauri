import { Button } from "@/components/ui/button";
import {saveWindowState, StateFlags} from "@tauri-apps/plugin-window-state"

function RootLayout() {

  saveWindowState(StateFlags.ALL);
  
  return (
    <header>
      <nav className="">
        <Button variant={""}>
          Go To Btn
        </Button>
      </nav>
    </header>
  );
}

export default RootLayout;
