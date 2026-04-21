import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { loginUser, registerUser } from "../../services/api"

function SignupMain() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

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

        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="vous@exemple.com" required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Mot de passe</label>
          <input id="signup-password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimum 6 caractères" required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-confirm-password">Confirmer le mot de passe</label>
          <input id="signup-confirm-password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Répétez votre mot de passe" required
          />
        </div>

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

export default SignupMain
