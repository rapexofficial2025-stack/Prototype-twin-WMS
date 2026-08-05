from django.db import models


class Room(models.Model):
    room_number = models.PositiveSmallIntegerField(unique=True)
    room_name = models.CharField(max_length=100)
    room_type = models.CharField(max_length=20, choices=[('dry', 'Dry'), ('frozen', 'Frozen/Anti'), ('chilled', 'Chilled')], default='frozen')
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

    @property
    def location_code(self) -> str:
        return f'RM{self.room.room_number}-CO{self.column}-L{self.level}-D{self.depth}'

    def __str__(self):
        return self.location_code
