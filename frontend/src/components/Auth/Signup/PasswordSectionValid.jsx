function PasswordValidSection({ value, onChange }) {
  
  return (
    <div className="auth-field">
      <label htmlFor="signup-confirm-password">Confirmer le mot de passe</label>
      <input id="signup-confirm-password"
        name="confirmPassword"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Répétez votre mot de passe" required
      />
    </div>
  )
}

export default PasswordValidSection