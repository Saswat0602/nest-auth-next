package routes

import (
	"github.com/gin-gonic/gin"
	"golang-backend/controllers"
)

func SetupRoutes(app *gin.Engine) {
	app.POST("/auth/register", controllers.Register)
	app.POST("/auth/login", controllers.Login)

	app.POST("/products", controllers.CreateProduct)
	app.GET("/products", controllers.GetProducts)
}
