use tauri::{Manager, Runtime};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

pub fn set_global_shortcut<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let super_shift_e = Shortcut::new(Some(Modifiers::SUPER | Modifiers::SHIFT), Code::KeyE);

    app.plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |app, shortcut, event| {
                let main_window = app.get_webview_window("main").unwrap();
                if shortcut == &super_shift_e {
                    match event.state() {
                        ShortcutState::Pressed => {
                            if (main_window.is_focused().unwrap()) {
                                main_window.close().unwrap();
                            } else {
                                main_window.show().unwrap();
                                main_window.set_focus().unwrap();
                            }
                        }
                        ShortcutState::Released => {
                            // main_window.close().unwrap();

                        }
                    }
                }
            })
            .build(),
    )?;
    let _ = app.global_shortcut().register(super_shift_e);

    Ok(())
}
