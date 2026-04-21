package controllers

import (
	"github.com/Juyuroto/cloudvault/config"
	"github.com/Juyuroto/cloudvault/models"
	"github.com/Juyuroto/cloudvault/services"
	
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
	
	hashed, _ := services.HashPassword(user.Password)
    user.Password = hashed
    
    token, err := services.GenerateToken(user.Email)
    if err != nil {
        c.JSON(500, gin.H{"error": "Erreur génération token"})
        return
    }
    
    user.Token = token
	
    if err := config.DB.Create(&user).Error; err != nil {
        c.JSON(400, gin.H{"error": "Impossible de créer l'utilisateur"})
        return
    }
	
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
    
    if !services.CheckPasswordHash(input.Password, user.Password) {
        c.JSON(401, gin.H{"error": "Identifiants incorrects"})
        return
    }
    
    newToken, _ := services.GenerateToken(user.Email)
    
    config.DB.Model(&user).Update("Token", newToken)
        
    c.JSON(200, gin.H{
    	"message": "Connexion réussie",
     	"token": newToken,
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