use sqlx::sqlite::SqliteConnectOptions;
use sqlx::SqlitePool;
use std::path::PathBuf;
use std::str::FromStr;

pub async fn connect_to_db(path: PathBuf) -> Result<SqlitePool, sqlx::Error> {
    let app_path = path.join("test.db");
    let db_url = format!("sqlite:{}", app_path.display());
    let options = SqliteConnectOptions::from_str(&db_url)?.create_if_missing(true);

    let pool = SqlitePool::connect_with(options).await?;
    Ok(pool)
}

pub async fn close_connection_db(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    pool.close().await;
    Ok(())
}

pub async fn setup_schema(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"CREATE TABLE IF NOT EXISTS user
    (id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE)
"#,
    )
        .execute(pool)
        .await?;

    sqlx::query(
        r#"CREATE TABLE IF NOT EXISTS days (
        id INTEGER PRIMARY KEY,
        date_id DATE UNIQUE,
        category_total BLOB NOT NULL DEFAULT '[]',
        flow_total INTEGER NOT NULL DEFAULT 0,
        break_total INTEGER NOT NULL DEFAULT 0)
    "#,
    )
        .execute(pool)
        .await?;

    sqlx::query(
        r#"CREATE TABLE IF NOT EXISTS activities
        (id INTEGER PRIMARY KEY,
        name TEXT NULL,
        duration INT NOT NULL DEFAULT 0,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        date_id DATE,
        flow_states INT,
        categories BLOB NOT NULL DEFAULT '[]',
        programs_ids BLOB NOT NULL DEFAULT '[]',
        FOREIGN KEY (date_id) REFERENCES days(date_id),
        FOREIGN KEY (id) REFERENCES flows(flow_states)
    )"#,
    )
        .execute(pool)
        .await?;

    sqlx::query(
        r#"CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        title TEXT,
        url TEXT,
        duration INTEGER NOT NULL DEFAULT 0,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        category TEXT NOT NULL DEFAULT 'uncategorized',
        date_id DATE,
        FOREIGN KEY (date_id) REFERENCES days(date_id)
    )"#,
    )
        .execute(pool)
        .await?;

    sqlx::query(
        r#"CREATE TABLE IF NOT EXISTS flows
        (id INTEGER PRIMARY KEY,
        duration INT NOT NULL DEFAULT 0,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        date_id DATE
        )"#,
    )
        .execute(pool)
        .await?;

    // activity_id INT UNIQUE NOT NULL REFERENCES activities(id),

    sqlx::query(
        r#"CREATE TABLE IF NOT EXISTS breaks (
    id INTEGER PRIMARY KEY,
        duration INT NOT NULL DEFAULT 0,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        date_id DATE NOT NULL,
        FOREIGN KEY (date_id) REFERENCES days(date_id)
    )"#).execute(pool)
        .await?;

    println!("created Schema of table");
    Ok(())
}
