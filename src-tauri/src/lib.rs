// -- Sub-Modules
mod utils;

use std::{env, result};
use tauri::{menu::{Menu, MenuItem}, utils::TitleBarStyle, AppHandle, LogicalPosition, PhysicalSize};
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};
use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, ShortcutState};
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_window_state::{AppHandleExt, StateFlags};
use utils::commands::{get_systems_timezone, greet};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let main_window = app.get_webview_window("main").expect("no main window");

            main_window.show().unwrap();
            main_window.set_focus().unwrap();
            main_window.unminimize().unwrap();
        }));
    }

    #[cfg(debug_assertions)]
    {
        let devtools = tauri_plugin_devtools::init();
        builder = builder.plugin(devtools)
    }

    // menu not working because of set_decorations = false in webview
    // {
    //     builder = builder.menu(|handle| Menu::default(handle))
    // }

    builder
        .plugin(tauri_plugin_notification::init())
        // update not setup
        // .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();
            let widget_window = app.get_webview_window("widget").unwrap();

            let size = PhysicalSize::new(420.0 as u32, 38.0 as u32);
            widget_window.set_size(size).unwrap();

            if let Some(monitor) = widget_window.primary_monitor().unwrap() {
                let monitor_size = monitor.size();
                let monitor_width = monitor_size.width as f64;

                let window_size = widget_window.outer_size().unwrap();
                let window_width = window_size.width as f64;

                let x = monitor_width - window_width;
                let y = 0.0;

                let widget_position = LogicalPosition::new(x, y);
                widget_window.set_position(widget_position).expect("failed to set position");
            }

            // style
            main_window.set_decorations(false)?;
            main_window.set_title_bar_style(TitleBarStyle::Transparent)?;

            // set background color only when building for macOS
            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::{NSColor, NSWindow};
                use cocoa::base::{id, nil};

                let ns_window = window.ns_window().unwrap() as id;
                unsafe {
                    let bg_color = NSColor::colorWithRed_green_blue_alpha_(
                        nil,
                        50.0 / 255.0,
                        158.0 / 255.0,
                        163.5 / 255.0,
                        1.0,
                    );
                    ns_window.setBackgroundColor_(bg_color);
                }
            }

            // hide when close request for linux and windows as macOS already to itself
            #[cfg(any(target_os = "linux", target_os = "windows"))]
            {
                main_window.clone().on_window_event(move |event| {
                    if let WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = main_window.hide();
                    }
                });
            }

            // utils::notification::show_notification(app.handle())?;
            // small settings
            // utils::store::create_store(app.handle())?;
            // store secrets and keys
            utils::stronghold::create_stronghold(app.handle())?;
            #[cfg(desktop)]
            {
                // utils::notification::create_widget_window(app.handle())?;
                app.handle().save_window_state(StateFlags::all())?;
                utils::autostart::set_auto_start(app.handle())?;
                utils::global_shortcut::set_global_shortcut(app.handle()).unwrap();
                utils::tray::create_tray(app.handle()).unwrap();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, get_systems_timezone])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
