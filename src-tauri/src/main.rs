// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod track;
mod utils;
use std::env;
use std::fs::OpenOptions;
use std::io::Write;
use tauri::{Env, Manager};

fn main() {
    unsafe {
        env::set_var("RUST_BACKTRACE", "1");
    }

    std::panic::set_hook(Box::new(|panic_info| {
        // Create comprehensive error message
        let panic_msg = format!("{:?}", panic_info);
        let location = panic_info
            .location()
            .map(|loc| format!("{}:{}:{}", loc.file(), loc.line(), loc.column()))
            .unwrap_or_else(|| "unknown location".to_string());

        let error_report = format!(
            "PANIC at {}: {}\nTimestamp: {}\n\n",
            location,
            panic_msg,
            chrono::Utc::now().format("%Y-%m-%d %H:%M:%S UTC")
        );

        // Log to file for debugging
        if let Ok(mut file) = OpenOptions::new()
            .create(true)
            .append(true)
            .open("crash_log.txt")
        {
            let _ = file.write_all(error_report.as_bytes());
        }

        // Print to stderr for immediate debugging
        eprintln!("{}", error_report);

        // Restart the application
        let env = Env::default();
        tauri::process::restart(&env);

        // Fallback exit
        std::process::exit(1);
    }));


    let _ = blaze_lib::run();
}
