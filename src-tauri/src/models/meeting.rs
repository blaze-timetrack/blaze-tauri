use crate::models::activity::Activity;
use crate::models::project::Project;

pub struct Meeting {
    activities: Vec<String>,
    duration: i32,
    start_time: String,
    end_time: String,
    projects: Vec<String>
}