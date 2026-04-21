import { useEffect, useRef, useState } from "react"
import demoVideo from "../../assets/videos/test.mp4"

const featureIcons = [
  { icon: "/icons/security.svg", label: "Sécurité renforcée", alt: "Icône sécurité" },
  { icon: "/icons/speed.svg", label: "Partage ultra rapide", alt: "Icône vitesse" },
  { icon: "/icons/link.svg", label: "Liens simples à envoyer", alt: "Icône lien" },
  { icon: "/icons/folder.svg", label: "Organisation intelligente", alt: "Icône dossier" },
]

function FeaturesSection() {
  
  const videoRef = useRef(null);
  const [videoStatus, setVideoStatus] = useState("En pause");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === videoRef.current) {

          if (entry.isIntersecting) {
            entry.target.play().catch(() => { });
          } else {
            entry.target.pause();
          }
        } else if (entry.isIntersecting) {

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (videoRef.current) observer.observe(videoRef.current);
    document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
  }, []);

  const handleVideoToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };
  
  return (
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
            son interface et ses avantages en moins d'une minute.
          </p>
          <p>
            Cette zone de texte est faite pour ton argumentaire commercial : cas d'usage,
            bénéfices concrets et appel à l'action.
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
  )
}

export default FeaturesSection