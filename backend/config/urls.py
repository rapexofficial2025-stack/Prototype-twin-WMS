from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/warehouse/', include('apps.warehouse.urls')),
    path('api/stock/', include('apps.stock.urls')),
]
