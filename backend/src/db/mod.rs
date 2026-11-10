pub mod gems;

use sqlx::{PgPool, postgres::PgPoolOptions};

pub async fn connect_and_migrate(database_url: &str) -> sqlx::Result<PgPool> {
    let db = PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await?;
    sqlx::migrate!("./migrations").run(&db).await?;
    Ok(db)
}
