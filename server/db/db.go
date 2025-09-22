package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect() {
	dsn := "postgresql://postgres:kAXfmxmoWgnvoQYp@db.gmomuvhigjuceahqsrmo.supabase.co:5432/postgres"
	if dsn == "" {
		log.Fatal("error leyendo la variable de entorno DATABASE_URL")
	}

	var err error
	Pool, err = pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatal("error conectando a la base de datos:", err)
	}

	log.Println("Conectando a la base de datos")
}
