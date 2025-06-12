use sysinfo::{Pid, System};
use windows::core::Interface;
use windows::Win32::Foundation::HWND;
use windows::Win32::System::Com::{
    CoCreateInstance, CoInitializeEx, CoUninitialize, CLSCTX_INPROC_SERVER,
    COINIT_APARTMENTTHREADED,
};
use windows::Win32::System::Variant::VARIANT;
use windows::Win32::UI::Accessibility::{
    CUIAutomation8, IUIAutomation, IUIAutomationValuePattern, TreeScope_Subtree,
    UIA_ControlTypePropertyId, UIA_EditControlTypeId, UIA_ValuePatternId,
};
use windows::Win32::UI::WindowsAndMessaging::{
    GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId,
};

#[derive(Debug)]
pub enum BrowserList {
    Chrome,
    Brave,
    MsEdge,
    Firefox,
    Zen,
    Arc,
}

fn format_name<'a>(window_name: &'a str, process_name: &'a str) -> &'a str {
    if process_name.eq("ApplicationFrameHost.exe") {
        println!("ApplicationFrameHost.exe");
        return window_name;
    }

    process_name
}

fn is_browser(process_name: &str) -> Option<BrowserList> {
    match process_name.to_lowercase() {
        name if name.contains("chrome.exe") => Some(BrowserList::Chrome),
        name if name.contains("brave.exe") => Some(BrowserList::Brave),
        name if name.contains("msedge.exe") => Some(BrowserList::MsEdge),
        name if name.contains("firefox.exe") => Some(BrowserList::Firefox),
        name if name.contains("zen.exe") => Some(BrowserList::Zen),
        name if name.contains("arc.exe") => Some(BrowserList::Arc),
        _ => None,
    }
}

pub fn get_active_pid_title() -> (HWND, u32, String) {
    unsafe {
        let hwnd = GetForegroundWindow();

        let mut pid: u32 = 0;
        GetWindowThreadProcessId(hwnd, Some(&mut pid));

        let mut bytes: [u16; 500] = [0; 500];
        let len = GetWindowTextW(hwnd, &mut bytes);
        let title = String::from_utf16_lossy(&bytes[..len as usize]);
        println!("title: {}", title);

        (hwnd, pid, title)
    }
}

pub fn get_active_process_name() -> Option<(HWND, String, String)> {
    let sys = System::new_all();

    let (hwnd_window, window_pid, window_title) = get_active_pid_title();

    if window_pid == 0 {
        return None;
    }

    let process = sys.processes().get(&Pid::from_u32(window_pid));
    println!("process: {:?}", process?.exe());
    println!("process: {:?}", process?.name());
    println!("process: {:?}", process?.root());

    if let Some(process) = process {
        let name = format_name(window_title.as_str(), process.name().to_str().unwrap());
        return Some((hwnd_window, name.to_string(), window_title));
    };

    None
}

// title, process-name, url, hwnd(opt)
pub fn get_active_all() -> Option<(String, String, Option<String>)> {
    let (hwnd_process, process_name, window_title) = get_active_process_name()?;
    match get_browser_active_url(&hwnd_process, &process_name) {
        Ok(url) => return Some((window_title, process_name, Some(url))),
        Err(e) => return Some((window_title, process_name, None)),
    }
}

pub fn get_browser_active_url(hwnd_process: &HWND, process_name: &String) -> Result<String, &'static str> {
    if let Some(browser) = is_browser(&process_name) {
        unsafe {
            let _ = CoInitializeEx(None, COINIT_APARTMENTTHREADED);

            let automation: IUIAutomation =
                CoCreateInstance(&CUIAutomation8, None, CLSCTX_INPROC_SERVER).unwrap();

            let element = automation.ElementFromHandle(hwnd_process.clone()).unwrap();

            let variant = VARIANT::from(UIA_EditControlTypeId.0 as i32);
            let condition = automation
                .CreatePropertyCondition(UIA_ControlTypePropertyId, &variant)
                .unwrap();

            let address_bar = match element.FindFirst(TreeScope_Subtree, &condition) {
                Ok(address) => address,
                Err(_) => return Err("Could not find address bar"),
            };

            let value_patter_obj = address_bar.GetCurrentPattern(UIA_ValuePatternId).unwrap();

            let value_pattern: IUIAutomationValuePattern = value_patter_obj.cast().unwrap();

            let bstr_url = value_pattern.CurrentValue().unwrap(); // Returns BSTR

            let url = bstr_url.to_string();

            CoUninitialize();

            println!("url: {}", url);

            return Ok(url);
        }
    }
    return Err("no active browser found.");
}

fn get_browser_active_content_title() {}

fn get_media_player_active_title() {}

fn get_editor_active_title() {}
