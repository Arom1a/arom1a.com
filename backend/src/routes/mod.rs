mod gems;
mod health;

use axum::{Router, routing::get};

use crate::state::AppState;

async fn greetings() -> &'static str {
    "Welcome to Aromia's *top* secret backend!"
    // TODO: add ascii art
}

fn v1_routes() -> Router<AppState> {
    Router::new()
        .route("/gems", get(gems::random))
        .route("/gems.txt", get(gems::random_txt))
}

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/api", get(greetings))
        .route("/api/health", get(health::check_health))
        .nest("/api/v1", v1_routes())
        .with_state(state)
}
