-- create the gems table
CREATE TABLE gems (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id    UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    url          TEXT NOT NULL,
    description  TEXT,
    collected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
