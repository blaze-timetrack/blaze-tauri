use crate::models::activity::Activity;
use crate::models::meeting::Meeting;
use crate::models::task::Task;

pub struct Project {
    name: String,
    description: String,
    activities: Vec<String>,
    meeting_states: Vec<String>,
    tasks: Vec<String>,
}
