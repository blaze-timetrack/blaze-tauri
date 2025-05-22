// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

fn main() {
    const RUST_BACKTRACE: &str = "1";
    unsafe {env::set_var(RUST_BACKTRACE, "1"); }
    
    blaze_lib::run();
}
