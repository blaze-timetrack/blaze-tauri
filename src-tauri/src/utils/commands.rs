use crate::DB;
use chrono::{Local, Utc};
use serde::Serialize;

#[derive(Serialize)]
struct Times {
    one: String,
    two: String,
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn get_systems_timezone() -> String {
    let current_time = Local::now().to_owned().format("%H:%M:%S").to_string();
    let full_time = Utc::now().to_string();

    format!("{}", current_time)
}
// -> Result<Value, String>
#[tauri::command]
pub async fn get_programs() {
    let res = DB.query("SELECT *, ->category AS category FROM program;").await.map_err(|e| e.to_string());
    let res2 = DB.query("SELECT * FROM program;").await.map_err(|e| e.to_string());
    let json = res.iter().take(0);
    // println!("{:#?}", res);
    println!("{:#?}", json.take(0));
    // Ok(json)
}
