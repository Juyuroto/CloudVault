package main

import (
	"github.com/Juyuroto/cloudvault/config"
	"github.com/Juyuroto/cloudvault/routes"
	"github.com/Juyuroto/cloudvault/middlewares"
	"github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  
  config.ConnectDatabase()
  
  router.Use(middlewares.CorsMiddleware())
  
  routes.UserRoute(router)
  
  router.Run(":5005")
}