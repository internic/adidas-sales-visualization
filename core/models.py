from django.db import models





class SalesData(models.Model):
    retailer = models.CharField(max_length=255)
    retailer_id = models.IntegerField()
    invoice_date = models.DateField()
    region = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    product = models.CharField(max_length=255)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    units_sold = models.IntegerField()
    total_sales = models.IntegerField()
    operating_profit = models.IntegerField()
    sales_method = models.CharField(max_length=255)

    def __str__(self):
        return self.retailer
