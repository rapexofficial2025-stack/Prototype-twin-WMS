import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EnterpriseLayout } from '@/layouts/EnterpriseLayout'
import { DashboardPage } from '@/features/dashboard'
import { RoomDetailPage } from '@/features/warehouse'
import { ReceivingListPage } from '@/features/receiving'
import { OutboundListPage } from '@/features/outbound'
import { TransferListPage } from '@/features/putaway'
import { StockLedgerPage, StockAdjustmentPage } from '@/features/inventory'
import { StockAgeingPage } from '@/features/reports'
import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'
const DigitalTwinRoom = lazy(async () => ({ default: (await import('@/pages/DigitalTwinRoom')).DigitalTwinRoom }))

const placeholders = ['warehouse', 'qrcenter', 'users', 'settings']

export function AppRouter() {
  return <HashRouter><Routes>
    <Route element={<EnterpriseLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="warehouse/room-1" element={<RoomDetailPage />} />
      <Route path="digital-twin" element={<Suspense fallback={<div className="grid min-h-96 place-items-center text-sm text-slate-500">Loading Digital Twin…</div>}><DigitalTwinRoom /></Suspense>} />
      <Route path="receiving" element={<ReceivingListPage />} />
      <Route path="outbound" element={<OutboundListPage />} />
      <Route path="putaway" element={<TransferListPage />} />
      <Route path="inventory" element={<StockLedgerPage />} />
      <Route path="inventory/adjustment" element={<StockAdjustmentPage />} />
      <Route path="reports" element={<StockAgeingPage />} />
      {placeholders.map((feature) => <Route key={feature} path={feature} element={<FeaturePlaceholderPage feature={feature} />} />)}
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></HashRouter>
}
