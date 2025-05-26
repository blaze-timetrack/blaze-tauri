use crate::DB;
use chrono::{Duration, TimeDelta};
use serde::{Deserialize, Serialize};
use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Client;
use surrealdb::opt::auth::Record;
use surrealdb::rpc::format::cbor::res;
use crate::models::day::Day;

// This struct represents one time slot (start and end)
#[derive(Serialize, Deserialize, Clone)]
pub struct TimeDetail {
    pub start_time: String,
    pub end_time: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Activity {
    pub name: String,
    pub category: String,
    pub date: String,  // This is a record link to a "day" (e.g., "day:2025-05-24")
    pub duration: String,
    pub time_details: Vec<TimeDetail>,
}

impl Activity {
    pub async fn create(&self) -> Result<(), surrealdb::Error> {
        let id = format!("activity:{}", self.name); // Custom ID
        // DB.create(&id).content(self.clone()).await?;
        DB.query("CREATE $id CONTENT $content;")
            .bind(("content", self.clone()))
            .bind(("$id", id.clone()))
            .await?;

        // Optionally, update the day with this activity
        let mut query_day = DB.query("SELECT * FROM $date;").bind(("date", self.date.clone())).await?;
        let mut day: Option<Day> = query_day.take(0)?;
        if let Some(mut existing_day) = day {
            existing_day.activities.push(id.clone());
            DB.query("UPDATE $date SET $existing_day;")
                .bind(("date", self.date.clone()))
                .bind(("existing_day", existing_day))
                .await?;
        } else {
            let new_day = Day {
                date: self.date.clone(),
                activities: vec![id.clone()],
            };
            DB.query("CREATE $date CONTENT $content;").bind(("content", new_day)).bind(("date", self.date.clone())).await?;
        }

        Ok(())
    }

    pub async fn get(name: &str) -> Result<Option<Activity>, surrealdb::Error> {
        let id = format!("activity:{}", name);
        let mut  res =DB.query("SELECT * FROM $id;").bind(("id", id)).await?;
        let activity: Option<Activity>  = res.take(0)?;
        return Ok(activity);
    }

    pub async fn update(name: &str, duration: &str, start_time: String, end_time: String) -> Result<(), surrealdb::Error> {
        let id = format!("activity:{}", name);
        let duration = duration.to_string();
        DB.query("UPDATE $id SET duration += $duration;").bind(("id", id.clone())).bind(("duration", duration)).await?;
        DB.query("UPDATE $id MERGE { time_details: array::append(COALESCE((SELECT VALUE time_details FROM $id)[0], []), { start_time: $start_time, end_time: $end_time }) };")
            .bind(("id", id))
            .bind(("start_time", start_time))
            .bind(("end_time", end_time))
            .await?;
        Ok(())
    }

    pub async fn delete(name: &str) -> Result<(), surrealdb::Error> {
        let id = format!("activity:{}", name);
        DB.query("DELETE $id;").bind(("id", id)).await?;
        Ok(())
    }
    
    
    // pub fn get_
    // pub async fn add(&self) -> Result<(), surrealdb::Error> {
    //     // check date with program in db
    //     DB.create::<Option<Program>>("Program")
    //         .content(self.clone())
    //         .await?;
    // 
    //     println!("added to the DB");
    //     // update function fields: duration,
    //     Ok(())
    // }
    // pub async fn update(name: String, duration: String) -> Result<(), surrealdb::Error> {
    //     DB.query(
    //         "UPDATE (SELECT name FROM Program WHERE name=$name)
    //         SET duration = $duration;",
    //     )
    //         .bind(("name", name))
    //         .bind(("duration", duration))
    //         .await?;
    //     Ok(())
    // }
}
