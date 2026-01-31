from rest_framework.views import APIView
from django.db import transaction
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from .models import Product, CartItem, OrderItem,Category,Branding,Order
from django.db.models import Avg, Sum, Count
from .serializers import ProductSerializer, CartItemSerializer, OrderSerializer, CategorySerializer
from django.conf import settings
import uuid
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import re
import json
from .utils import Payload


@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'message': 'CSRF cookie set'})

@csrf_exempt
def gerar_pix_qrcode(request):
    dados_loja = Branding.objects.first()
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            valor = float(data.get('valor', 0))
            
            
            # Cria o payload sem gerar QR Code
            payload = Payload(
                nome=str(dados_loja.name[:17]),
                chavepix=str(dados_loja.chavepix),
                valor=f'{valor}',
                cidade='Brasil',
                txtId=str(data['session_id'][-5:])
            )
            
            string_pix = payload.gerarPayload(gerar_qrcode=False)
            
            return JsonResponse({
                'brcode': string_pix,
                'valor': f"{valor:.2f}",
                'mensagem': 'Payload PIX gerado com sucesso'
            })
            
        except json.JSONDecodeError:
            print("Erro ao decodificar JSON")
            return JsonResponse({'error': 'JSON inválido'}, status=400)
        except ValueError as ve:
            print(f"Erro de valor: {ve}")
            return JsonResponse({'error': 'Valor inválido'}, status=400)
        except Exception as e:
            print(f"Erro ao processar PIX: {str(e)}")
            return JsonResponse({'error': 'Erro interno ao processar a requisição'}, status=500)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)


def get_branding(request):
    key = request.GET.get('key', 'default')  # 'default' é o fallback
    print(f"Fetching branding for key: {key}")  # Debug log
    try:
        branding = Branding.objects.get(key=key)
        return JsonResponse({
            'logo_url': request.build_absolute_uri(branding.logo.url),
            'background_url': request.build_absolute_uri(branding.background.url),
            'name': (branding.name)
        })
    except Branding.DoesNotExist:
        return JsonResponse({'error': f'Branding not found for key: {key}'}, status=404)

class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class CartView(APIView):
    def get(self, request):
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response(
                {'error': 'session_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        print('Session ID (GET):', session_id)  # Debug
        cart_items = CartItem.objects.filter(session_id=session_id)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        session_id = request.data.get('session_id')
        if not session_id:
            session_id = str(uuid.uuid4())  # Generate new session_id if none provided
        print('Session ID (POST):', session_id)  # Debug
        serializer = CartItemSerializer(data={**request.data, 'session_id': session_id})
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data['quantity']
            try:
                cart_item = CartItem.objects.get(session_id=session_id, product_id=product_id)
                cart_item.quantity += quantity
                cart_item.save()
                serializer = CartItemSerializer(cart_item)  # Serialize updated item
            except CartItem.DoesNotExist:
                cart_item = serializer.save(session_id=session_id)
                serializer = CartItemSerializer(cart_item)
            return Response(
                {'session_id': session_id, 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, product_id):
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response(
                {'error': 'session_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        print('Session ID (DELETE):', session_id)  # Debug
        try:
            cart_item = CartItem.objects.get(session_id=session_id, product_id=product_id)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found for this session'},
                status=status.HTTP_404_NOT_FOUND
            )

class OrderView(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        
        if not session_id:
            return Response(
                {'error': 'session_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Buscamos os itens que estão no carrinho deste usuário/sessão
        cart_items = CartItem.objects.filter(session_id=session_id)
        
        if not cart_items.exists():
            return Response(
                {'error': 'O carrinho está vazio.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Usamos uma transação para garantir integridade
        try:
            with transaction.atomic():
                # 2. Calculamos o total real baseado nos produtos atuais
                total = sum(item.product.price * item.quantity for item in cart_items)
                
                # 3. Preparamos o serializer (ajuste conforme seu OrderSerializer)
                serializer = OrderSerializer(data=request.data)
                
                if serializer.is_valid():
                    # Salva a Order enviando o total calculado e o session_id
                    order = serializer.save(total=total, session_id=session_id)

                    # 4. CRIANDO OS ITENS DO PEDIDO (O que faltava)
                    for item in cart_items:
                        OrderItem.objects.create(
                            order=order,
                            product=item.product,
                            quantity=item.quantity,
                            # Importante: salva o preço do momento da compra!
                            price_at_purchase=item.product.price 
                        )

                    # 5. Agora sim, deletamos o carrinho
                    cart_items.delete() 

                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response(
                {'error': f'Erro ao processar pedido: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
@api_view(['GET'])
def get_dashboard_stats(request):
    try:
        # 1. TICKET MÉDIO (Arredondado para 2 casas decimais)
        ticket_medio_raw = Order.objects.filter(status=2).aggregate(Avg('total'))['total__avg'] or 0
        ticket_medio = round(float(ticket_medio_raw), 2)

        # 2. PRODUTO QUE MAIS SAI (Formatado para Gráfico)
        # Transformamos em uma lista simples de dicionários
        top_produtos_qs = OrderItem.objects.values('product__name') \
            .annotate(vendas=Sum('quantity')) \
            .order_by('-vendas')[:5]
        
        top_produtos = [
            {"name": item['product__name'], "vendas": item['vendas']} 
            for item in top_produtos_qs
        ]

        # 3. BAIRRO MAIS ATENDIDO
        # Pegamos o nome do bairro e a contagem de pedidos
        top_bairros_qs = Order.objects.values('address__neighborhood') \
            .annotate(pedidos=Count('id')) \
            .order_by('-pedidos')[:5]

        top_bairros = [
            {"bairro": item['address__neighborhood'], "pedidos": item['pedidos']} 
            for item in top_bairros_qs
        ]

        # 4. TOTAL DE VENDAS (Métrica extra útil)
        total_vendas = Order.objects.filter(status=2).count()

        return Response({
            "status": "success",
            "data": {
                "total_vendas": total_vendas,
                "ticket_medio": ticket_medio,
                "top_produtos": top_produtos,
                "top_bairros": top_bairros
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)