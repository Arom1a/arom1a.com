use std::fmt::Display;

use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{PgPool, query_as};
use uuid::Uuid;

#[derive(sqlx::FromRow, Debug, Serialize)]
pub struct Gem {
    public_id: Uuid,
    url: String,
    description: Option<String>,
    collected_at: DateTime<Utc>,
}

impl Display for Gem {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "url: {}\nDesciption: {}\nUUID: {}\nCollected at: {}",
            self.url,
            self.description.as_deref().unwrap_or_default(),
            self.public_id,
            self.collected_at
        )
    }
}

pub async fn fetch_random(db: &PgPool, cnt: i64) -> sqlx::Result<Vec<Gem>> {
    query_as::<_, Gem>(
        r#"
        SELECT public_id, url, description, collected_at FROM gems
        ORDER BY random()
        LIMIT $1
        "#,
    )
    .bind(cnt)
    .fetch_all(db)
    .await
}
