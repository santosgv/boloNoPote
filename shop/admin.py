from django.contrib import admin
from .models import Product, CartItem, Address, Order, Category, Branding,OrderItem

admin.site.register(OrderItem)
admin.site.register(Product)
admin.site.register(CartItem)  
admin.site.register(Address)
admin.site.register(Order)
admin.site.register(Category)

@admin.register(Branding)
class BrandingAdmin(admin.ModelAdmin):
    list_display = ['name', 'updated_at']