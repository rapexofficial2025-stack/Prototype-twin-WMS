from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    """Role assignment for access control (e.g. gating the Warehouse
    module's Machine Room). Prototype foundation only — the login flow this
    plugs into isn't wired up to real auth yet, see pages/LoginPage.tsx."""

    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('warehouse_manager', 'Warehouse Manager'),
        ('supervisor', 'Supervisor'),
        ('maintenance', 'Authorized Maintenance'),
        ('checker', 'Checker'),
        ('operator', 'Warehouse Operator'),
        ('viewer', 'Viewer'),
    ]
    MACHINE_ROOM_ROLES = {'super_admin', 'warehouse_manager', 'supervisor', 'maintenance'}

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')

    @property
    def can_access_machine_room(self) -> bool:
        return self.role in self.MACHINE_ROOM_ROLES

    def __str__(self):
        return f'{self.user.get_username()} · {self.get_role_display()}'


class Customer(models.Model):
    customer_no = models.CharField(max_length=32, unique=True)
    customer_name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=16, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')

    def __str__(self):
        return self.customer_name


class Item(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='items')
    item_name = models.CharField(max_length=200)
    item_group = models.CharField(max_length=100, blank=True)
    packaging = models.CharField(max_length=50, blank=True)
    default_avg_weight = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.item_name
