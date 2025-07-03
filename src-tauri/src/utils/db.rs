use sqlx::sqlite::SqliteConnectOptions;
use sqlx::SqlitePool;
use std::path::PathBuf;
use std::str::FromStr;

pub async fn connect_to_db(path: PathBuf) -> Result<SqlitePool, sqlx::Error> {
    let app_path = path.join("test.db");
    let db_url = format!("sqlite:{}", app_path.display());
    println!("{:?}", db_url);
    let options = SqliteConnectOptions::from_str(&db_url)?.create_if_missing(true);

    let pool = SqlitePool::connect_with(options).await?;
    Ok(pool)
}

pub async fn close_connection_db(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    pool.close().await;
    Ok(())
}

pub async fn setup_schema(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query(r#"CREATE TABLE IF NOT EXISTS user
    (id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE)
"#).execute(pool).await?;

    sqlx::query(r#"CREATE TABLE  IF NOT EXISTS day
    (date_id DATE PRIMARY KEY)
"#).execute(pool).await?;

    sqlx::query(r#"CREATE TABLE IF NOT EXISTS activities
    (id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    duration INT NOT NULL DEFAULT 0,
    time_details BLOB NOT NULL DEFAULT '[]',
    date_id DATE,
    flow_states INT,
    category VARCHAR(20) NOT NULL DEFAULT 'uncategorized',
    FOREIGN KEY (date_id) REFERENCES day(date_id),
    FOREIGN KEY (id) REFERENCES day(flow_states)
)"#).execute(pool).await?;

    sqlx::query(r#"CREATE TABLE IF NOT EXISTS flows
    (id INT PRIMARY KEY,
    duration INT NOT NULL DEFAULT 0,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL
)"#).execute(pool).await?;

    println!("created Schema of table");
    Ok(())
}
