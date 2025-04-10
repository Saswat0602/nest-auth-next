package controllers

import (
	"github.com/gin-gonic/gin"
	"golang-backend/models"
	"golang-backend/config"
	"golang-backend/utils"
	"net/http"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
)

func Register(c *gin.Context) {
	var body models.User
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	body.Password = string(hashedPassword)

	result := config.DB.Create(&body)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusOK, body)
}

func Login(c *gin.Context) {
	var body struct {
		Email    string
		Password string
	}
	c.BindJSON(&body)

	var user models.User
	config.DB.First(&user, "email = ?", body.Email)

	if user.ID == 0 || bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID,
		"exp":    time.Now().Add(time.Hour * 24 * 7).Unix(),
	})
	tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}
