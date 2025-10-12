use crate::track::afk::away_from_keyboard;
use crate::track::targets::get_active_all;
use chrono::{DateTime, Utc};
use chrono_tz::Tz;
use serde::{Deserialize, Serialize};
use std::time::Instant;
use tauri::Runtime;
use tauri_plugin_store::StoreExt;
use tokio::time::Duration;

static TIME_FORMAT: &str = "%H:%M:%S";

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

pub struct Timezone {
    pub value: String,
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

pub async fn start_heartbeat<R: Runtime>(
    app: &tauri::AppHandle<R>,
) -> Result<(Option<HeartbeatBlood>, Option<HeartbeatStop>), String> {
    let (title, past_blood, url) = get_active_all().unwrap();
    let store = app
        .store(".settings.dat")
        .expect("Failed to load settings.dat in heartbeat");
    let tz: Tz = store
        .get("timezone")
        .unwrap()
        .as_object()
        .unwrap()
        .get("value")
        .unwrap()
        .as_str()
        .unwrap()
        .parse()
        .unwrap();
    let utc_now = Utc::now();

    let mut total_duration = Duration::ZERO;
    let mut last_check = Instant::now();
    let mut start_time: DateTime<Tz> = utc_now.with_timezone(&tz);
    let mut end_time: DateTime<Tz>;
    let mut afk = false;
    let mut past_afk = false;
    let mut idle_t = false;
    let mut crossed_5_min_idle_t = false;
    let afk_duration_ms = 5 * 60 * 1000;
    let afk_check_interval_ms = 2 * 60 * 1000 + 30 * 1000;
    // let afk_duration_ms = 30 * 1000;
    // let afk_check_interval_ms = 30 * 1000;
    let mut afk_check_interval_timer_ms = Duration::ZERO;
    let mut end_afk = true;
    let mut past_blood_afk = None;

    loop {
        let store = app.store(".settings.dat").expect("Failed to load store.");
        let state = store
            .get("state")
            .unwrap_or(serde_json::Value::String(String::from("TRACKING")))
            .clone();

        let mut elapsed = last_check.elapsed();
        last_check = Instant::now();

        afk_check_interval_timer_ms += elapsed;

        total_duration += elapsed;
        println!("total duration: {}", total_duration.as_secs().to_string());
        if !afk {
            let (_, current_blood, _) = get_active_all().unwrap();

            // idle programs check
            if past_blood != current_blood && idle_t {
                if (total_duration.as_secs().gt(&(5 * 60))) {
                    crossed_5_min_idle_t = true;
                } else {
                    return Ok((None, None));
                }
            }

            // afk check
            if past_afk || crossed_5_min_idle_t {
                let now = Utc::now();
                end_time = now.with_timezone(&tz);
                return Ok((
                    past_blood_afk,
                    Some(HeartbeatStop {
                        time: Time {
                            start: start_time.format(TIME_FORMAT).to_string(),
                            end: end_time.format(TIME_FORMAT).to_string(),
                            duration: total_duration.as_secs(),
                        },
                    }),
                ));
            }

            // current program change check
            if past_blood != current_blood || state == "NO_TRACKING" || total_duration == Duration::from_millis(5 * 60 * 1000) {
                let now = Utc::now();
                end_time = now.with_timezone(&tz);
                return Ok((
                    Some(HeartbeatBlood {
                        process_name: past_blood.unwrap().to_string(),
                        title: title.clone(),
                        url: url.clone(),
                        time: Time {
                            start: start_time.format(TIME_FORMAT).to_string(),
                            end: end_time.format(TIME_FORMAT).to_string(),
                            duration: total_duration.as_secs(),
                        },
                    }),
                    None,
                ));
            }

            if past_blood == None {
                idle_t = true;
                println!("past_blood: {:#?}", past_blood_afk.as_ref());
                tokio::time::sleep(POLL_INTERVAL).await;
                continue;
            }
        }

        if afk_check_interval_ms <= afk_check_interval_timer_ms.as_millis() || afk {
            println!("checking afk");
            afk = away_from_keyboard(afk_duration_ms).unwrap_or_else(|e| {
                eprintln!("Away from keyboard error: {}", e);
                false
            });

            if afk && end_afk {
                past_afk = true;
                end_afk = false;
                let now = Utc::now();
                end_time = now.with_timezone(&tz);
                match total_duration.checked_sub(Duration::new(5 * 60, 0)) {
                    Some(v) => {
                        past_blood_afk = Some(HeartbeatBlood {
                            process_name: past_blood.clone().unwrap().to_string(),
                            title: title.clone(),
                            url: url.clone(),
                            time: Time {
                                start: start_time.format(TIME_FORMAT).to_string(),
                                end: end_time.format(TIME_FORMAT).to_string(),
                                duration: total_duration.as_secs(),
                            },
                        });
                        start_time = end_time;
                        total_duration = v;
                    }
                    None => {}
                };
            }
            // continues check of afk
            if !afk {
                afk_check_interval_timer_ms = Duration::ZERO;
            }
        }

        tokio::time::sleep(POLL_INTERVAL).await;
    }
}
