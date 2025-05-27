use crate::models::category::Category;

enum TrackState {
    On,
    Off,
}
pub struct Program {
    name: String,
    category: String,
    source: String,
    keywords: Vec<String>,
    track_url: TrackState,
    track_title: TrackState,
}
