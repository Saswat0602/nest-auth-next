package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Title   string  `json:"title"`
	Price   float64 `json:"price"`
	OwnerID uint    `json:"owner_id"`
}
