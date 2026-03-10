import { useEffect, useRef, useState } from "react"
import demoVideo from "../../assets/videos/test.mp4"

const featureIcons = [
  { icon: "/icons/security.svg", label: "Sécurité renforcée", alt: "Icône sécurité" },
  { icon: "/icons/speed.svg", label: "Partage ultra rapide", alt: "Icône vitesse" },
  { icon: "/icons/link.svg", label: "Liens simples à envoyer", alt: "Icône lien" },
  { icon: "/icons/folder.svg", label: "Organisation intelligente", alt: "Icône dossier" },
]

function Main() {
  const videoRef = useRef(null)
  const [videoStatus, setVideoStatus] = useState("En pause")

  useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement) {
      return undefined
    }

    videoElement.muted = true
    videoElement.defaultMuted = true
    videoElement.volume = 0

    const keepMuted = () => {
      videoElement.muted = true
      videoElement.volume = 0
    }

    videoElement.addEventListener("volumechange", keepMuted)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoElement) {
          return
        }

        if (entry.isIntersecting) {
          videoElement.play().catch(() => {
            setVideoStatus("En pause")
          })
          return
        }

        videoElement.pause()
      },
      { threshold: 0.55 }
    )

    observer.observe(videoElement)

    return () => {
      videoElement.removeEventListener("volumechange", keepMuted)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal-on-scroll")

    if (!revealElements.length) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    )

    revealElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleVideoToggle = () => {
    if (!videoRef.current) {
      return
    }

    if (videoRef.current.paused) {
      videoRef.current.play()
      setVideoStatus("En lecture")
      return
    }

    videoRef.current.pause()
    setVideoStatus("En pause")
  }

  return (
    <section className="main-content">
      <section className="hero-panel reveal-on-scroll">
        <div className="hero-copy">
          <span className="hero-badge">Stockage cloud simple et sécurisé</span>
          <h1 className="main-title">Stockez et partagez vos fichiers en ligne, sans friction.</h1>
          <p className="main-description">
            CloudVault vous aide à centraliser vos documents, collaborer rapidement et garder le contrôle sur vos fichiers depuis n&apos;importe où.
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
              <span>accès depuis n&apos;importe quel appareil</span>
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

      <section className="visual-showcase reveal-on-scroll">
        <div className="visual-header">
          <h2>Une expérience moderne, visuelle et intuitive</h2>
          <p>
            Prévisualisez vos fichiers, partagez-les rapidement et améliorez votre image avec une interface claire.
          </p>
        </div>

        <div className="visual-grid">
          <article className="visual-video-wrap">
            <video
              ref={videoRef}
              className="visual-video"
              preload="metadata"
              muted
              playsInline
              onClick={handleVideoToggle}
              onPlay={() => setVideoStatus("En lecture")}
              onPause={() => setVideoStatus("En pause")}
              onEnded={() => setVideoStatus("Terminée")}
            >
              <source src={demoVideo} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
            <span className="visual-status">● {videoStatus}</span>
          </article>

          <article className="visual-text-block">
            <h3>Montrez votre produit en action</h3>
            <p>
              Remplacez cette vidéo par la vôtre pour présenter rapidement CloudVault,
              son interface et ses avantages en moins d&apos;une minute.
            </p>
            <p>
              Cette zone de texte est faite pour ton argumentaire commercial : cas d&apos;usage,
              bénéfices concrets et appel à l&apos;action.
            </p>
          </article>
        </div>

        <div className="icon-row">
          {featureIcons.map((item) => (
            <div key={item.label} className="icon-pill">
              <img
                src={item.icon}
                alt={item.alt}
                className="icon-pill-image"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = "/icons/security.svg"
                }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-grid reveal-on-scroll">
        <article className="feature-card">
          <h2>Un stockage centralisé</h2>
          <p>Gardez tous vos fichiers au même endroit et retrouvez-les en quelques secondes.</p>
        </article>
        <article className="feature-card">
          <h2>Un partage fluide</h2>
          <p>Envoyez un document ou un dossier par lien, sans échanges interminables par email.</p>
        </article>
        <article className="feature-card">
          <h2>Une sécurité rassurante</h2>
          <p>Protégez vos accès et assurez une meilleure maîtrise de vos données en ligne.</p>
        </article>
      </section>

      <section className="sales-banner reveal-on-scroll">
        <div>
          <h2>Passez à une gestion de fichiers plus simple.</h2>
          <p>Moins de perte de temps, plus de clarté, une image plus pro pour vos échanges.</p>
        </div>
        <button type="button" className="main-button">Créer mon espace</button>
      </section>
    </section>
  )
}

export default Main