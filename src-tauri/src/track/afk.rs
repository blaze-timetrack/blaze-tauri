use windows::Win32::System::SystemInformation::GetTickCount64;
use windows::Win32::UI::Input::KeyboardAndMouse::{GetLastInputInfo, LASTINPUTINFO};

pub fn away_from_keyboard(timeout_ms: u64) -> windows::core::Result<bool> {
    unsafe {
        let mut last_input_info = LASTINPUTINFO {
            cbSize: std::mem::size_of::<LASTINPUTINFO>() as u32,
            dwTime: 0,
        };

        if !GetLastInputInfo(&mut last_input_info).as_bool() {
            return Err(windows::core::Error::from_win32());
        }

        let current_tick = GetTickCount64();
        let elapsed = current_tick - last_input_info.dwTime as u64;

        if elapsed > timeout_ms {
            println!("afk away form keyboard")
        }

        Ok(elapsed > timeout_ms)
    }
}
