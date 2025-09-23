package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect() {
	dsn := "postgresql://postgres.gmomuvhigjuceahqsrmo:kAXfmxmoWgnvoQYp@aws-1-us-east-2.pooler.supabase.com:6543/postgres"
	if dsn == "" {
		log.Fatal("error leyendo la variable de entorno DATABASE_URL")
	}

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatal("error parsing database config:", err)
	}

	// Disable prepared statement cache
	config.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	Pool, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatal("error conectando a la base de datos:", err)
	}

	log.Println("Conectando a la base de datos")
}
