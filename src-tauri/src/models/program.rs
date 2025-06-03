use crate::DB;
use serde::Serialize;

enum TrackState {
    On,
    Off,
}

#[derive(Debug, Serialize)]
pub struct Program {
    name: String,
    category: String,
    // source: String,
    // keywords: Vec<String>,
    // track_url: TrackState,
    // track_title: TrackState,
}
