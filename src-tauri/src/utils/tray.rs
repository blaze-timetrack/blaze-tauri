use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::{
    menu::MenuItem,
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let quit_i = MenuItem::with_id(app, "quit", "Quit BLAZE", true, None::<&str>)?;

    let show_i = MenuItemBuilder::new("Show Dashboard")
        .id("show")
        .build(app)?;
    let tracking_state = MenuItemBuilder::new("Start Tracking")
        .id("start_tracking")
        .build(app)?;

    let widget_state = MenuItemBuilder::new("Show on desktop")
        .id("show_widget")
        .build(app)?;
    let submenu_widget = SubmenuBuilder::new(app, "Widget")
        .item(&widget_state)
        .build()?;

    let submenu_theme = SubmenuBuilder::new(app, "Display Theme")
        .text("system", "System")
        .text("light", "Light")
        .text("dark", "Dark")
        .build()?;

    let menu = MenuBuilder::new(app)
        .item(&show_i)
        .separator()
        .item(&tracking_state)
        .separator()
        .items(&[&submenu_widget, &submenu_theme])
        .separator()
        .item(&quit_i)
        .build()?;

    let _ = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| {
            let main_window = app.get_webview_window("main").unwrap();
            match event.id.as_ref() {
                "show" => {
                    println!("show menu item was clicked");
                    main_window.show().unwrap();
                    main_window.set_focus().unwrap();
                }

                "quit" => {
                    println!("quit menu item was clicked");
                    app.exit(0);
                }
                _ => {
                    println!("menu item {:?} not handled", event.id);
                }
            }
        })
        .show_menu_on_left_click(false)
        .tooltip("Blaze")
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } => {
                println!("left click pressed and released");
                // in this example, let's show and focus the main window when the tray is clicked
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.unminimize();
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            TrayIconEvent::Click {
                button: MouseButton::Right,
                button_state: MouseButtonState::Down,
                ..
            } => {
                println!("right click pressed and released");
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show_menu();
                }
            }
            _ => {}
        })
        .build(app)?;

    println!("tray build");

    Ok(())
}
