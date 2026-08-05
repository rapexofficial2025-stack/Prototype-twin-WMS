from django.contrib import admin

from apps.core.models import Customer, Item


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['customer_no', 'customer_name', 'status']


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['item_name', 'customer', 'item_group', 'packaging']
