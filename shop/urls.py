from django.urls import path
from .views import ProductListView, CartView, OrderView, get_csrf_token, CategoryListView, gerar_pix_qrcode

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/<int:product_id>/', CartView.as_view(), name='cart-item'),
    path('order/', OrderView.as_view(), name='order'),
    path('csrf/', get_csrf_token, name='csrf'),
    path('gerar-pix/', gerar_pix_qrcode, name='gerar_pix_qrcode'),
]