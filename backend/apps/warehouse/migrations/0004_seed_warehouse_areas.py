from django.db import migrations

# Phase W-01 official room codes. Do not add rooms here beyond what the
# module spec lists — Room Master Data (apps.warehouse.models.WarehouseArea)
# is meant to let admins add future rooms without a code change/migration.
COLD_STORAGE_CODES = ['RM101', 'RM201', 'RM301']
BLAST_FREEZER_CODES = ['BF101', 'BF102']
CHILLER_ROOM_CODES = ['CHR101', 'CHR102', 'CHR201']
ANTEROOM_CODES = ['AR101', 'AR102', 'AR201']
DRY_WAREHOUSE_CODES = ['DWH301', 'DWH302', 'DWH303']

# The Loading Area dock count/codes aren't specified as "official" in the
# spec (unlike the room codes above); seeded to match the mock UI already
# shipped in the Warehouse tab (Phase before W-01).
DOCK_CODES = ['DOCK-01', 'DOCK-02', 'DOCK-03', 'DOCK-04', 'DOCK-05', 'DOCK-06']


def seed_warehouse_areas(apps, schema_editor):
    Room = apps.get_model('warehouse', 'Room')
    WarehouseArea = apps.get_model('warehouse', 'WarehouseArea')
    Dock = apps.get_model('warehouse', 'Dock')

    for code in COLD_STORAGE_CODES:
        room_number = int(code[2:])
        room, _ = Room.objects.get_or_create(
            room_number=room_number,
            defaults={'room_name': f'Cold Room {room_number}', 'room_code': code, 'room_type': 'frozen'},
        )
        if not room.room_code:
            room.room_code = code
            room.save(update_fields=['room_code'])
        WarehouseArea.objects.get_or_create(
            area_code=code,
            defaults={'area_name': f'Cold Room {room_number}', 'area_type': 'cold_storage', 'room_id': room.id, 'capacity': room.capacity_locations},
        )

    for code in BLAST_FREEZER_CODES:
        WarehouseArea.objects.get_or_create(area_code=code, defaults={'area_name': f'Blast Freezer {code[2:]}', 'area_type': 'blast_freezer'})

    for code in CHILLER_ROOM_CODES:
        WarehouseArea.objects.get_or_create(area_code=code, defaults={'area_name': f'Chiller Room {code[3:]}', 'area_type': 'chiller_room'})

    for code in ANTEROOM_CODES:
        WarehouseArea.objects.get_or_create(area_code=code, defaults={'area_name': f'Anteroom {code[2:]}', 'area_type': 'anteroom'})

    for code in DRY_WAREHOUSE_CODES:
        WarehouseArea.objects.get_or_create(area_code=code, defaults={'area_name': f'Dry Warehouse {code[3:]}', 'area_type': 'dry_warehouse'})

    for code in DOCK_CODES:
        Dock.objects.get_or_create(dock_code=code)


def unseed_warehouse_areas(apps, schema_editor):
    WarehouseArea = apps.get_model('warehouse', 'WarehouseArea')
    Dock = apps.get_model('warehouse', 'Dock')
    all_codes = COLD_STORAGE_CODES + BLAST_FREEZER_CODES + CHILLER_ROOM_CODES + ANTEROOM_CODES + DRY_WAREHOUSE_CODES
    WarehouseArea.objects.filter(area_code__in=all_codes).delete()
    Dock.objects.filter(dock_code__in=DOCK_CODES).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0003_dock_room_floor_room_room_code_room_status_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_warehouse_areas, unseed_warehouse_areas),
    ]
