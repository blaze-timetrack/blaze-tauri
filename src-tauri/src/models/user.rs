use chrono::{DateTime, TimeZone};
use crate::models::activity::TimeDetail;

pub struct User {
    name: String,
    email: String,
    username: String,
    created_at: String,
}