from django.contrib import admin
from .models import Product, CartItem, Address, Order, Category

admin.site.register(Product)
admin.site.register(CartItem)  
admin.site.register(Address)
admin.site.register(Order)
admin.site.register(Category)