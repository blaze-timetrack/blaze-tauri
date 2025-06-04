use tauri::{Manager, Runtime};

pub fn create_stronghold<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    // .plugin(tauri_plugin_stronghold::Builder::new(|pass| todo!()).build());
    let salt_path = app
        .path()
        .app_local_data_dir()
        .expect("could not resolve app local data path")
        .join("salt.txt");
    app.plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;
    Ok(())
}
