import pandas as pd
from django.core.management.base import BaseCommand
from core.models import SalesData

class Command(BaseCommand):
    help = 'Import sales data from an Excel file'

    def handle(self, *args, **kwargs):
        data_path = 'datasets/data_sales.xlsx' # Path to the dataset file
        data_sales = pd.read_excel(data_path)

        for _, row in data_sales.iterrows():
            SalesData.objects.create(
                retailer=row['Retailer'],
                retailer_id=row['Retailer ID'],
                invoice_date=row['Invoice Date'],
                region=row['Region'],
                state=row['State'],
                city=row['City'],
                product=row['Product'],
                price_per_unit=row['Price per Unit'],
                units_sold=row['Units Sold'],
                total_sales=row['Total Sales'],
                operating_profit=row['Operating Profit'],
                sales_method=row['Sales Method']
            )
        self.stdout.write(self.style.SUCCESS('Successfully imported sales data'))
