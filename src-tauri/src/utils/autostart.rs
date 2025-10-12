use tauri::Runtime;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_autostart::ManagerExt;
use tauri_plugin_store::StoreExt;

pub fn set_auto_start<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    app.plugin(tauri_plugin_autostart::init(
        MacosLauncher::AppleScript,
        Some(vec!["--flag1", "--flag2"]),
    ))?;

    // Get the autostart manager
    let autostart_manager = app.autolaunch();

    let store = &app
        .store(".settings.dat")
        .expect("Failed to load store.");
    let autostart_state = store
        .get("autostart").unwrap_or(serde_json::Value::Bool(true));
        // Enable autostart
    if (autostart_state.as_bool().unwrap()) {
     let _ = autostart_manager.enable();
    }else { 
        let _ = autostart_manager.disable();
    }

    println!("is _auto_start {}", autostart_manager.is_enabled().unwrap());


    Ok(())
}
