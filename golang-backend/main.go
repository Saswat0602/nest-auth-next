package main

import (
	"github.com/gin-gonic/gin"
	"golang-backend/config"
	"golang-backend/models"
	"golang-backend/routes"
)

func main() {
	app := gin.Default()

	config.Connect()
	config.DB.AutoMigrate(&models.User{}, &models.Product{})

	routes.SetupRoutes(app)
	app.Run(":8080")
}
