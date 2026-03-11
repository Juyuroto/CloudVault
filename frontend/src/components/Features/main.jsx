function FeaturesMain() {
  return (
    <section className="main-content">
      <section className="hero-panel reveal-on-scroll is-visible">
        <div className="hero-copy">
          <span className="hero-badge">Fonctionnalités CloudVault</span>
          <h1 className="main-title">Tout ce qu’il faut pour gérer vos fichiers efficacement.</h1>
          <p className="main-description">
            Découvrez les fonctions clés de CloudVault pour stocker, partager et protéger vos données au quotidien.
          </p>
        </div>

        <aside className="hero-showcase">
          <div className="showcase-card">
            <p className="showcase-label">Vue d’ensemble</p>
            <h2 className="showcase-title">Des outils simples, pensés pour la productivité.</h2>
            <ul className="showcase-list">
              <li>
                <span className="showcase-item-title">Upload rapide</span>
                <span className="showcase-item-text">Ajoutez vos fichiers en quelques secondes.</span>
              </li>
              <li>
                <span className="showcase-item-title">Partage sécurisé</span>
                <span className="showcase-item-text">Générez des liens de partage contrôlés.</span>
              </li>
              <li>
                <span className="showcase-item-title">Organisation claire</span>
                <span className="showcase-item-text">Classez vos dossiers pour tout retrouver facilement.</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h2>Stockage centralisé</h2>
          <p>Conservez tous vos documents dans un espace unique et accessible.</p>
        </article>
        <article className="feature-card">
          <h2>Partage intelligent</h2>
          <p>Envoyez des fichiers avec des liens simples et faciles à gérer.</p>
        </article>
        <article className="feature-card">
          <h2>Protection des accès</h2>
          <p>Gardez le contrôle de vos données avec une sécurité renforcée.</p>
        </article>
      </section>
    </section>
  )
}

export default FeaturesMain
