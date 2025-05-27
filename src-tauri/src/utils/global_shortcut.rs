use tauri::ipc::private::tracing::event;
use tauri::{Manager, Runtime};
use tauri_plugin_global_shortcut::{Code, GlobalShortcut, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};


pub fn set_global_shortcut<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let ctrl_n_shortcut = Shortcut::new(Some(Modifiers::SUPER | Modifiers::SHIFT), Code::KeyN);
    
    app.plugin(
        tauri_plugin_global_shortcut::Builder::new().with_handler(move |app, shortcut, event| {
            println!("{:?}", shortcut);
            let main_window = app.get_webview_window("main").unwrap();
            if shortcut == &ctrl_n_shortcut {
                match event.state() {
                    ShortcutState::Pressed => {
                        main_window.show().unwrap();
                        println!("Ctrl-N Pressed!");
                    }
                    ShortcutState::Released => {
                        main_window.close().unwrap();
                        println!("Ctrl-N Released!");
                    }
                }
            }
        }).build(),
    )?;
    let global_key = app.global_shortcut().register(ctrl_n_shortcut);
    println!("Global shortcut registered {:#?}", global_key);

    Ok(())
}
