import { Eye, EyeOff, LockKeyhole, LogIn, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

// Demo mode: there is no real authentication. Any username/password
// (including empty fields) signs in; the name is only used for display.
function initialsFor(name: string) {
  const parts = name.split(/[\s_.-]+/).filter(Boolean)
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase() || 'DA'
}

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [notice, setNotice] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = username.trim() || 'Demo User'
    const storage = keepSignedIn ? localStorage : sessionStorage
    storage.setItem('frost-wms-auth', 'true')
    storage.setItem('frost-wms-user', JSON.stringify({ name, initials: initialsFor(name), role: 'Administrator' }))
    navigate('/', { replace: true })
  }

  return (
    <main className="login-screen">
      <div className="login-overlay" />
      <section className="login-card" aria-label="FROST WMS sign in">
        <div className="login-brand">
          <img className="login-logo" src="/branding/demo-logo.svg" alt="DEMO APP Cold Storage" />
          <p className="login-eyebrow">WELCOME TO DEMO APP</p>
          <h1>TWIN WMS <span>BETA v1.0</span></h1>
          <p className="login-powered">powered by Rapex Technology</p>
        </div>
        <p className="login-tagline">See every pallet, protect every shipment, move frozen goods smarter.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username :</label>
          <div className="login-input-wrap">
            <UserRound aria-hidden="true" />
            <input id="username" autoComplete="username" placeholder="Any username (optional)" value={username} onChange={(event) => { setUsername(event.target.value); setNotice('') }} />
          </div>
          <label htmlFor="password">Password :</label>
          <div className="login-input-wrap">
            <LockKeyhole aria-hidden="true" />
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Any password (optional)" value={password} onChange={(event) => { setPassword(event.target.value); setNotice('') }} />
            <button type="button" className="login-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</button>
          </div>
          <button type="button" className="login-forgot" onClick={() => setNotice('Demo mode: no password needed. Just press Sign in.')}>Forgot password</button>
          {notice && <p className="login-error" role="status">{notice}</p>}
          <button className="login-submit" type="submit"><LogIn />Sign in</button>
          <button className="login-signup" type="button" onClick={() => setNotice('Demo mode: no account needed. Just press Sign in.')}>Sign Up</button>
          <label className="login-remember"><input type="checkbox" checked={keepSignedIn} onChange={(event) => setKeepSignedIn(event.target.checked)} />Keep Sign in</label>
        </form>
        <div className="login-privacy"><p>Privacy</p><span>This is a demo app with sample data only. No account or authentication is required. Press Sign in to explore.</span></div>
      </section>
    </main>
  )
}
