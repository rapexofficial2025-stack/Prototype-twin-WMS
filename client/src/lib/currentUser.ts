export type UserRole = 'super_admin' | 'warehouse_manager' | 'supervisor' | 'maintenance' | 'checker' | 'operator' | 'viewer'

export const MACHINE_ROOM_ROLES: UserRole[] = ['super_admin', 'warehouse_manager', 'supervisor', 'maintenance']

/**
 * Prototype-only stand-in for the logged-in user until real auth is wired
 * up (see pages/LoginPage.tsx) — matches the "Alex Morgan / Warehouse
 * Manager" identity already shown in TopBar.tsx.
 */
export const currentUser = { name: 'Alex Morgan', role: 'warehouse_manager' as UserRole }

export function canAccessMachineRoom(role: UserRole = currentUser.role): boolean {
  return MACHINE_ROOM_ROLES.includes(role)
}
