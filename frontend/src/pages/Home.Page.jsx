import Header from "../components/Home/Header.jsx"
import HeroSection from "../components/Home/HeroSection.jsx"
import VisualSection from "../components/Home/VisualSection.jsx"
import FeatureSection from "../components/Home/FeatureSection.jsx"
import BannerSection from "../components/Home/BannerSection.jsx"
import Footer from "../components/Home/Footer.jsx"

function HomePage() {
  return (
    <>
      <Header />
      <section className="main-content">
        <HeroSection />
        <VisualSection />
        <FeatureSection />
        <BannerSection />
      </section>
      <Footer />
    </>
  )
}

export default HomePage;