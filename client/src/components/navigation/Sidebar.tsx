import { BarChart3, Boxes, Box, ChevronLeft, ChevronRight, ClipboardCheck, House, ListChecks, LogOut, QrCode, Settings, Snowflake, Truck, Users, Warehouse } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useBranding } from '@/lib/branding'

const navigation = [
  { label: 'Dashboard', to: '/', icon: House }, { label: 'Cold Rooms', to: '/warehouse', icon: Snowflake },
  { label: 'Warehouse', to: '/warehouse', icon: Warehouse }, { label: 'Digital Twin', to: '/digital-twin', icon: Box },
  { label: 'Receiving', to: '/receiving', icon: ClipboardCheck }, { label: 'Stock Transfer', to: '/putaway', icon: Truck },
  { label: 'Withdrawal', to: '/outbound', icon: Truck },
  { label: 'Stock Ledger', to: '/inventory', icon: Boxes }, { label: 'Stock Adjustment', to: '/inventory/adjustment', icon: ListChecks },
  { label: 'QR Center', to: '/qrcenter', icon: QrCode },
  { label: 'Stock Ageing', to: '/reports', icon: BarChart3 }, { label: 'Users', to: '/users', icon: Users }, { label: 'Settings', to: '/settings', icon: Settings },
]
export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { logo, title } = useBranding()
  const navigate = useNavigate()
  const logOut = () => {
    localStorage.removeItem('frost-wms-auth')
    localStorage.removeItem('frost-wms-user')
    sessionStorage.removeItem('frost-wms-auth')
    sessionStorage.removeItem('frost-wms-user')
    navigate('/login', { replace: true })
  }
  return <aside className={cn('fixed inset-y-0 left-0 z-30 flex flex-col bg-slate-950 text-slate-300 transition-[width] duration-300', collapsed ? 'w-[76px]' : 'w-64')}>
    <div className="flex h-20 items-center border-b border-slate-800 px-5"><img src={logo} alt="" className="size-9 shrink-0 rounded-lg object-contain bg-white" />{!collapsed && <div className="ml-3 overflow-hidden"><p className="whitespace-nowrap text-sm font-semibold tracking-wide text-white">{title}</p><p className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-slate-500">WMS BETA v1.0</p></div>}</div>
    <nav className="flex-1 space-y-1 px-3 py-5">{navigation.map(({ label, to, icon: Icon }) => <NavLink key={label} to={to} end={to === '/'} title={collapsed ? label : undefined} className={({ isActive }) => cn('group flex h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors', isActive ? 'bg-sky-500 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white')}><Icon className="size-[18px] shrink-0" />{!collapsed && <span className="ml-3 whitespace-nowrap">{label}</span>}</NavLink>)}</nav>
    <div className="border-t border-slate-800 p-3"><button onClick={logOut} title={collapsed ? 'Log out' : undefined} className="flex h-10 w-full items-center justify-center rounded-lg text-red-300 transition-colors hover:bg-red-950/50 hover:text-red-200" aria-label="Log out"><LogOut className="size-4" />{!collapsed && <span className="ml-2 text-xs">Log out</span>}</button><button onClick={onToggle} className="mt-2 flex h-10 w-full items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" aria-label="Toggle sidebar">{collapsed ? <ChevronRight className="size-5" /> : <><ChevronLeft className="size-5" /><span className="ml-2 text-xs">Collapse</span></>}</button></div>
  </aside>
}
