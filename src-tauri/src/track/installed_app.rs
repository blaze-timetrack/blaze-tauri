use std::ffi::OsString;
use std::ptr;
use windows::core::{PCWSTR, PWSTR};
use windows::Win32::Foundation::ERROR_NO_MORE_ITEMS;
use windows::Win32::System::Registry::{RegCloseKey, RegEnumKeyExW, RegOpenKeyExW, RegQueryValueExW, HKEY, HKEY_LOCAL_MACHINE, KEY_READ, REG_SZ};

pub fn list_installed_app() {
    let hklm = HKEY_LOCAL_MACHINE;
    let mut uninstall_key = HKEY::default();

    unsafe {
        RegOpenKeyExW(
            hklm,
            PCWSTR("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\0".encode_utf16().collect::<Vec<_>>().as_ptr()),
            Some(0),
            KEY_READ,
            &mut uninstall_key,
        ).is_ok();
    }

    // Enumerate all subkeys
    let mut index = 0;
    loop {
        let mut name = [0u16; 1024];
        let mut name_len = name.len() as u32;
        let result = unsafe {
            RegEnumKeyExW(
                uninstall_key,
                index,
                Some(PWSTR(name.as_mut_ptr())),
                &mut name_len,
                Some(ptr::null_mut()),
                Some(PWSTR(name.as_mut_ptr())),
                Some(ptr::null_mut()),
                Some(ptr::null_mut()),
            )
        };

        if result == ERROR_NO_MORE_ITEMS {
            break;
        }
        if result.is_err() {
            break;
        }

        let name = OsString::from_wide(&name[..name_len as usize]);
        let name_str = name.to_string_lossy();

        // Open the subkey
        let mut subkey = HKEY::default();
        unsafe {
            if RegOpenKeyExW(
                uninstall_key,
                PCWSTR(name.encode_utf16().collect::<Vec<_>>().as_ptr()),
                Some(0),
                KEY_READ,
                &mut subkey,
            ).is_ok() {
                // Read DisplayName value
                let mut value_type = 0;
                let mut value_data = [0u16; 1024];
                let mut value_len = value_data.len() as u32;
                if RegQueryValueExW(
                    subkey,
                    PCWSTR("DisplayName\0".encode_utf16().collect::<Vec<_>>().as_ptr()),
                    Some(ptr::null_mut()),
                    Some(&mut value_type),
                    Some(value_data.as_mut_ptr() as *mut u8),
                    Some(&mut value_len),
                ).is_ok() && value_type == REG_SZ {
                    let value = OsString::from_wide(&value_data[..(value_len as usize / 2)]);
                    println!("{}", value.to_string_lossy());
                }
                unsafe { RegCloseKey(subkey); }
            }
        }

        unsafe { RegCloseKey(uninstall_key); }

        index += 1;
    }
}
