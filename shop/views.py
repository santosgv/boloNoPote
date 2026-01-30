from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from .models import Product, CartItem, Order,Category,Branding
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
        serializer = OrderSerializer(data={**request.data, 'session_id': session_id})
        
        if serializer.is_valid():
            cart_items = CartItem.objects.filter(session_id=session_id)
            total = sum(item.product.price * item.quantity for item in cart_items)
            serializer.validated_data['total'] = total
            #serializer.validated_data['pix_key'] =   # Placeholder
            serializer.validated_data['session_id'] = session_id

            
            order = serializer.save()
            cart_items.delete() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)