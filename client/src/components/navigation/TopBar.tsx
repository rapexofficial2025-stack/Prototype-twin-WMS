import { Bell, ChevronDown, LogOut, Moon, Search, Settings } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function TopBar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const storedUser = localStorage.getItem('frost-wms-user')
  const user = storedUser ? JSON.parse(storedUser) as { name?: string; initials?: string; role?: string } : null
  const name = user?.name ?? 'Admin_test'
  const initials = user?.initials ?? 'AT'
  const role = user?.role ?? 'Administrator'

  const logOut = () => {
    localStorage.removeItem('frost-wms-auth')
    localStorage.removeItem('frost-wms-user')
    sessionStorage.removeItem('frost-wms-auth')
    sessionStorage.removeItem('frost-wms-user')
    navigate('/login', { replace: true })
  }

  return <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-6 lg:px-8"><div className="relative hidden w-full max-w-md md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" /><input aria-label="Search" placeholder="Search rooms, pallets, shipments..." className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-950" /></div><div className="ml-auto flex items-center gap-2"><button className="icon-button text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Toggle theme"><Moon className="size-4" /></button><button className="icon-button relative text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Notifications"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-orange-500" /></button><div className="relative ml-2 border-l border-slate-800 pl-4"><button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-haspopup="menu" className="flex items-center rounded-lg p-1 text-left hover:bg-slate-800"><div className="grid size-9 place-items-center rounded-full bg-sky-950 text-sm font-semibold text-sky-300">{initials}</div><div className="ml-3 hidden lg:block"><p className="text-sm font-semibold text-slate-100">{name}</p><p className="text-xs text-slate-500">{role}</p></div><ChevronDown className="ml-2 size-4 text-slate-500" /></button>{menuOpen && <div role="menu" className="absolute right-0 top-14 w-56 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"><button type="button" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/settings') }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-slate-800"><Settings className="size-4 text-slate-400" />Account Settings</button><button type="button" role="menuitem" onClick={logOut} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-300 hover:bg-red-950/50"><LogOut className="size-4" />Log out</button></div>}</div></div></header>
}
