// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod track;
mod utils;
use std::env;

fn main() {
    unsafe {
        env::set_var("RUST_BACKTRACE", "1");
    }

    let _ = blaze_lib::run();
}
