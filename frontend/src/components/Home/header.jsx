import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"

function Header() {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  const navClassName = ({ isActive }) =>
    `home-nav-link ${isActive ? "home-nav-link--active" : ""}`

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 20) {
        setIsHidden(false)
        lastScrollY.current = currentScrollY
        return
      }

      if (currentScrollY > lastScrollY.current + 6) {
        setIsHidden(true)
      } else if (currentScrollY < lastScrollY.current - 6) {
        setIsHidden(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header className={`home-header ${isHidden ? "home-header--hidden" : ""}`}>
      <div className="home-brand">CloudVault</div>
      <nav className="home-nav" aria-label="Navigation principale">
        <NavLink to="/" end className={navClassName}>Accueil</NavLink>
        <NavLink to="/fonctionnalites" className={navClassName}>Fonctionnalités</NavLink>
        <NavLink to="/contact" className={navClassName}>Contact</NavLink>
      </nav>
      <button type="button" className="home-header-button">Connexion</button>
    </header>
  )
}

export default Header