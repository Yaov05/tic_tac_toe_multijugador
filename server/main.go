package main

import (
	"fmt"
	"log"
	"net/http"
	"tic-tac-toe-server/db"
	"tic-tac-toe-server/handlers"
	"time"
)

// Middleware para peticiones
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("[%s] %s %s", r.Method, r.RequestURI, r.RemoteAddr)
		next.ServeHTTP(w, r)
		log.Printf("Completed in %v", time.Since(start))
	})
}

func main() {
	// Conexion BD
	db.Connect()

	// mux de peticiones
	mux := http.NewServeMux()
	mux.HandleFunc("/ws", handlers.HandleWS)
	mux.HandleFunc("/stats", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Estadísticas")
	})

	// Aplicar middleware
	loggedMux := loggingMiddleware(mux)

	fmt.Println("Servidor escuchando en el puerto 8081")
	http.ListenAndServe(":8081", loggedMux)
}
