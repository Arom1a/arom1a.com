use axum::{http::StatusCode, response::IntoResponse};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error(transparent)]
    Database(#[from] sqlx::Error),
    #[error("{0}")]
    BadRequest(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::Database(e) => {
                eprintln!("{}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "internal server error").into_response()
            }
            Self::BadRequest(s) => {
                (StatusCode::BAD_REQUEST, format!("bad request: {}", s)).into_response()
            }
        }
    }
}
