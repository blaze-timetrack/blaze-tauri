// -- Sub-Modules
mod models;
mod utils;

use std::sync::LazyLock;
use std::{env, result};
use surrealdb::engine::remote::ws::{Client, Wss};
use surrealdb::opt::auth::Root;
use surrealdb::{Response, Surreal};
use tauri::{
    menu::{Menu, MenuItem},
    utils::TitleBarStyle,
    AppHandle,
};
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};
use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, ShortcutState};
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_window_state::{AppHandleExt, StateFlags};
use utils::commands::{get_programs, get_systems_timezone, greet};

static DB: LazyLock<Surreal<Client>> = LazyLock::new(Surreal::init);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
    DB.connect::<Wss>("blaze--time-tra-06bdubvl4pv4t6a2oniuik9d04.aws-euw1.surreal.cloud")
        .await?;
    DB.signin(Root {
        username: "test",
        password: "test",
    })
        .await?;
    DB.use_ns("test").use_db("test").await?;
    println!("Connected to DB...");

    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
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
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();
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

            #[cfg(desktop)]
            {
                app.handle().save_window_state(StateFlags::all())?;
                utils::autostart::set_auto_start(app.handle())?;
                utils::global_shortcut::set_global_shortcut(app.handle()).unwrap();
                utils::tray::create_tray(app.handle()).unwrap();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, get_systems_timezone, get_programs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
