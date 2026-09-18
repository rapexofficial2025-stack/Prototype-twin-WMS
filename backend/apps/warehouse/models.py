from django.conf import settings
from django.db import models


class Room(models.Model):
    STATUS_CHOICES = [('operational', 'Operational'), ('warning', 'Warning'), ('maintenance', 'Maintenance'), ('offline', 'Offline')]

    room_number = models.PositiveSmallIntegerField(unique=True)
    room_code = models.CharField(max_length=20, unique=True, null=True, blank=True, help_text='Official FROST room code, e.g. RM101. Backs the rack-level Digital Twin room.')
    room_name = models.CharField(max_length=100)
    room_type = models.CharField(max_length=20, choices=[('dry', 'Dry'), ('frozen', 'Frozen/Anti'), ('chilled', 'Chilled')], default='frozen')
    floor = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='operational')
    capacity_locations = models.PositiveIntegerField(default=0)
    target_temp_c = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    columns_left = models.PositiveSmallIntegerField(default=15)
    columns_right = models.PositiveSmallIntegerField(default=15)
    levels = models.PositiveSmallIntegerField(default=7)
    depth = models.PositiveSmallIntegerField(default=4)

    def __str__(self):
        return self.room_name


class Location(models.Model):
    STATUS_CHOICES = [('empty', 'Empty'), ('occupied', 'Occupied'), ('reserved', 'Reserved'), ('blocked', 'Blocked')]

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='locations')
    side = models.CharField(max_length=5, choices=[('left', 'Left'), ('right', 'Right')])
    column = models.PositiveSmallIntegerField()
    level = models.PositiveSmallIntegerField()
    depth = models.PositiveSmallIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='empty')
    dock_number = models.CharField(max_length=20, blank=True, help_text='Staging dock this location is nearest to, shown to the Checker on scan.')

    class Meta:
        unique_together = ('room', 'side', 'column', 'level', 'depth')
        indexes = [models.Index(fields=['room', 'status'])]

    LEVEL_LETTERS = 'ABCDEFG'
    DEPTHS_PER_LEVEL = 4  # must match Room.depth's default rack geometry

    @property
    def layer(self) -> int:
        """1-indexed position combining level (row) and depth into the
        single 'layer' the FROST location code addresses, e.g. layer 4 of
        column 2. Room/column/layer stay separate fields on this model —
        this is only how they're combined for display."""
        return self.level * self.DEPTHS_PER_LEVEL + self.depth + 1

    @property
    def location_code(self) -> str:
        """FROST official format: ROOM-COLUMN-LAYER, e.g. RM101-CO2-LA4.
        Never hardcode this string elsewhere — always read it from here."""
        room_code = self.room.room_code or f'RM{self.room.room_number}'
        return f'{room_code}-CO{self.column}-LA{self.layer}'

    def __str__(self):
        return self.location_code


class WarehouseArea(models.Model):
    """Master data row for a physical operational area of the facility —
    Cold Storage rooms, Blast Freezers, Anterooms, the Chiller Room, and Dry
    Warehouse bays. This is warehouse structure, not a transaction record;
    Receiving/Withdrawal/Transfer etc. reference these, they don't own them.

    Cold Storage rows optionally link to the rack-level Room used by the
    Digital Twin (columns/levels/depth); the other area types stand alone
    since they don't have that rack geometry."""

    AREA_TYPE_CHOICES = [
        ('cold_storage', 'Cold Storage'),
        ('blast_freezer', 'Blast Freezer'),
        ('anteroom', 'Anteroom'),
        ('chiller_room', 'Chiller Room'),
        ('dry_warehouse', 'Dry Warehouse'),
    ]
    STATUS_CHOICES = Room.STATUS_CHOICES

    area_code = models.CharField(max_length=20, unique=True, help_text='Official FROST room code, e.g. RM101, BF101, CHR101, AR101, DWH301.')
    area_name = models.CharField(max_length=150)
    area_type = models.CharField(max_length=20, choices=AREA_TYPE_CHOICES)
    floor = models.CharField(max_length=20, blank=True)
    capacity = models.PositiveIntegerField(default=0)
    occupied = models.PositiveIntegerField(default=0)
    target_temp_c = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='operational')
    room = models.OneToOneField(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name='warehouse_area', help_text='Linked rack-level Room, for Cold Storage areas backed by the Digital Twin.')

    class Meta:
        ordering = ['area_type', 'area_code']

    @property
    def available(self) -> int:
        return max(self.capacity - self.occupied, 0)

    @property
    def utilization_pct(self) -> float:
        return round((self.occupied / self.capacity) * 100, 1) if self.capacity else 0

    def __str__(self):
        return f'{self.area_code} · {self.area_name}'


class Dock(models.Model):
    """A single Loading Area bay. Structure only for this phase — the
    interactive door visualization and live loading/unloading transactions
    are later work (see Phase W-01 spec §6/§11 and the follow-up docking UI
    request)."""

    STATUS_CHOICES = [('available', 'Available'), ('active', 'Active'), ('reserved', 'Reserved'), ('offline', 'Offline')]
    ACTIVITY_CHOICES = [('idle', 'Idle'), ('loading', 'Loading'), ('unloading', 'Unloading')]

    dock_code = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='available')
    activity = models.CharField(max_length=16, choices=ACTIVITY_CHOICES, default='idle')
    reference = models.CharField(max_length=100, blank=True, help_text='Truck plate / carrier / booking reference currently assigned.')
    activity_started_at = models.DateTimeField(null=True, blank=True, help_text='When the current loading/unloading activity began — used to compute elapsed duration.')

    class Meta:
        ordering = ['dock_code']

    def __str__(self):
        return self.dock_code


class Asset(models.Model):
    """Warehouse equipment master data — structure only for this phase, no
    maintenance workflow yet."""

    ASSET_TYPE_CHOICES = [
        ('forklift', 'Forklift'),
        ('pallet', 'Pallet'),
        ('stacker', 'Stacker'),
        ('motorized_pallet_truck', 'Motorized Pallet Truck'),
        ('battery', 'Battery'),
        ('dock_leveler', 'Dock Leveler'),
        ('weigh_scale', 'Weigh Scale'),
        ('battery_solution', 'Battery Solution'),
        ('other', 'Other Equipment'),
    ]
    STATUS_CHOICES = [('available', 'Available'), ('in_use', 'In Use'), ('maintenance', 'Maintenance'), ('retired', 'Retired')]

    asset_code = models.CharField(max_length=20, unique=True)
    asset_type = models.CharField(max_length=30, choices=ASSET_TYPE_CHOICES)
    brand = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    serial_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='available')
    assigned_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_assets')
    current_location = models.ForeignKey(WarehouseArea, on_delete=models.SET_NULL, null=True, blank=True, related_name='assets')
    maintenance_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['asset_type', 'asset_code']

    def __str__(self):
        return f'{self.asset_code} · {self.get_asset_type_display()}'
