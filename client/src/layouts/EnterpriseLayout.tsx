import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/navigation/Sidebar'
import { TopBar } from '@/components/navigation/TopBar'

export function EnterpriseLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return <div className="min-h-screen bg-slate-950">
    <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
    <main className={`min-h-screen transition-[margin] duration-300 ${collapsed ? 'ml-[76px]' : 'ml-64'}`}>
      <TopBar />
      <div className="mx-auto max-w-[1800px] p-6 lg:p-8"><Outlet /></div>
    </main>
  </div>
}
