use chrono::{Date, DateTime, Local, Utc};
use chrono_tz::UCT;
use serde::Serialize;
use tauri::ipc::private::tracing::instrument::WithSubscriber;
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

#[derive(Serialize)]
struct Times {
    one: String,
    two: String,
}

#[tauri::command]
fn get_systems_timezone() -> String {
    let current_time = Local::now().to_owned().format("%H:%M:%S").to_string();
    let full_time = Utc::now().to_string();

    format!("{}", current_time)
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(debug_assertions)]
    let devtools = tauri_plugin_devtools::init();

    let _app = tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(devtools)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_systems_timezone])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
