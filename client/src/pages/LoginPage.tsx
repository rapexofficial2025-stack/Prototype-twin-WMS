import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, LogIn, User } from 'lucide-react'
import { useBranding } from '@/lib/branding'

export function LoginPage() {
  const { logo, title, subtitle } = useBranding()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    navigate('/')
  }

  return (
    <div className="relative min-h-screen bg-slate-950">
      <img src="/branding/facility.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="" className="size-16 rounded-xl bg-white object-contain p-1.5" />
            <h1 className="mt-4 text-lg font-semibold text-white">{title}</h1>
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          </div>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">Email or Username</span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 focus-within:border-sky-400">
                <User className="size-4 text-slate-500" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" required className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="you@antarcticacoldstorage.com" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">Password</span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 focus-within:border-sky-400">
                <Lock className="size-4 text-slate-500" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="••••••••" />
              </div>
            </label>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600">
              <LogIn className="size-4" />Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-[11px] text-slate-500">Prototype login — not yet connected to real authentication.</p>
        </div>
      </div>
    </div>
  )
}
