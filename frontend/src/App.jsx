// Import REACT
import { Navigate, Route, Routes } from "react-router-dom"
import PrivateRoute from "./services/PrivateRoute.jsx"

// Import CSS
import "./assets/index.css"
import "./assets/main.css"
import "./assets/home/Header.css"
import "./assets/home/HeroSection.css"
import "./assets/home/VisualSection.css"
import "./assets/home/FeatureSection.css"
import "./assets/home/BannerSection.css"
import "./assets/home/Footer.css"
import "./assets/auth/login.css"

// Import Pages
import HomePage from "./pages/Home.Page"
import ContactPage from "./pages/Contact.Page"
import FeaturePage from "./pages/Feature.Page"
import LoginPage from "./pages/Login.Page"
import SignupPage from "./pages/Signup.Page"
import CloudPage from "./pages/Cloud.Page"

function App() {
  return (
    <main className="home-page">
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/fonctionnalites" element={<FeaturePage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<SignupPage />} />

        <Route 
          path="/cloud" 
          element={
            <PrivateRoute>
              <CloudPage />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default App