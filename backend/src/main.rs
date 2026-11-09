mod config;
mod db;
mod routes;
mod state;

use crate::{config::Config, state::AppState};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    let config = Config::from_env()?;
    println!("env loaded");

    let db = db::connect_and_migrate(&config.database_url).await?;
    println!("db connected and migrated");

    let state = AppState { db };
    let app = routes::router(state);

    let listener = tokio::net::TcpListener::bind(("0.0.0.0", config.port)).await?;
    println!(
        "axum is hosting the server at http://{}/api",
        listener.local_addr()?
    );
    axum::serve(listener, app).await?;

    Ok(())
}
