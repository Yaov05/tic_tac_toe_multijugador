package handlers

import (
	"net/http"
	"tic-tac-toe-server/models"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
		return
	}
	defer conn.Close()

	for {
		var msg models.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			break
		}
		switch msg.Type {
		case "createRoom":
			handleCreateRoom(conn, msg)
		case "joinRoom":
			handleJoinRoom(conn, msg)
		case "playMove":
			handlePlayMove(msg)
		}
	}
}
