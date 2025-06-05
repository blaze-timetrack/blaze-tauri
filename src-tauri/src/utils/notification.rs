use tauri::{Manager, Runtime, WebviewWindowBuilder};
use tauri::ipc::RuntimeCapability;

pub fn show_notification<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    use tauri_plugin_notification::NotificationExt;
    app.notification()
        .builder()
        .title("Tauri")
        .body("Tauri is awesome")
        .show()
        .unwrap();

    Ok(())
}

fn create_widget() {}
pub fn create_widget_window<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let label = "widget";
    // Avoid duplicate notification windows
    if app.get_webview_window(label).is_none() {
        let _ = WebviewWindowBuilder::new(
            app,
            label,
            tauri::WebviewUrl::App("/widget".into()),
        ).decorations(false).title("Notification").always_on_top(true).resizable(false).skip_taskbar(true).inner_size(800.0, 200.0).position(0.0, 40.0).build();
    }

    Ok(())
}
