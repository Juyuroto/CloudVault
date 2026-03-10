package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/Juyuroto/cloudvault/internal/database"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func main() {
	//connect to database
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT)")

	if err != nil {
		log.Fatal(err)
	}

	//create router
	router := mux.NewRouter()
	router.HandleFunc("/users", database.GetUsers(db)).Methods("GET")
	router.HandleFunc("/users/{id}", database.GetUser(db)).Methods("GET")
	router.HandleFunc("/users", database.CreateUser(db)).Methods("POST")
	router.HandleFunc("/users/{id}", database.UpdateUser(db)).Methods("PUT")
	router.HandleFunc("/users/{id}", database.DeleteUser(db)).Methods("DELETE")

	//start server
	log.Fatal(http.ListenAndServe(":8000", jsonContentTypeMiddleware(router)))
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}
