use crate::track::afk::away_from_keyboard;
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
    let mut afk = false;
    let afk_duration_ms = 5 * 60 * 1000;
    let afk_check_interval_ms = 30 * 1000;
    let mut afk_check_interval_timer_ms = 0;

    loop {
        let mut elapsed = last_check.elapsed();
        last_check = Instant::now();

        afk_check_interval_timer_ms += elapsed.as_millis() as u64;

        if !afk {
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
        }

        if afk_check_interval_ms <= afk_check_interval_timer_ms || afk {
            println!("checking afk");
            afk = away_from_keyboard(afk_duration_ms).unwrap_or_else(|e| {
                eprintln!("Away from keyboard error: {}", e);
                false
            });

            if afk {
                elapsed = Duration::ZERO;
            }
            afk_check_interval_timer_ms = 0;
        }

        tokio::time::sleep(POLL_INTERVAL).await;
    }
}
