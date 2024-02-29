from django.shortcuts import render
from django.views.generic import TemplateView
from django.db.models import F, Sum, Avg
from .models import SalesData
import json
from django.http import JsonResponse
from itertools import islice
from django.db.models.functions import TruncMonth
import datetime



class DashboardView(TemplateView):
    template_name = 'home_page.html'
    
    def chunked_iterable(self, iterable, size):
        """Yield successive chunks from iterable of length size."""
        it = iter(iterable)
        chunk = list(islice(it, size))
        while chunk:
            yield chunk
            chunk = list(islice(it, size))
            

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # retailer profits data
        profits_data = SalesData.objects.values('retailer').annotate(total_profit=Sum('operating_profit')).order_by('-total_profit')
        
        # Use the chunk method to divide profits_data into chunks of three
        chunked_profits_data = list(self.chunked_iterable(profits_data, 4))
        
        
        # Define sales method to color mapping here
        sales_method_colors = {
            'Online': 'bg-pink',
            'In-store': 'bg-teal',
            'Outlet': 'bg-primary',
        }
        
        # Sales distribution by sales method
        sales_distribution = SalesData.objects.values('sales_method').annotate(total_sales=Sum('total_sales'))
        total_sales = sum([item['total_sales'] for item in sales_distribution])

        # Calculate percentages and add color to each item
        for item in sales_distribution:
            item['percentage'] = (item['total_sales'] / total_sales) * 100
            # Assign the color based on the sales method
            item['color'] = sales_method_colors.get(item['sales_method'], 'bg-secondary')  # Default to bg-secondary if not found

        
        product_profits = SalesData.objects.values('product').annotate(
            profit_per_product=Sum(F('operating_profit'))
        ).order_by('-profit_per_product')
        
        
        # Aggregate total sales and operating profit by region
        sales_profit_by_region = SalesData.objects.values('region').annotate(
            total_sales=Sum('total_sales'),
            total_profit=Sum('operating_profit')
        ).order_by('region')
        
        
        # Calculations
        context['total_sales_revenue'] = SalesData.objects.aggregate(total_revenue=Sum('total_sales'))['total_revenue']
        context['total_units_sold'] = SalesData.objects.aggregate(total_units=Sum('units_sold'))['total_units']
        context['average_operating_profit'] = SalesData.objects.aggregate(average_profit=Avg('operating_profit'))['average_profit']
        best_selling = SalesData.objects.values('product').annotate(total_sales=Sum('total_sales')).order_by('-total_sales').first()
        context['best_selling_product'] = best_selling['product'] if best_selling else 'N/A'
        
        context['chunked_profits_data'] = chunked_profits_data
        
        context['sales_distribution'] = sales_distribution
        
        context['product_profits'] = product_profits
        
        context['sales_profit_by_region'] = sales_profit_by_region
        

        return context



def sales_by_retailer(request):
    # Aggregate total sales by retailer
    # sales_data = SalesData.objects.values('retailer').annotate(total_sales=Sum('total_sales')).order_by('-total_sales')
    
    # Aggregate total sales and operating profit by retailer
    sales_data = SalesData.objects.values('retailer').annotate(
        total_sales=Sum('total_sales'),
        operating_profit=Sum('operating_profit')
    ).order_by('-total_sales')
    
    # Prepare data for the chart
    retailers = [data['retailer'] for data in sales_data]
    sales = [data['total_sales'] for data in sales_data]
    profits = [data['operating_profit'] for data in sales_data]
    
    return JsonResponse({
        'retailers': retailers,
        'sales': sales,
        'profits': profits
    })
    
    

def sales_by_method(request):
    sales_data = SalesData.objects.values('sales_method').annotate(total_sales=Sum('total_sales')).order_by('-total_sales')
    
    methods = [data['sales_method'] for data in sales_data]
    sales = [data['total_sales'] for data in sales_data]
    
    return JsonResponse({
        'methods': methods,
        'sales': sales
    })
    
    

def sales_by_product(request):
    # Aggregate sales by product
    sales_data = SalesData.objects.values('product').annotate(total_sales=Sum('units_sold')).order_by('-total_sales')
    
    # Prepare data for the chart
    products = [data['product'] for data in sales_data]
    sales = [data['total_sales'] for data in sales_data]
    
    # Return as JSON
    return JsonResponse({
        'labels': products,
        'data': sales
    })
    
    


def sales_by_state(request):
    sales_data = SalesData.objects.values('state').annotate(total_sales=Sum('total_sales')).order_by('state')
    
    states = [data['state'] for data in sales_data]
    sales = [data['total_sales'] for data in sales_data]
    
    return JsonResponse({
        'states': states,
        'sales': sales
    })
    
    
    
def sales_trends(request):
    # Aggregate total sales by month
    total_sales_by_month = SalesData.objects.annotate(month=TruncMonth('invoice_date')).values('month').annotate(total_sales=Sum('total_sales')).order_by('month')
    
    # Aggregate operating profit by month (instead of units sold)
    operating_profit_by_month = SalesData.objects.annotate(month=TruncMonth('invoice_date')).values('month').annotate(operating_profit=Sum('operating_profit')).order_by('month')

    # Convert dates to timestamps and prepare data for Flot chart
    total_sales_data = [
        [datetime.datetime.combine(sale['month'], datetime.time()).timestamp() * 1000, sale['total_sales']] 
        for sale in total_sales_by_month
    ]
    operating_profit_data = [
        [datetime.datetime.combine(sale['month'], datetime.time()).timestamp() * 1000, sale['operating_profit']] 
        for sale in operating_profit_by_month
    ]
    
    # Convert dates to timestamps for Flot chart
    total_sales_data = [[datetime.datetime.combine(sale['month'], datetime.time()).timestamp() * 1000, sale['total_sales']] for sale in total_sales_by_month]
    ticks = [[datetime.datetime.combine(sale['month'], datetime.time()).timestamp() * 1000, sale['month'].strftime('%b %Y')] for sale in total_sales_by_month]

    return JsonResponse({
        'total_sales_data': total_sales_data,
        'operating_profit_data': operating_profit_data,
        'ticks': ticks
    })