package main

import (
	"github.com/Juyuroto/cloudvault/internal/config"
	"github.com/Juyuroto/cloudvault/internal/database"
	"github.com/Juyuroto/cloudvault/internal/handlers"
	"github.com/Juyuroto/cloudvault/internal/middleware"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	var cfg *config.Config
	var err error
	cfg, err = config.Load()

	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	var pool *pgxpool.Pool
	pool, err = database.Connect(cfg.DatabaseURL)

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	defer pool.Close()

	var router *gin.Engine = gin.Default()
	router.SetTrustedProxies(nil)
	router.GET("/", func(c *gin.Context) {
		// map[string]interface{}
		// map[string]any{}
		c.JSON(200, gin.H{
			"message":  "JSP API is running well!",
			"status":   "success",
			"database": "connected",
		})
	})

	// router.POST("/auth/register", handlers.CreateUserHandler(pool))
	// router.POST("/auth/login", handlers.LoginHandler(pool, cfg))

	// protected := router.Group("/JSP")
	// protected.Use(middleware.AuthMiddleware(cfg))
	// {
	// 	protected.POST("", handlers.CreateJSPHandler(pool))
	// 	protected.GET("", handlers.GetAllJSPHandler(pool))
	// 	protected.GET("/:id", handlers.GetJSPByIDHandler(pool))
	// 	protected.PUT("/:id", handlers.UpdateJSPHandler(pool))
	// 	protected.DELETE("/:id", handlers.DeleteJSPHandler(pool))
	// }

	// Middleware Test Route
	router.GET("/protected-test", middleware.AuthMiddleware(cfg), handlers.TestProtectedHandler())

	router.Run(":" + cfg.Port)
}
