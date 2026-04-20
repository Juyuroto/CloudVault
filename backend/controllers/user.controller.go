package controllers

import (
	"github.com/Juyuroto/cloudvault/config"
	"github.com/Juyuroto/cloudvault/models"
	"github.com/gin-gonic/gin"
)
	
func GetUserController(c *gin.Context) {
	user := []models.User{}
	config.DB.Find(&user)
	c.JSON(200, &user)
}

func CreateUserController(c *gin.Context) {
	var user models.User
	c.BindJSON(&user)
	config.DB.Create(&user)
	c.JSON(200, &user)
}

func LoginUserController(c *gin.Context) {
	
	var input struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }
    
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": "Données invalides"})
        return
    }
    
    var user models.User
    if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
    	c.JSON(401, gin.H{"error": "Utilisateur non trouvé"})
    	return
    }
    if user.Password != input.Password {
    	c.JSON(401, gin.H{"error": "Mot de passe incorrect"})
    	return
    }
    
    c.JSON(200, gin.H{
    	"message": "Connexion réussie",
    	"user": gin.H{
        	"id": user.ID,
        	"email": user.Email,
    	},
    })
}

func DeleteUserController(c *gin.Context) {
	var user models.User
	config.DB.Where("id = ?", c.Param("id")).Delete(&user)
	c.JSON(200, &user)
}

func UpdateUserController(c *gin.Context) {
	var user models.User
	config.DB.Where("id = ?", c.Param("id")).First(&user)
	c.BindJSON(&user)
	config.DB.Save(&user)
	c.JSON(200, &user)
}