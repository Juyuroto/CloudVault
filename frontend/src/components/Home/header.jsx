import { useEffect, useRef, useState } from "react"

function Header() {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

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
        <a href="#" className="home-nav-link">Accueil</a>
        <a href="#" className="home-nav-link">Fonctionnalités</a>
        <a href="#" className="home-nav-link">Contact</a>
      </nav>
      <button type="button" className="home-header-button">Connexion</button>
    </header>
  )
}

export default Header