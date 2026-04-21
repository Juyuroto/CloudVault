function PasswordSection({ value, onChange }) {
  return (
    <div className="auth-field">
      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        name="password"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        required
      />
    </div>
  )
}

export default PasswordSection