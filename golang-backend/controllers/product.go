package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"golang-backend/models"
	"golang-backend/config"
)

func CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Create(&product)
	c.JSON(http.StatusOK, product)
}

func GetProducts(c *gin.Context) {
	var products []models.Product
	config.DB.Preload("Owner").Find(&products)
	c.JSON(http.StatusOK, products)
}
