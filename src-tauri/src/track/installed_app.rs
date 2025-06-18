use serde::{Deserialize, Serialize};
use std::process::Command;
use winreg::enums::HKEY_LOCAL_MACHINE;
use winreg::RegKey;


#[derive(Serialize, Deserialize, Debug)]
pub struct InstalledApp {
    pub name: String,
    pub version: Option<String>,
    pub publisher: Option<String>,
    pub install_date: Option<String>,
    pub install_path: Option<String>,
}

#[tauri::command]
pub fn get_installed_applications() -> Result<Vec<InstalledApp>, String> {
    let mut apps = Vec::new();
    // Query both native and WOW64 registry paths
    let registry_paths = vec![
        r"SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
    ];

    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);

    for path in registry_paths {
        if let Ok(uninstall_key) = hklm.open_subkey(path) {
            for key_name in uninstall_key.enum_keys() {
                if let Ok(key_name) = key_name {
                    if let Ok(app_key) = uninstall_key.open_subkey(&key_name) {
                        if let Ok(display_name) = app_key.get_value::<String, _>("DisplayName") {
                            let app = InstalledApp {
                                name: display_name,
                                version: app_key.get_value("DisplayVersion").ok(),
                                publisher: app_key.get_value("Publisher").ok(),
                                install_date: app_key.get_value("InstallDate").ok(),
                                install_path: app_key.get_value("InstallLocation").ok(),
                            };
                            apps.push(app);
                        }
                    }
                }
            }
        }
    }

    Ok(apps)
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PowerShellApp {
    pub name: String,
    pub version: String,
    pub publisher: String,
}

#[tauri::command]
pub fn get_apps_via_powershell() -> Result<Vec<PowerShellApp>, String> {
    let powershell_script = r#"
        Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* |
        Where-Object { $_.DisplayName -ne $null } |
        Select-Object DisplayName, DisplayVersion, Publisher |
        ConvertTo-Json
    "#;

    let output = Command::new("powershell")
        .args(&["-Command", powershell_script])
        .output()
        .map_err(|e| format!("Failed to execute PowerShell: {}", e))?;

    if output.status.success() {
        let json_output = String::from_utf8_lossy(&output.stdout);
        println!("json output {}", json_output);
        let apps: Vec<PowerShellApp> = serde_json::from_str(&json_output)
            .map_err(|e| format!("Failed to parse JSON: {}", e))?;
        Ok(apps)
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("PowerShell command failed: {}", error))
    }
}
