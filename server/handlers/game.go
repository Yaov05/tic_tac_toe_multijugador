package handlers

import (
	"log"
	"sync"
	"tic-tac-toe-server/models"

	"github.com/gorilla/websocket"
)

var rooms = make(map[string]*models.Room)
var roomsMu sync.Mutex
var counter int

func handleCreateRoom(conn *websocket.Conn, msg models.Message) {

	roomsMu.Lock()
	defer roomsMu.Unlock()

	counter = 0

	roomId := msg.Room
	player := &models.Player{Name: msg.NameX, Conn: conn, Symbol: "X"}
	room := &models.Room{
		Id:      roomId,
		Players: []*models.Player{player},
		Turn:    "X",
	}
	rooms[roomId] = room

	log.Printf("Sala creada: %s por %s", roomId, msg.NameX)
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

	player := &models.Player{Name: msg.NameO, Conn: conn, Symbol: "O"}
	room.Players = append(room.Players, player)

	log.Printf("Jugador %s se unió a la sala: %s", msg.NameO, msg.Room)
	for _, p := range room.Players {
		p.Conn.WriteJSON(map[string]interface{}{
			"type":    "joinRoom",
			"room":    room.Id,
			"turn":    room.Turn,
			"symbol":  p.Symbol,
			"playerX": room.Players[0].Name,
			"playerO": room.Players[1].Name,
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

	row, col := msg.Move[0], msg.Move[1]

	room.Mu.Lock()
	defer room.Mu.Unlock()

	if room.Board[row][col] != "" {
		return
	}

	var currentPlayer string
	if room.Turn == "X" {
		currentPlayer = msg.NameX
	} else {
		currentPlayer = msg.NameO
	}

	room.Board[row][col] = room.Turn

	// Validar si hay ganador
	winner := checkWinner(room.Board)

	if winner != "" {

		var playerX, playerO string
		if len(room.Players) >= 2 {
			playerX = room.Players[0].Name
			playerO = room.Players[1].Name
		}
		SaveGameResult(room.Id, playerX, playerO, winner)
		if winner == "X" {
			winner = playerX
		} else {
			winner = playerO
		}
		// Terminar juego para ambos
		for _, p := range room.Players {
			p.Conn.WriteJSON(map[string]string{
				"type":   "gameOver",
				"winner": winner,
			})
		}
	}

	room.Turn = nextTurn(room.Turn)

	counter++

	if counter >= 9 && winner == "" {
		// Terminar juego en empate
		var playerX, playerO string
		if len(room.Players) >= 2 {
			playerX = room.Players[0].Name
			playerO = room.Players[1].Name
		}
		SaveGameResult(room.Id, playerX, playerO, "draw")

		// Aviso del empate
		for _, p := range room.Players {
			p.Conn.WriteJSON(map[string]string{
				"type":   "gameOver",
				"winner": "draw",
			})
		}
	}

	// Aviso del cambio
	for _, p := range room.Players {
		p.Conn.WriteJSON(map[string]interface{}{
			"type": "playMove",
			"row":  row,
			"col":  col,
			"by":   currentPlayer,
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

func checkWinner(board [3][3]string) string {
	for i := 0; i < 3; i++ {
		if board[i][0] != "" && board[i][0] == board[i][1] && board[i][1] == board[i][2] {
			return board[i][0]
		}
		if board[0][i] != "" && board[0][i] == board[1][i] && board[1][i] == board[2][i] {
			return board[0][i]
		}
	}
	if board[0][0] != "" && board[0][0] == board[1][1] && board[1][1] == board[2][2] {
		return board[0][0]
	}
	if board[0][2] != "" && board[0][2] == board[1][1] && board[1][1] == board[2][0] {
		return board[0][2]
	}
	return ""
}

// func init() {
// 	rand.Seed(time.Now().UnixNano())
// }
