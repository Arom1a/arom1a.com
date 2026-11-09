use axum::{extract::State, http::StatusCode, response::IntoResponse};
use sqlx::query;

use crate::state::AppState;

pub async fn check_health(State(state): State<AppState>) -> impl IntoResponse {
    let db = &state.db;
    let db_ok = query("SELECT 1").execute(db).await.is_ok();

    if db_ok {
        (StatusCode::OK, "ok")
    } else {
        (StatusCode::SERVICE_UNAVAILABLE, "db unavailable")
    }
}
