import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { loginUser, registerUser } from "../services/API.js"

import Email from "../components/Auth/Signup/EmailSection.jsx"
import Password from "../components/Auth/Signup/PasswordSection.jsx"
import PasswordValid from "../components/Auth/Signup/PasswordSectionValid.jsx"

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)

    try {
      await registerUser(form.email, form.password)
      const response = await loginUser(form.email, form.password)
      localStorage.setItem("auth_token", response.token)
      navigate("/cloud", { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-head">
          <span className="auth-kicker">CloudVault</span>
          <h1>Inscription</h1>
          <p>Créez votre compte pour accéder à votre espace cloud.</p>
        </div>
        
        <Email 
          value={form.email} 
          onChange={(val) => setForm({ ...form, email: val })} 
        />
        
        <Password 
          value={form.password} 
          onChange={(val) => setForm({ ...form, password: val })} 
        />
        
        <PasswordValid 
          value={form.confirmPassword} 
          onChange={(val) => setForm({ ...form, confirmPassword: val })} 
        />

        {error ? <p className="auth-error">{error}</p> : null}
        
        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        <p className="auth-switch">
          Vous avez déjà un compte ? <NavLink to="/connexion">Se connecter</NavLink>
        </p>
      </form>
    </section>
  )
}

export default SignupPage;