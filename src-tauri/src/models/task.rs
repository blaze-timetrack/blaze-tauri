pub enum State {
    Completed,
    InProgress,
    NotStarted,
}
pub struct Task {
    name: String,
    description: String,
    state: State,
}
