import type { AssetApi } from '@/features/warehouse/types/module'

export const mockAssets: AssetApi[] = [
  { id: 1, assetCode: 'FLT-01', assetType: 'forklift', brand: 'Toyota', model: '8FBE20', serialNumber: 'TY-88213', status: 'in_use', assignedUser: 'Alex Morgan', currentLocation: 'DOCK-02', maintenanceDate: '2026-09-15', notes: '' },
  { id: 2, assetCode: 'FLT-02', assetType: 'forklift', brand: 'Toyota', model: '8FBE20', serialNumber: 'TY-88214', status: 'available', assignedUser: null, currentLocation: 'RM101', maintenanceDate: '2026-10-02', notes: '' },
  { id: 3, assetCode: 'STK-01', assetType: 'stacker', brand: 'Crown', model: 'SP 3500', serialNumber: 'CR-40921', status: 'available', assignedUser: null, currentLocation: 'DWH301', maintenanceDate: null, notes: '' },
  { id: 4, assetCode: 'MPT-01', assetType: 'motorized_pallet_truck', brand: 'Hyster', model: 'P2.0', serialNumber: 'HY-11045', status: 'maintenance', assignedUser: null, currentLocation: null, maintenanceDate: '2026-08-14', notes: 'Battery contactor replacement in progress' },
  { id: 5, assetCode: 'BAT-01', assetType: 'battery', brand: 'EnerSys', model: 'IronClad', serialNumber: 'ES-77302', status: 'in_use', assignedUser: null, currentLocation: 'FLT-01', maintenanceDate: null, notes: '' },
  { id: 6, assetCode: 'DL-01', assetType: 'dock_leveler', brand: 'Rite-Hite', model: 'LP Series', serialNumber: 'RH-20938', status: 'available', assignedUser: null, currentLocation: 'DOCK-01', maintenanceDate: null, notes: '' },
  { id: 7, assetCode: 'WS-01', assetType: 'weigh_scale', brand: 'Mettler Toledo', model: 'PBK', serialNumber: 'MT-55210', status: 'available', assignedUser: null, currentLocation: 'DWH302', maintenanceDate: null, notes: '' },
  { id: 8, assetCode: 'PLT-01', assetType: 'pallet', brand: '', model: 'CHEP Standard', serialNumber: '', status: 'in_use', assignedUser: null, currentLocation: 'RM201', maintenanceDate: null, notes: '' },
]
