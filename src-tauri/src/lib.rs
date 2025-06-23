// -- Sub-Modules
mod track;
mod utils;
mod classifier;

use crate::track::afk::away_from_keyboard;
use crate::track::heartbeat::start_heartbeat;
use crate::utils::db::{close_connection_db, connect_to_db, setup_schema};
use classifier::classify_text;
use classifier::Classifier;
use serde_json::json;
use std::borrow::Cow;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::Duration;
use std::{env, result};
use tauri::ipc::private::tracing::log;
use tauri::{menu::{Menu, MenuItem}, utils::TitleBarStyle, AppHandle, Emitter, LogicalPosition, PhysicalSize, Runtime};
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};
use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, ShortcutState};
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_sql::Migration;
use tauri_plugin_sql::MigrationKind;
use tauri_plugin_window_state::{AppHandleExt, StateFlags};
use track::installed_app::{get_apps_via_powershell, get_installed_applications};
use utils::commands::{get_systems_timezone, greet};
use webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2Settings6;
use windows::core::Interface;


// #[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> Result<(), Box<dyn std::error::Error>> {
    let classifier = Classifier::new().expect("Failed to load model");

    let mut builder = tauri::Builder::default().manage(Mutex::new(classifier));

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

    // update not setup
    // .plugin(tauri_plugin_updater::Builder::new().build())

    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT);",
            kind: MigrationKind::Up,
        },
    ];

    builder
        .plugin(tauri_plugin_notification::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:test.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();
            // @todo add only to desktop
            let widget_window = app.get_webview_window("widget").unwrap();

            let size = PhysicalSize::new(420.0 as u32, 38.0 as u32);
            widget_window.set_size(size).unwrap();
            widget_window.with_webview(|webview| unsafe {
                let settings = webview.controller().CoreWebView2().unwrap().Settings().unwrap();
                let settings: ICoreWebView2Settings6 = settings.cast::<ICoreWebView2Settings6>().unwrap();
                settings.SetIsSwipeNavigationEnabled(false).unwrap();
                settings.SetAreDefaultContextMenusEnabled(false).unwrap();
                settings.SetIsBuiltInErrorPageEnabled(false).unwrap();
                settings.SetAreDefaultScriptDialogsEnabled(false).unwrap();
                // settings.SetAreBrowserAcceleratorKeysEnabled(false).unwrap();
            }).unwrap();

            if let Some(monitor) = widget_window.primary_monitor().unwrap() {
                let monitor_size = monitor.size();
                let monitor_width = monitor_size.width as f64;

                let window_size = widget_window.outer_size().unwrap();
                let window_width = window_size.width as f64;

                let x = monitor_width - window_width;
                let y = 40.0;

                let widget_position = LogicalPosition::new(x, y);
                widget_window
                    .set_position(widget_position)
                    .expect("failed to set position");
            }

            // style
            main_window.set_decorations(false)?;
            main_window.set_title_bar_style(TitleBarStyle::Transparent)?;
            main_window.eval(r#"
            document.addEventListener('contextmenu', event => event.preventDefault());
                        "#).unwrap();
            main_window.with_webview(|webview| unsafe {
                let settings = webview.controller().CoreWebView2().unwrap().Settings().unwrap();
                let settings: ICoreWebView2Settings6 = settings.cast::<ICoreWebView2Settings6>().unwrap();
                settings.SetIsBuiltInErrorPageEnabled(false).unwrap();
                settings.SetAreDefaultScriptDialogsEnabled(false).unwrap();
                // settings.SetAreBrowserAcceleratorKeysEnabled(false).unwrap();
            }).unwrap();

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
            // store secrets and keys
            utils::stronghold::create_stronghold(app.handle())?;
            #[cfg(desktop)]
            {
                app.handle().save_window_state(StateFlags::all())?;
                utils::autostart::set_auto_start(app.handle())?;
                utils::global_shortcut::set_global_shortcut(app.handle()).unwrap();
                utils::tray::create_tray(app.handle()).unwrap();

                let app_data_dir = app.handle().path().app_data_dir().unwrap();
                tauri::async_runtime::spawn(background_track(app_data_dir, app.handle().clone()));
            }


            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, get_systems_timezone, get_installed_applications, get_apps_via_powershell, classify_text])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

async fn background_track<R: Runtime>(app_data_dir: PathBuf, app_handle: tauri::AppHandle<R>) {
    match connect_to_db(app_data_dir).await {
        Ok(db) => {
            if let Err(e) = setup_schema(&db).await {
                eprintln!("Failed to setup schema: {}", e);
                return;
            }
            loop {
                println!("tracker running in background");
                tokio::time::sleep(Duration::from_micros(80)).await;

                match start_heartbeat().await {
                    Ok(data) => {
                        let payload = json!(data);
                        let _ = app_handle.emit("program_changed", payload);
                    }
                    Err(e) => eprintln!("Heartbeat error: {}", e),
                }
            }
            let _ = close_connection_db(&db).await;
        }
        Err(e) => eprintln!("Database connection error: {}", e),
    }
}
