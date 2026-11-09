use anyhow::{Context, Result};

pub struct Config {
    pub database_url: String,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let database_url = std::env::var("DATABASE_URL")
            .context("DATABASE_URL is not set")?
            .trim()
            .to_string();
        let port = std::env::var("PORT")
            .context("PORT is not set")?
            .parse::<u16>()
            .context("PORT must be a valid u16")?;

        Ok(Self { database_url, port })
    }
}
