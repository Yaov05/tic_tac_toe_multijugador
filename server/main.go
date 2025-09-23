package main

import (
	"fmt"
	"log"
	"net/http"
	"tic-tac-toe-server/db"
	"tic-tac-toe-server/handlers"
	"time"
)

// Middleware para peticiones (logs)
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("[%s] %s %s", r.Method, r.RequestURI, r.RemoteAddr)
		next.ServeHTTP(w, r)
		log.Printf("Completed in %v", time.Since(start))
	})
}

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Conexion BD
	db.Connect()

	// mux de peticiones
	mux := http.NewServeMux()
	mux.HandleFunc("/ws", handlers.HandleWS)
	mux.HandleFunc("/stats", handlers.GetAllGames)

	// Aplicar middleware
	corsEnabledMux := corsMiddleware(mux)
	loggedMux := loggingMiddleware(corsEnabledMux)

	fmt.Println("Servidor escuchando en el puerto 8081")
	http.ListenAndServe(":8081", loggedMux)
}
