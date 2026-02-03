from django.db import models
from django.contrib.auth.models import User


class Branding(models.Model):
    key = models.CharField(max_length=100, unique=True,default='padrao')
    name = models.CharField(max_length=100, default='Default Branding')
    logo = models.ImageField(upload_to='branding/logo/')
    background = models.ImageField(upload_to='branding/background/')
    updated_at = models.DateTimeField(auto_now=True)
    chavepix = models.CharField(max_length=32)

    def __str__(self):
        return self.name

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image =  models.ImageField(upload_to='products/')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')

    def __str__(self):
        return self.name

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, null=True, blank=True)  # Para usuários não autenticados
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    street = models.CharField(max_length=100)
    number = models.CharField(max_length=10)
    neighborhood = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.street}, {self.number}, {self.city}-{self.state}"

class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ('delivery', 'Entrega'),
        ('pickup', 'Retirada'),
    ]
    order_type = models.CharField(
        max_length=10, 
        choices=ORDER_TYPE_CHOICES, 
        default='delivery'
    )

    CHOICES_SITUACAO =(
        ('1','Pendente'),
        ('2','Pago'),
        ('3','Estornado')
    )


    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, null=True, blank=True)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=CHOICES_SITUACAO ,default='1')
    pix_key = models.CharField(max_length=100, blank=True)  # Placeholder para chave Pix

    def __str__(self):
        return f"Order {self.id} by {self.user or self.session_id}"
    
class OrderItem(models.Model):

    CHOICES_SITUACAO =(
        ('1','Pendente'),
        ('2','Fazendo'),
        ('3','Enviado'),
        ('4','Entregue'),
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    status = models.CharField(max_length=1, choices=CHOICES_SITUACAO ,default='1')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Pedido {self.order.id})"