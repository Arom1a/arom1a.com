use axum::{
    Json,
    extract::{Query, State},
};
use serde::{Deserialize, Serialize};

use crate::{
    db::gems::{Gem, fetch_random},
    error::AppError,
    state::AppState,
    utils::label_gems_text,
};

#[derive(Deserialize)]
pub struct RandomQuery {
    cnt: Option<i64>,
}
#[derive(Serialize)]
pub struct RandomResponse {
    gems: Vec<Gem>,
}

const DEFAULT_QUERY_CNT: i64 = 10;
const MAX_QUERY_CNT: i64 = 50;

async fn fetch_random_capped(db: &sqlx::PgPool, cnt: Option<i64>) -> Result<Vec<Gem>, AppError> {
    let cnt = match cnt {
        None => DEFAULT_QUERY_CNT,
        Some(cnt @ 1..=MAX_QUERY_CNT) => cnt,
        _ => {
            return Err(AppError::BadRequest(
                "cnt is out of range of [1, 50]".into(),
            ));
        }
    };
    let gems = fetch_random(db, cnt).await?;
    Ok(gems)
}

pub async fn random(
    State(state): State<AppState>,
    Query(query): Query<RandomQuery>,
) -> Result<Json<RandomResponse>, AppError> {
    let gems = fetch_random_capped(&state.db, query.cnt).await?;
    Ok(Json(RandomResponse { gems }))
}

pub async fn random_txt(
    State(state): State<AppState>,
    Query(query): Query<RandomQuery>,
) -> Result<String, AppError> {
    let gems = fetch_random_capped(&state.db, query.cnt).await?;
    Ok(label_gems_text(&gems))
}
