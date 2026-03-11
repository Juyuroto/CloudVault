function ContactMain() {
  return (
    <section className="main-content">
      <section className="hero-panel reveal-on-scroll is-visible">
        <div className="hero-copy">
          <span className="hero-badge">Contact CloudVault</span>
          <h1 className="main-title">Parlons de votre projet.</h1>
          <p className="main-description">
            Une question sur la plateforme, une démo ou un besoin spécifique ?
            Notre équipe vous répond rapidement.
          </p>

          <div className="hero-stats">
            <div className="stat-card">
              <strong>Email</strong>
              <span>support@cloudvault.app</span>
            </div>
            <div className="stat-card">
              <strong>Réponse</strong>
              <span>en moins de 24h</span>
            </div>
            <div className="stat-card">
              <strong>Disponibilité</strong>
              <span>du lundi au vendredi</span>
            </div>
          </div>
        </div>

        <aside className="hero-showcase">
          <div className="showcase-card">
            <p className="showcase-label">Nous écrire</p>
            <h2 className="showcase-title">Coordonnées de contact</h2>
            <ul className="showcase-list">
              <li>
                <span className="showcase-item-title">Support technique</span>
                <span className="showcase-item-text">support@cloudvault.app</span>
              </li>
              <li>
                <span className="showcase-item-title">Partenariats</span>
                <span className="showcase-item-text">partners@cloudvault.app</span>
              </li>
              <li>
                <span className="showcase-item-title">Téléphone</span>
                <span className="showcase-item-text">+41 00 000 00 00</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </section>
  )
}

export default ContactMain
