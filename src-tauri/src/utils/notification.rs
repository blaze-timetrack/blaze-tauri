use tauri::{Manager, Runtime, WebviewWindowBuilder};

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
pub fn create_notification_window<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let label = "custom_notification";
    // Avoid duplicate notification windows
    if app.get_webview_window(label).is_none() {
        let _ = WebviewWindowBuilder::new(
            app,
            label,
            tauri::WebviewUrl::App("./notification.html".into()),
        )
            .title("Notification")
            .decorations(false)
            .always_on_top(true)
            .resizable(false)
            .skip_taskbar(true)
            .inner_size(350.0, 80.0)
            .position(1600.0, 900.0) // adjust for your screen
            .build();
    }

    Ok(())
}
