import { getCurrentWindow, LogicalPosition } from "@tauri-apps/api/window";
import { Menu as MenuIcon } from "lucide-react";
import {
  CheckMenuItem,
  Menu,
  MenuItem,
  PredefinedMenuItem,
  Submenu,
} from "@tauri-apps/api/menu";
import { useCallback } from "react";
import { disable, enable } from "@tauri-apps/plugin-autostart";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
import { emit } from "@tauri-apps/api/event";
import { quitApp } from "@/lib/utils.ts";

function TitleBar() {
  const appWindow = getCurrentWindow();
  const autostart = useSettingStore((state) => state.autostart);
  const setAutostart = useSettingStore((state) => state.setAutostart);

  const showWidget = useSettingStore((state) => state.showWidget);
  const setShowWidget = useSettingStore((state) => state.setShowWidget);

  const handleMenuClick = useCallback(async () => {
    const fileSubmenu = await Submenu.new({
      text: "File",
      items: [
        await MenuItem.new({
          id: "about-blaze",
          text: "About BLAZE",
          action: () => {
            console.log("about blaze clicked");
          },
        }),
        await CheckMenuItem.new({
          id: "startup_launch",
          text: "Launch on Startup",
          checked: autostart,
          action: async () => {
            console.log("Open launch at startup clicked");
            if (autostart) {
              await disable();
              await setAutostart(false);
              console.log("is disabled");
              return;
            }
            await enable();
            await setAutostart(true);
            console.log("is enabled");
          },
        }),
        await MenuItem.new({
          id: "check_update",
          text: "Check for Updates",

          action: () => {
            console.log("check for updates clicked");
          },
        }),
        await MenuItem.new({
          id: "signout",
          text: "Sign Out",
          action: () => {
            console.log("sign out clicked");
          },
        }),
        await MenuItem.new({
          id: "exit",
          text: "Exit",
          accelerator: "Ctrl+Q",
          action: () => quitApp(),
        }),
      ],
    });

    const editSubmenu = await Submenu.new({
      text: "Edit",
      items: [
        await PredefinedMenuItem.new({
          text: "Undo predefined",
          item: "Undo",
        }),
        await MenuItem.new({
          id: "redo",
          text: "Redo",
          accelerator: "Ctrl+Y",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "cut",
          text: "Cut",
          accelerator: "Ctrl+X",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "copy",
          text: "Copy",
          accelerator: "Ctrl+C",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "past",
          text: "Past",
          accelerator: "Ctrl+V",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "delete",
          text: "Delete",
          accelerator: "Del",
          action: () => {
            console.log("Redo clicked");
          },
        }),
      ],
    });

    const viewSubmenu = await Submenu.new({
      text: "View",
      items: [
        await MenuItem.new({
          id: "zoom_in",
          text: "Zoom In",
          accelerator: "Ctrl+Plus",
          action: () => {
            console.log("Undo clicked");
          },
        }),
        await MenuItem.new({
          id: "zoom_out",
          text: "Zoom Out",
          accelerator: "Ctrl+Minus",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "reset_zoom",
          text: "Reset Zoom",
          accelerator: "Ctrl+0",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "reload",
          text: "Reload",
          accelerator: "Ctrl+R",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "toggle_fullscreen",
          text: "Toggle Fullscreen",
          accelerator: "F11",
          action: () => {
            console.log("Redo clicked");
          },
        }),
      ],
    });

    const trackingSubmenu = await Submenu.new({
      text: "Tracking",
      items: [
        await MenuItem.new({
          id: "pause_tracking",
          text: "Pause Tracking",
          accelerator: "Ctrl+P",
          action: () => {
            console.log("Undo clicked");
          },
        }),
        await MenuItem.new({
          id: "start_flow",
          text: "Start Flow",
          accelerator: "Ctrl+Shift+F",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "start_meeting",
          text: "Start Meeting",
          accelerator: "Ctrl+Shift+M",
          action: () => {
            console.log("Redo clicked");
          },
        }),
        await MenuItem.new({
          id: "start_break",
          text: "Start Break",
          accelerator: "Ctrl+Shift+B",
          action: () => {
            console.log("Redo clicked");
          },
        }),
      ],
    });

    const widgetSubmenu = await Submenu.new({
      text: "Widget",
      items: [
        await CheckMenuItem.new({
          id: "show_widget",
          text: "Show On Desktop",
          accelerator: "Ctrl+Shift+W",
          checked: showWidget,
          action: () => {
            if (showWidget) {
              setShowWidget(false);
            } else {
              setShowWidget(true);
            }
            emit("showWidget", showWidget);
          },
        }),
      ],
    });

    const windowSubmenu = await Submenu.new({
      text: "Window",
      items: [
        await MenuItem.new({
          id: "minimize",
          text: "Minimize",
          accelerator: "Ctrl+M",
          action: () => appWindow.minimize(),
        }),
        await MenuItem.new({
          id: "maximize",
          text: "Maximize",
          accelerator: "Ctrl+Shift+M",
          action: () => appWindow.toggleMaximize(),
        }),
        await MenuItem.new({
          id: "close",
          text: "Close",
          accelerator: "Ctrl+W",
          action: () => appWindow.close(),
        }),
      ],
    });

    const helpSubmenu = await Submenu.new({
      text: "Help",
      items: [
        await MenuItem.new({
          id: "user_guide",
          text: "User Guide",
          accelerator: "Ctrl+U",
          action: () => {
            console.log("User guide clicked");
          },
        }),
        await MenuItem.new({
          id: "discord_server",
          text: "Discord Server",
          action: () => {
            console.log("Discord server clicked");
          },
        }),
        await MenuItem.new({
          id: "website",
          text: "Website",
          action: () => {
            console.log("Website clicked");
          },
        }),
      ],
    });

    const developerSubmenu = await Submenu.new({
      text: "Developer",
      items: [
        await MenuItem.new({
          id: "toggle_devtools",
          text: "Toggle DevTools",
          accelerator: "F12",
          action: () => {
            console.log("Toggle devtools clicked");
            // appWindow.webview.toggleDevTools();
          },
        }),
        await MenuItem.new({
          id: "inspect_element",
          text: "Inspect Element",
          accelerator: "Ctrl+Shift+I",
          action: () => {
            console.log("Inspect element clicked");
          },
        }),
        await MenuItem.new({
          id: "reload_app",
          text: "Reload App",
          accelerator: "Ctrl+Shift+R",
          action: () => {
            console.log("Reload app clicked");
          },
        }),
        await MenuItem.new({
          id: "clear_storage",
          text: "Clear Storage",
          action: () => {
            console.log("Clear storage clicked");
          },
        }),
        await MenuItem.new({
          id: "debug_mode",
          text: "Debug Mode",
          action: () => {
            console.log("Debug mode clicked");
          },
        }),
      ],
    });

    const menu = await Menu.new({
      items: [
        fileSubmenu,
        editSubmenu,
        viewSubmenu,
        trackingSubmenu,
        widgetSubmenu,
        developerSubmenu,
        windowSubmenu,
        helpSubmenu,
      ],
    });

    // Show the menu at the current mouse position
    const popupPosition = new LogicalPosition(0, 32);
    await menu.popup(popupPosition);
  }, [appWindow]);

  return (
    <div
      data-tauri-drag-region={true}
      className="bg-primary/10 border-border top-0 right-0 left-0 col-span-full row-span-1 flex justify-between border-b select-none"
    >
      <div className={"row-span-1"}>
        <button
          onClick={handleMenuClick}
          className={
            "hover:bg-primary/20 flex h-full items-center justify-center px-4 transition-colors"
          }
        >
          <MenuIcon className={"h-4 w-4"} />
        </button>
      </div>

      <div className={"flex items-center justify-center gap-2 px-4 py-2"}>
        <div
          onClick={() => appWindow.minimize()}
          className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-white transition-colors select-none hover:bg-white/80"
          id="titlebar-minimize"
        >
          {/*<img*/}
          {/*  src="https://api.iconify.design/mdi:window-minimize.svg"*/}
          {/*  alt="minimize"*/}
          {/*/>*/}
        </div>
        <div
          onClick={() => appWindow.toggleMaximize()}
          className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-yellow-300 transition-colors select-none hover:bg-yellow-300/50"
          id="titlebar-maximize"
        >
          {/*<img*/}
          {/*  src="https://api.iconify.design/mdi:window-maximize.svg"*/}
          {/*  alt="maximize"*/}
          {/*/>*/}
        </div>
        <div
          onClick={() => appWindow.close()}
          className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500/80 transition-colors select-none hover:bg-red-500/50"
          id="titlebar-close"
        >
          {/*<img src="https://api.iconify.design/mdi:close.svg" alt="close" />*/}
        </div>
      </div>
    </div>
  );
}

export default TitleBar;
