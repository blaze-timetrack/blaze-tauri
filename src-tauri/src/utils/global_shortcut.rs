use tauri::{Manager, Runtime};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

pub fn set_global_shortcut<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let ctrl_n_shortcut = Shortcut::new(Some(Modifiers::ALT | Modifiers::SHIFT), Code::KeyK);

    app.plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |app, shortcut, event| {
                println!("{:?}", shortcut);
                let main_window = app.get_webview_window("main").unwrap();
                println!("Global shortcut check {:#?}", shortcut);
                println!("Global shortcut check {:#?}", ctrl_n_shortcut);

                if shortcut == &ctrl_n_shortcut {
                    match event.state() {
                        ShortcutState::Pressed => {
                            main_window.show().unwrap();
                            main_window.set_focus().unwrap();
                            println!("Ctrl-N Pressed!");
                        }
                        ShortcutState::Released => {
                            // main_window.close().unwrap();
                            println!("Ctrl-N Released!");
                        }
                    }
                }
            })
            .build(),
    )?;
    let global_key = app.global_shortcut().register(ctrl_n_shortcut);
    println!("Global shortcut registered {:#?}", global_key);
    println!(
        "Global shortcut registered {:#?}",
        app.global_shortcut().is_registered(ctrl_n_shortcut)
    );

    Ok(())
}
