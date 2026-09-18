from rest_framework.permissions import BasePermission


class IsMachineRoomAuthorized(BasePermission):
    """Restricts Machine Room endpoints to Super Admin, Warehouse Manager,
    Supervisor, and Authorized Maintenance roles (Phase W-01 spec §6/§10).
    Structure only — real enforcement needs the login flow that isn't wired
    to auth yet (see pages/LoginPage.tsx)."""

    message = 'Machine Room access is restricted to management and maintenance roles.'

    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser:
            return True
        profile = getattr(user, 'profile', None)
        return bool(profile and profile.can_access_machine_room)
