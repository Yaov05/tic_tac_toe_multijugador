package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"tic-tac-toe-server/db"
)

func SaveGameResult(roomId, playerX, playerO, winner string) {
	ctx := context.Background()

	_, err := db.Pool.Exec(ctx, "INSERT INTO games (room_id, player_x, player_o, winner) VALUES ($1, $2, $3, $4)", roomId, playerX, playerO, winner)
	if err != nil {
		log.Println("Error guardando la partida: %v", err)
	}

	if winner == "X" || winner == "O" {
		var winnerStr string
		if winner == "X" {
			winnerStr = playerX
		} else {
			winnerStr = playerO
		}

		// Insertar o actualizar jugador
		_, err := db.Pool.Exec(ctx,
			`INSERT INTO players (name, wins) VALUES ($1,1)
             ON CONFLICT (name) DO UPDATE SET wins = players.wins + 1`,
			winnerStr,
		)
		if err != nil {
			log.Println("Error actualizando jugador:", err)
		}
	}
}

func GetAllGames(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("Obteniendo estadísticas de la base de datos...")
	rows, err := db.Pool.Query(context.Background(),
		"SELECT name, wins FROM players ORDER BY wins DESC LIMIT 10")
	if err != nil {
		http.Error(w, "Error DB", 500)
		return
	}
	defer rows.Close()

	type Player struct {
		Name string `json:"name"`
		Wins int    `json:"wins"`
	}
	var players []Player

	for rows.Next() {
		var p Player
		rows.Scan(&p.Name, &p.Wins)
		players = append(players, p)
	}
	// fmt.Println("Estadísticas obtenidas:", players)
	json.NewEncoder(w).Encode(players)
}
