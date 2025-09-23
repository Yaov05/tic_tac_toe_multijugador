
-- Jugador
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    wins INT DEFAULT 0
);

-- Partidas
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    room_id TEXT,
    player_x TEXT,
    player_o TEXT,
    winner TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);