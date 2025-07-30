from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from .models import Product, CartItem, Order,Category
from .serializers import ProductSerializer, CartItemSerializer, OrderSerializer, CategorySerializer
from django.conf import settings
import uuid
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import re
import json


@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'message': 'CSRF cookie set'})

def validar_chave_pix(chave):
    """Valida se a chave PIX é um email válido, CPF, CNPJ, telefone ou chave aleatória"""
    # Valida email
    if re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', chave):
        return True
    # Valida CPF/CNPJ (apenas dígitos)
    if chave.isdigit() and (len(chave) == 11 or len(chave) == 14):
        return True
    # Valida telefone (+5583999999999)
    if chave.startswith('+') and chave[1:].isdigit():
        return True
    # Valida chave aleatória (UUID)
    if len(chave) == 36 and '-' in chave:
        return True
    return False

@csrf_exempt
def gerar_pix_qrcode(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validações básicas
            valor = float(data.get('valor', 0))
            chave_pix = data.get('chave_pix', 'chave_aleatoria')  # Chave PIX pode ser um email, CPF, CNPJ, telefone ou chave aleatória
            string_pix_banco = ('00020126580014BR.GOV.BCB.PIX01363e04aebc-7948-4390-96e2-1f60a286566e52040000530398654040.015802BR5922Vitor dos Santos Gomes6009SAO PAULO62140510aCNHVn8PV36304BC15')  # String completa gerada pelo banco
            
            print(f"Valor: {valor}, Chave PIX: {chave_pix}, String PIX do banco: {string_pix_banco}")  # Log para debug

            #if not validar_chave_pix(chave_pix):
            #    return JsonResponse({'error': 'Chave PIX inválida'}, status=400)
                
            if valor <= 0:
                return JsonResponse({'error': 'Valor deve ser positivo'}, status=400)
                
            if not string_pix_banco or len(string_pix_banco) < 30:
                return JsonResponse({'error': 'String PIX do banco inválida'}, status=400)
            
            # Se a string do banco for válida, retorne ela diretamente
            return JsonResponse({
                'brcode': string_pix_banco,
                'valor': f"{valor:.2f}",
                'chave': chave_pix,
                'mensagem': 'String PIX gerada pelo banco'
            })
            
        except json.JSONDecodeError:
            print("Erro ao decodificar JSON")  # Log para debug
            return JsonResponse({'error': 'JSON inválido'}, status=400)
        except ValueError:
            print
            return JsonResponse({'error': 'Valor inválido'}, status=400)
        except Exception as e:
            print(f"Erro ao processar PIX: {str(e)}")  # Log para debug
            return JsonResponse({'error': 'Erro interno ao processar a requisição'}, status=500)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)


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