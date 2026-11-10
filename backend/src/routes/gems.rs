use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};

use crate::{
    db::gems::{Gem, fetch_random},
    state::AppState,
    utils::label_gems_text,
};

#[derive(Deserialize)]
pub struct RandomQuery {
    cnt: i64,
}
#[derive(Serialize)]
pub struct RandomResponse {
    gems: Vec<Gem>,
}

// TODO: BadRequest if more
const MAX_QUERY_CNT: i64 = 50;

pub async fn random(
    State(state): State<AppState>,
    Query(query): Query<RandomQuery>,
) -> Result<Json<RandomResponse>, (StatusCode, &'static str)> {
    let gems = fetch_random(&state.db, query.cnt).await.map_err(|e| {
        eprintln!("{e}");
        (StatusCode::INTERNAL_SERVER_ERROR, "internal server error")
    })?;

    Ok(Json(RandomResponse { gems }))
}

pub async fn random_txt(
    State(state): State<AppState>,
    Query(query): Query<RandomQuery>,
) -> Result<String, (StatusCode, &'static str)> {
    let gems = fetch_random(&state.db, query.cnt).await.map_err(|e| {
        eprintln!("{e}");
        (StatusCode::INTERNAL_SERVER_ERROR, "internal server error")
    })?;
    Ok(label_gems_text(&gems))
}
