import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EnterpriseLayout } from '@/layouts/EnterpriseLayout'
import { DashboardPage } from '@/features/dashboard'
import { RoomDetailPage } from '@/features/warehouse'
import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'
const DigitalTwinRoom = lazy(async () => ({ default: (await import('@/pages/DigitalTwinRoom')).DigitalTwinRoom }))

const placeholders = ['warehouse', 'inventory', 'receiving', 'putaway', 'outbound', 'qrcenter', 'reports', 'users', 'settings']

export function AppRouter() {
  return <BrowserRouter><Routes>
    <Route element={<EnterpriseLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="warehouse/room-1" element={<RoomDetailPage />} />
      <Route path="digital-twin" element={<Suspense fallback={<div className="grid min-h-96 place-items-center text-sm text-slate-500">Loading Digital Twin…</div>}><DigitalTwinRoom /></Suspense>} />
      {placeholders.map((feature) => <Route key={feature} path={feature} element={<FeaturePlaceholderPage feature={feature} />} />)}
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>
}
