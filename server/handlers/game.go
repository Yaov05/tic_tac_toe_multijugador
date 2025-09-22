package handlers

import (
	"fmt"
	"log"
	"sync"
	"tic-tac-toe-server/models"

	"github.com/gorilla/websocket"
)

var rooms = make(map[string]*models.Room)
var roomsMu sync.Mutex

func handleCreateRoom(conn *websocket.Conn, msg models.Message) {

	roomsMu.Lock()
	defer roomsMu.Unlock()

	roomId := msg.Room
	player := &models.Player{Name: msg.Name, Conn: conn, Symbol: "X"}
	room := &models.Room{
		Id:      roomId,
		Players: []*models.Player{player},
		Turn:    "X",
	}
	rooms[roomId] = room

	log.Printf("Sala creada: %s por %s", roomId, msg.Name)
	conn.WriteJSON(map[string]string{
		"type": "roomCreated",
		"room": roomId,
	})
}

func handleJoinRoom(conn *websocket.Conn, msg models.Message) {
	roomsMu.Lock()
	room, ok := rooms[msg.Room]
	roomsMu.Unlock()

	if !ok {
		conn.WriteJSON(map[string]string{
			"type":    "error",
			"message": "Sala no encontrada",
		})
		return
	}

	if len(room.Players) >= 2 {
		conn.WriteJSON(map[string]string{
			"type":    "error",
			"message": "Sala llena",
		})
		return
	}

	player := &models.Player{Name: msg.Name, Conn: conn, Symbol: "O"}
	room.Players = append(room.Players, player)

	log.Printf("Jugador %s se unió a la sala: %s", msg.Name, msg.Room)
	for _, p := range room.Players {
		p.Conn.WriteJSON(map[string]interface{}{
			"type":   "joinRoom",
			"room":   room.Id,
			"turn":   room.Turn,
			"symbol": p.Symbol,
		})
	}
}

func handlePlayMove(msg models.Message) {
	roomsMu.Lock()
	room, ok := rooms[msg.Room]
	roomsMu.Unlock()

	if !ok {
		return
	}

	fmt.Println("handlePlayMove called with message:", msg)

	row, col := msg.Move[0], msg.Move[1]

	room.Mu.Lock()
	defer room.Mu.Unlock()

	if room.Board[row][col] != "" {
		return
	}

	room.Board[row][col] = msg.Name
	room.Turn = nextTurn(room.Turn)

	// Aviso del cambio
	for _, p := range room.Players {
		p.Conn.WriteJSON(map[string]interface{}{
			"type": "playMove",
			"row":  row,
			"col":  col,
			"by":   msg.Name,
			"turn": room.Turn,
		})
	}

}

func nextTurn(current string) string {
	if current == "X" {
		return "O"
	}
	return "X"
}

// func init() {
// 	rand.Seed(time.Now().UnixNano())
// }
