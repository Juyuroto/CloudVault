import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { loginUser } from "../services/API.js"

import Email from "../components/Auth/Login/EmailSection.jsx"
import Password from "../components/Auth/Login/PasswordSection.jsx"


function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [status, setStatus] = useState({ loading: false, error: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log("Envoi au serveur :", form);
    
    setStatus({ loading: true, error: "" })

    try {
      const data = await loginUser(form.email, form.password)
      
      localStorage.setItem("auth_token", data.token)
            
      navigate("/cloud", { replace: true })
    } catch (err) {
      setStatus({ loading: false, error: err.message })
    }
  }
  
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-head">
          <span className="auth-kicker">CloudVault</span>
          <h1>Connexion</h1>
          <p>Connectez-vous à votre espace pour gérer vos fichiers.</p>
        </div>

        <Email value={form.email} 
          onChange={(val) => setForm({...form, email: val})}/>

        <Password value={form.password} 
          onChange={(val) => setForm({...form, password: val})} />

        {status.error ? <p className="auth-error">{status.error}</p> : null}

        <button className="auth-submit" type="submit" disabled={status.loading}>
          {status.loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="auth-switch">
          Vous n'avez pas de compte ? <NavLink to="/inscription">Créer un compte</NavLink>
        </p>
      </form>
    </section>
  )
}

export default LoginPage;