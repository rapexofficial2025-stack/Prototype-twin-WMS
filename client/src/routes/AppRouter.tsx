import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EnterpriseLayout } from '@/layouts/EnterpriseLayout'
import { DashboardPage } from '@/features/dashboard'
import { RoomDetailPage } from '@/features/warehouse'
import { ReceivingListPage, AddStockPage } from '@/features/receiving'
import { OutboundListPage, WithdrawStockPage } from '@/features/outbound'
import { TransferListPage } from '@/features/putaway'
import { StockLedgerPage, StockAdjustmentPage, PalletEditPage } from '@/features/inventory'
import { StockAgeingPage } from '@/features/reports'
import { SettingsPage } from '@/features/settings'
import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'
const DigitalTwinRoom = lazy(async () => ({ default: (await import('@/pages/DigitalTwinRoom')).DigitalTwinRoom }))
const LoginPage = lazy(async () => ({ default: (await import('@/pages/LoginPage')).LoginPage }))

const placeholders = ['warehouse', 'qrcenter', 'users']

export function AppRouter() {
  return <HashRouter><Routes>
    <Route path="login" element={<Suspense fallback={null}><LoginPage /></Suspense>} />
    <Route element={<EnterpriseLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="warehouse/room/:roomNumber" element={<RoomDetailPage />} />
      <Route path="warehouse/room-1" element={<Navigate to="/warehouse/room/1" replace />} />
      <Route path="digital-twin" element={<Suspense fallback={<div className="grid min-h-96 place-items-center text-sm text-slate-500">Loading Digital Twin…</div>}><DigitalTwinRoom /></Suspense>} />
      <Route path="receiving" element={<ReceivingListPage />} />
      <Route path="receiving/add" element={<AddStockPage />} />
      <Route path="outbound" element={<OutboundListPage />} />
      <Route path="outbound/new" element={<WithdrawStockPage />} />
      <Route path="putaway" element={<TransferListPage />} />
      <Route path="inventory" element={<StockLedgerPage />} />
      <Route path="inventory/adjustment" element={<StockAdjustmentPage />} />
      <Route path="inventory/pallet/:tagNo" element={<PalletEditPage />} />
      <Route path="reports" element={<StockAgeingPage />} />
      <Route path="settings" element={<SettingsPage />} />
      {placeholders.map((feature) => <Route key={feature} path={feature} element={<FeaturePlaceholderPage feature={feature} />} />)}
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></HashRouter>
}
