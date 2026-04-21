import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"

function Header() {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  const navClassName = ({ isActive }) =>
    `home-nav-link ${isActive ? "home-nav-link--active" : ""}`

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
      </nav>
      <NavLink to="/connexion" className="home-header-button">Connexion</NavLink>
    </header>
  )
}

export default Header