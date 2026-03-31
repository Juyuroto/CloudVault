// Import CSS
import "./assets/index.css"
import "./assets/home/header.css"
import "./assets/home/main.css"
import "./assets/home/footer.css"
import "./assets/auth/login.css"

// Import components
import { Navigate, Route, Routes } from "react-router-dom"
import Header from "./components/Home/header"
import HomeMain from "./components/Home/main"
import FeaturesMain from "./components/Features/main"
import ContactMain from "./components/Contact/main"
import LoginMain from "./components/Auth/main"
import Gestion from "./components/Cloud/main"
import SignupMain from "./components/Auth/signup"
import Footer from "./components/Home/footer"

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("auth_token"))

  return (
    <main className="home-page">
      <Header />
      <Routes>
        <Route path="/" element={<HomeMain />} />
        <Route path="/fonctionnalites" element={<FeaturesMain />} />
        <Route path="/contact" element={<ContactMain />} />
        <Route path="/cloud" element={<Gestion />} />
        <Route path="/connexion" element={isLoggedIn ? <Navigate to="/cloud" replace /> : <LoginMain />} />
        <Route path="/inscription" element={isLoggedIn ? <Navigate to="/cloud" replace /> : <SignupMain />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </main>
  )
}

export default App