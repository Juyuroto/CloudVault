function EmailSection({ value, onChange }) {
  return (
    <div className="auth-field">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="vous@exemple.com"
        required
      />
    </div>
  )
}

export default EmailSection