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
    pub duration: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HeartbeatBlood {
    pub process_name: String,
    pub title: String,
    pub url: Option<String>,
    pub time: Time,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct HeartbeatStop {
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

pub async fn start_heartbeat() -> Result<(Option<HeartbeatBlood>, Option<HeartbeatStop>), String> {
    let (title, past_blood, url) = get_active_all().unwrap();

    let mut total_duration = Duration::ZERO;
    let mut last_check = Instant::now();
    let start_time: DateTime<Local> = Local::now();
    let end_time: DateTime<Local>;
    let mut afk = false;
    let mut past_afk = false;
    let afk_duration_ms = 5 * 60 * 1000;
    let afk_check_interval_ms = 30 * 1000;
    let mut afk_check_interval_timer_ms = Duration::ZERO;

    loop {
        let mut elapsed = last_check.elapsed();
        last_check = Instant::now();

        afk_check_interval_timer_ms += elapsed;

        if !afk {
            total_duration += elapsed;
            println!("total duration: {}", total_duration.as_secs().to_string());
            let (_, current_blood, _) = get_active_all().unwrap();

            if past_afk {
                end_time = Local::now();
                return Ok((None, Some(HeartbeatStop {
                    time: Time {
                        start: start_time.to_string(),
                        end: end_time.to_string(),
                        duration: afk_check_interval_timer_ms.as_secs(),
                    }
                })));
            }

            if past_blood != current_blood {
                end_time = Local::now();
                return Ok((Some(HeartbeatBlood {
                    process_name: past_blood.to_string(),
                    title,
                    url,
                    time: Time {
                        start: start_time.to_string(),
                        end: end_time.to_string(),
                        duration: total_duration.as_secs(),
                    },
                }), None));
            }
        }

        if afk_check_interval_ms <= afk_check_interval_timer_ms.as_millis() || afk {
            println!("checking afk");
            afk = away_from_keyboard(afk_duration_ms).unwrap_or_else(|e| {
                eprintln!("Away from keyboard error: {}", e);
                false
            });

            if afk {
                elapsed = Duration::ZERO;
                past_afk = true;
                println!("total duration: {}", afk_check_interval_timer_ms.as_secs().to_string());
            }
            afk_check_interval_timer_ms = Duration::ZERO;
        }

        tokio::time::sleep(POLL_INTERVAL).await;
    }
}
