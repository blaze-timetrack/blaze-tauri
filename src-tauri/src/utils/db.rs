use sqlx::sqlite::SqliteConnectOptions;
use sqlx::SqlitePool;
use std::path::PathBuf;

pub async fn connect_to_db(path: PathBuf) -> Result<SqlitePool, sqlx::Error> {
    let app_path = path.join("test.db");
    let db_url = format!("sqlite://{}", app_path.display());
    println!("{:?}", db_url);
    let options = SqliteConnectOptions::new()
        .filename("test.db") // Explicit filename
        .create_if_missing(true); // Enable auto-creation

    let pool = SqlitePool::connect_with(options).await?;
    Ok(pool)
}

pub async fn close_connection_db(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    pool.close().await;
    Ok(())
}

pub async fn setup_schema(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query("CREATE TABLE IF NOT EXISTS activity (id INTEGER PRIMARY KEY, name TEXT NOT NULL, time JSONB NOT NULL )").execute(pool).await?;
    Ok(())
}
