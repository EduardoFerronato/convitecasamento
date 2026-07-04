-- Execute no SQL Editor da Vercel (Storage → Postgres → Query)
-- ou no console Neon: https://console.neon.tech

CREATE TABLE IF NOT EXISTS rsvps (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  phone       TEXT NOT NULL DEFAULT '',
  attending   TEXT NOT NULL CHECK (attending IN ('yes', 'no')),
  guests      INTEGER NOT NULL DEFAULT 0,
  message     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rsvps_created_at_idx ON rsvps (created_at DESC);
