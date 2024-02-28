from django.urls import path
from . import views
from .views import DashboardView, sales_by_retailer, sales_by_method, sales_by_product


urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard-home'),
    path('sales-by-retailer/', sales_by_retailer, name='sales-by-retailer'),
    path('sales-by-method/', sales_by_method, name='sales-by-method'),
    path('sales_by_product/', sales_by_product, name='sales_by_product'),
]