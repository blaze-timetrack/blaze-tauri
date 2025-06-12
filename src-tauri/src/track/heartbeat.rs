use crate::track::targets::get_active_all;
use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use std::time::Instant;
use tokio::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
pub struct Time {
    pub start: String,
    pub end: String,
    pub duration: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HeartbeatBlood {
    pub process_name: String,
    pub time: Time,
}

const TARGET_APP: [&str; 10] = [
    "zen.exe",
    "brave.exe",
    "windowsterminal.exe",
    "explorer.exe",
    "obsidian.exe",
    "taskmgr.exe",
    "listary-core.exe",
    "listary.exe",
    "dwm.exe",
    "code.exe",
];

const POLL_INTERVAL: Duration = Duration::from_secs(5);

pub async fn start_heartbeat() -> Result<HeartbeatBlood, String> {
    let (title, past_blood, url) = get_active_all().unwrap();

    let mut total_duration = Duration::ZERO;
    let mut last_check = Instant::now();
    let start_time: DateTime<Local> = Local::now();
    let end_time: DateTime<Local>;

    loop {
        let elapsed = last_check.elapsed();
        last_check = Instant::now();

        total_duration += elapsed;
        println!("total duration: {}", total_duration.as_secs().to_string());
        let (_, current_blood, _) = get_active_all().unwrap();

        if past_blood != current_blood {
            end_time = Local::now();
            return Ok(HeartbeatBlood {
                process_name: past_blood.to_string(),
                time: Time {
                    start: start_time.to_string(),
                    end: end_time.to_string(),
                    duration: total_duration.as_secs().to_string(),
                },
            });
        }

        tokio::time::sleep(POLL_INTERVAL).await;
    }
}
