mod health;

use axum::{Router, routing::get};

use crate::state::AppState;

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/api", get(|| async { "Hello, World!" }))
        .route("/api/health", get(health::check_health))
        .with_state(state)
}
