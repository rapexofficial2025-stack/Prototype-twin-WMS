import { Eye, EyeOff, LockKeyhole, LogIn, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

const DEMO_USERNAME = 'Admin_test'
const DEMO_PASSWORD = 'Admin123'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (username.trim() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      setError('Please check your username and password.')
      return
    }
    const storage = keepSignedIn ? localStorage : sessionStorage
    storage.setItem('frost-wms-auth', 'true')
    navigate('/', { replace: true })
  }

  return (
    <main className="login-screen">
      <div className="login-overlay" />
      <section className="login-card" aria-label="FROST WMS sign in">
        <div className="login-brand">
          <img className="login-logo" src="/branding/antarctica-logo.png" alt="Antarctica Cold Storage" />
          <p className="login-eyebrow">WELCOME TO ANTARCTICA</p>
          <h1>TWIN WMS <span>BETA v1.0</span></h1>
          <p className="login-powered">powered by Rapex Technology</p>
        </div>
        <p className="login-tagline">See every pallet, protect every shipment, move frozen goods smarter.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username :</label>
          <div className="login-input-wrap">
            <UserRound aria-hidden="true" />
            <input id="username" autoComplete="username" placeholder="Enter your username" value={username} onChange={(event) => { setUsername(event.target.value); setError('') }} />
          </div>
          <label htmlFor="password">Password :</label>
          <div className="login-input-wrap">
            <LockKeyhole aria-hidden="true" />
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} />
            <button type="button" className="login-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</button>
          </div>
          <button type="button" className="login-forgot" onClick={() => setError('Please contact the system administrator to reset your password.')}>Forgot password</button>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit"><LogIn />Sign in</button>
          <button className="login-signup" type="button" onClick={() => setError('Account creation is available by administrator approval.')}>Sign Up</button>
          <label className="login-remember"><input type="checkbox" checked={keepSignedIn} onChange={(event) => setKeepSignedIn(event.target.checked)} />Keep Sign in</label>
        </form>
        <div className="login-privacy"><p>Privacy</p><span>This private prototype protects warehouse information and only approved users may sign in.</span></div>
      </section>
    </main>
  )
}
