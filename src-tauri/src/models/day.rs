use crate::models::activity::Activity;
use crate::DB;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Day {
    pub date: String,
    pub activities: Vec<String>,
}

impl Day {
    pub async fn create(&self) -> Result<(), surrealdb::Error> {
        let id = format!("day:{}", self.date);
        DB.query("CREATE $id CONTENT $content;")
            .bind(("id", id.clone()))
            .bind(("content", self.clone()))
            .await?;
        Ok(())
    }

    pub async fn get(date: String) -> Result<Option<Day>, surrealdb::Error> {
        let id = format!("day:{}", date);
        let mut res = DB
            .query("SELECT * FROM $id;")
            .bind(("id", id.clone()))
            .await?;
        let day: Option<Day> = res.take(0)?;
        Ok(day)
    }

    pub async fn update(date: &str, activity: String) -> Result<(), surrealdb::Error> {
        let id = format!("day:{}", date);
        DB.query("UPDATE $id SET activities += activity;")
            .bind(("id", id.clone()))
            .bind(("activity", activity))
            .await?;
        Ok(())
    }

    pub async fn delete(date: &str) -> Result<(), surrealdb::Error> {
        let id = format!("day:{}", date);
        DB.query("DELETE $id;").bind(("id", id)).await?;
        Ok(())
    }
}
