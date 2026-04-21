function HeroSection() {
  return (
    <section className="hero-panel reveal-on-scroll">
      <div className="hero-copy">
        <span className="hero-badge">Stockage cloud simple et sécurisé</span>
        <h1 className="main-title">Stockez et partagez vos fichiers en ligne, sans friction.</h1>
        <p className="main-description">
          CloudVault vous aide à centraliser vos documents, collaborer rapidement et garder le contrôle sur vos fichiers depuis n'importe où.
        </p>

        <div className="hero-actions">
          <button type="button" className="main-button">Essayer maintenant</button>
          <button type="button" className="main-button secondary-button">Voir la démo</button>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <strong>10x</strong>
            <span>plus rapide pour partager un document</span>
          </div>
          <div className="stat-card">
            <strong>100%</strong>
            <span>de vos fichiers accessibles en ligne</span>
          </div>
          <div className="stat-card">
            <strong>24/7</strong>
            <span>accès depuis n'importe quel appareil</span>
          </div>
        </div>
      </div>

      <aside className="hero-showcase">
        <div className="showcase-card">
          <p className="showcase-label">Pourquoi CloudVault ?</p>
          <h2 className="showcase-title">Un espace unique pour gérer, partager et sécuriser vos fichiers.</h2>
          <p className="showcase-intro">
            Conçu pour les équipes qui veulent aller vite sans sacrifier la sécurité.
          </p>
          <ul className="showcase-list">
            <li>
              <span className="showcase-item-title">Import instantané</span>
              <span className="showcase-item-text">Glissez vos fichiers, ils sont organisés en quelques secondes.</span>
            </li>
            <li>
              <span className="showcase-item-title">Partage contrôlé</span>
              <span className="showcase-item-text">Envoyez des liens clairs avec un accès maîtrisé.</span>
            </li>
            <li>
              <span className="showcase-item-title">Protection renforcée</span>
              <span className="showcase-item-text">Gardez vos données sensibles dans un environnement fiable.</span>
            </li>
            <li>
              <span className="showcase-item-title">Adoption rapide</span>
              <span className="showcase-item-text">Une interface simple pour vous et vos équipes dès le premier jour.</span>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  )
}

export default HeroSection