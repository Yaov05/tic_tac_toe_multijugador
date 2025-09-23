package models

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Player struct {
	Id     string
	Name   string
	Conn   *websocket.Conn
	Symbol string // "X" o "O"
}

type Room struct {
	Id      string
	Players []*Player
	Board   [3][3]string
	Turn    string
	Mu      sync.Mutex
}

type Message struct {
	Type  string `json:"type"`
	Room  string `json:"room,omitempty"`
	NameX string `json:"nameX,omitempty"`
	NameO string `json:"nameO,omitempty"`
	Move  [2]int `json:"move,omitempty"`
}
