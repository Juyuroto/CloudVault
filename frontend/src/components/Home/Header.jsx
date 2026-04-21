import { useEffect, useRef, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

function Header() {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)
  const navigate = useNavigate()

  // On récupère le token pour savoir si l'utilisateur est connecté
  const isAuthenticated = localStorage.getItem("auth_token")

  const navClassName = ({ isActive }) =>
    `home-nav-link ${isActive ? "home-nav-link--active" : ""}`

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    navigate("/") // Retour à l'accueil
  }

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      const diff = current - lastScrollY.current

      if (current <= 20) setIsHidden(false)
      else if (Math.abs(diff) > 6) setIsHidden(diff > 0)

      lastScrollY.current = current
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`home-header ${isHidden ? "home-header--hidden" : ""}`}>
      <div className="home-brand">CloudVault</div>
      
      <nav className="home-nav" aria-label="Navigation principale">
        <NavLink to="/" end className={navClassName}>Accueil</NavLink>
        <NavLink to="/fonctionnalites" className={navClassName}>Fonctionnalités</NavLink>
        <NavLink to="/contact" className={navClassName}>Contact</NavLink>
        
        {/* Si connecté, on peut aussi ajouter le lien Cloud dans la nav centrale */}
        {isAuthenticated && (
          <NavLink to="/cloud" className={navClassName}>Mon Cloud</NavLink>
        )}
      </nav>

      {/* Remplacement dynamique du bouton de droite */}
      {isAuthenticated ? (
        <div className="home-header-auth-group">
          <button onClick={handleLogout} className="home-header-button logout-btn">
            Déconnexion
          </button>
        </div>
      ) : (
        <NavLink to="/connexion" className="home-header-button">
          Connexion
        </NavLink>
      )}
    </header>
  )
}

export default Header