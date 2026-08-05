from django.db import models


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
