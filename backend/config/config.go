package config

import (
	"fmt"
	"log"
	"os"

	"github.com/Juyuroto/cloudvault/models"
	
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {

	host := os.Getenv("PostgreHost")
	port := os.Getenv("PostgrePort")
	user := os.Getenv("PostgreUser")
	password := os.Getenv("PostgrePassword")
	dbname := os.Getenv("PostgreDB")
	sslmode := os.Getenv("PostgreSSLMODE")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host, user, password, dbname, port, sslmode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Impossible de se connecter à la base de données :", err)
	}
	
	db.AutoMigrate(&models.User{})
	
	DB = db
}