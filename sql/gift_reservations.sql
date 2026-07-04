-- Execute no SQL Editor da Neon (um comando por vez)

CREATE TABLE IF NOT EXISTS gift_reservations (
  id          TEXT PRIMARY KEY,
  gift_name   TEXT NOT NULL UNIQUE,
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gift_reservations_reserved_at_idx ON gift_reservations (reserved_at DESC);
