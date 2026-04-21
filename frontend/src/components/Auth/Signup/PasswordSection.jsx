function PasswordSection({ value, onChange }) {
  
  return (
    <div className="auth-field">
      <label htmlFor="signup-password">Mot de passe</label>
      <input id="signup-password"
        name="password"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Minimum 6 caractères" required
      />
    </div>
  )
}

export default PasswordSection