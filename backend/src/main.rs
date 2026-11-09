mod config;
mod db;
mod routes;

use axum::{Router, routing::get};

use crate::config::Config;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    let config = Config::from_env()?;
    println!("env loaded");

    let db = db::connect_and_migrate(&config.database_url).await?;
    println!("db connected and migrated");

    // build our application with a single route
    let app = Router::new().route("/", get(|| async { "Hello, World!" }));

    // run our app with hyper, listening globally on PORT
    let listener = tokio::net::TcpListener::bind(format!("localhost:{}", &config.port)).await?;
    println!("axum is hosting the server...");
    axum::serve(listener, app).await?;

    Ok(())
}
