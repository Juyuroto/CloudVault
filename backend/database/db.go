package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func InitializeSchema(pool *pgxpool.Pool) error {
	var ctx context.Context = context.Background()

	_, err := pool.Exec(ctx, `CREATE EXTENSION IF NOT EXISTS pgcrypto;`)
	if err != nil {
		return err
	}

	_, err = pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);
	`)
	if err != nil {
		return err
	}

	log.Println("Database schema initialized")
	return nil
}

func Connect(databaseURL string) (*pgxpool.Pool, error) {
	var ctx context.Context = context.Background()

	var config *pgxpool.Config
	var err error
	config, err = pgxpool.ParseConfig(databaseURL)

	if err != nil {
		log.Printf("Unable to parse DATABASE_URL: %v", err)
		return nil, err
	}

	var pool *pgxpool.Pool
	pool, err = pgxpool.NewWithConfig(ctx, config)

	if err != nil {
		log.Printf("Unable to create connection pool: %v", err)
		return nil, err
	}

	err = pool.Ping(ctx)

	if err != nil {
		log.Printf("Unable to ping database: %v", err)
		pool.Close()
		return nil, err
	}

	log.Println("Successfully connected to PostgreSQL database")
	return pool, nil
}
