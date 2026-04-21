package models

import "gorm.io/gorm"

type User struct{
	gorm.Model
	ID       uint   `gorm:"primaryKey"`
	Email	 string `gorm:"unique;not null" json:"email"`
	Password string `json:"password"`
	Token    string
}