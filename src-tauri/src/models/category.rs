use crate::models::program::Program;

pub enum State {
    Idle,
    Meet,
    Flow,
    Dist,
    Work,
    // close states
        Disable,
    Off,
}

pub struct Category {
    name: String,
    programs: Vec<String>, // record link
    state: State
}