import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { loginUser } from "../../services/api"

function LoginMain() {
  
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [status, setStatus] = useState({ loading: false, error: "" })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
      e.preventDefault()
      setStatus({ loading: true, error: "" })
  
      try {
        const data = await loginUser(form.email, form.password)
        
        console.log("Connecté !", data)
        
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
  
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="vous@exemple.com"
              required
            />
          </div>
  
          <div className="auth-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
  
          {status.error ? <p className="auth-error">{status.error}</p> : null}
  
          <button className="auth-submit" type="submit" disabled={status.loading}>
            {status.loading ? "Connexion..." : "Se connecter"}
          </button>
  
          <p className="auth-switch">
            Vous n&apos;avez pas de compte ? <NavLink to="/inscription">Créer un compte</NavLink>
          </p>
        </form>
      </section>
    )
  }
  
  export default LoginMain
