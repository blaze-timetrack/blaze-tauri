import "@/app.css";
import { Menu as MenuIcon, PowerCircle } from "lucide-react";
import { getCurrentWindow, LogicalPosition } from "@tauri-apps/api/window";
import { useCallback, useEffect } from "react";
import {
  Menu,
  MenuItem,
  PredefinedMenuItem,
  Submenu,
} from "@tauri-apps/api/menu";

function Widget() {
  useEffect(() => {
    // does not work for swaping the shortcut it is set globally
    // register("Ctrl+Shift+S", () => {
    //   console.log("Ctrl+Shift+S pressed");
    //   // Your custom logic here
    //   // If you want to prevent the default action, the API may not always allow it, but you can react to it
    // });
    const handleKeyDown = (event: KeyboardEvent) => {
      // Example: Override Ctrl+Shift+S (not system-wide)
      console.log("triggered");
      if (event.ctrlKey && event.shiftKey && event.key === "s") {
        event.preventDefault();
        console.log("nothing happened!!!");
        // Your custom screenshot logic here
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const appWindow = getCurrentWindow();
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
        await MenuItem.new({
          id: "startup_launch",
          text: "Launch on Startup",
          action: () => {
            console.log("Open launch at startup clicked");
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
          action: () => appWindow.hide(),
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
        await MenuItem.new({
          id: "show_widget",
          text: "Show On Desktop",
          accelerator: "Ctrl+Shift+W",
          action: () => {
            console.log("Redo clicked");
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
      className={
        "bg-background text-foreground h-screen bg-black text-white select-none"
      }
    >
      <div className={"mr-2 ml-4 flex h-full items-center justify-between"}>
        <p className={"flex items-center gap-2"}>
          <PowerCircle className={"h-5 w-5"} />
          <span className={"text-muted-foreground"}> Locked</span>
        </p>
        <p className={"text-blue-300"}>
          0%
          <span className={"text-muted-foreground"}> flow state</span>
        </p>
        <p className={"text-purple-300"}>
          2hr 30min
          <span className={"text-muted-foreground"}> worked</span>
        </p>
        <button
          onClick={handleMenuClick}
          className={
            "hover:bg-background/20 flex h-full cursor-pointer items-center justify-center px-2 transition-colors"
          }
        >
          <MenuIcon className={"h-4 w-4"} />
        </button>
      </div>
    </div>
  );
}

export default Widget;

const NOTIFICATION_WINDOW_LABEL = "widget";

// export function create_widget_window() {
//   console.log("created widget");
//   new WebviewWindow(NOTIFICATION_WINDOW_LABEL, {
//     width: 350,
//     height: 80,
//     x: 1600, // adjust for your screen
//     y: 900, // adjust for your screen
//     decorations: false,
//     transparent: true,
//     alwaysOnTop: true,
//     resizable: false,
//     skipTaskbar: true,
//     visible: true,
//     url: "/widget", // a custom HTML file for the notification UI
//   });
// }
