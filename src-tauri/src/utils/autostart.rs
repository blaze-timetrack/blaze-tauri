use tauri::Runtime;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_autostart::ManagerExt;

pub fn set_auto_start<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    app.plugin(tauri_plugin_autostart::init(
        MacosLauncher::AppleScript,
        Some(vec!["--flag1", "--flag2"]),
    ))?;

    // Get the autostart manager
    let autostart_manager = app.autolaunch();
    // Enable autostart
    let _ = autostart_manager.enable();

    Ok(())
}
