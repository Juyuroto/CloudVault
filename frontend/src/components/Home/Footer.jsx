import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-footer-section">
        <h2 className="home-footer-title">CloudVault</h2>
        <p className="home-footer-text">
          Une plateforme simple pour stocker, organiser et protéger tes fichiers en ligne.
        </p>
      </div>

      <div className="home-footer-section">
        <h3 className="home-footer-heading">Navigation</h3>
        <div className="home-footer-links">
          <Link to="/" className="home-footer-link">Accueil</Link>
          <Link to="/fonctionnalites" className="home-footer-link">Fonctionnalités</Link>
          <Link to="/contact" className="home-footer-link">Contact</Link>
        </div>
      </div>

      <div className="home-footer-section">
        <h3 className="home-footer-heading">Contact</h3>
        <p className="home-footer-text">support@cloudvault.app</p>
        <p className="home-footer-copy">© 2026 CloudVault. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer