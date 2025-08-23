import time
import uuid
from django.conf import settings
from django.db import transaction
from rest_framework import views, response, status
from rest_framework.permissions import IsAuthenticated, AllowAny

from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.error.transbank_error import TransbankError
from transbank.common.options import WebpayOptions

from .serializers import TransactionCreateSerializer, TransactionConfirmSerializer
from properties.models import Property
from .models import PaymentTransaction


class CreateTransactionView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransactionCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        property_id = serializer.validated_data['property_id']
        try:
            property_obj = Property.objects.get(pk=property_id)
        except Property.DoesNotExist:
            return response.Response({"error": "Propiedad no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        # Usamos variables determinadas por el backend para máxima seguridad
        amount = property_obj.price
        buy_order = f"oc_{property_id}_{request.user.id}_{int(time.time()) % 100000}"
        session_id = str(uuid.uuid4()) # Usamos UUID para un session_id garantizado de ser único
        return_url = f'{settings.FRONTEND_BASE_URL}/payment/return'
        
        try:
            # --- INICIO DEL BLOQUE ATÓMICO ---
            with transaction.atomic():
                
                # 1. Crea el registro en tu BBDD en estado PENDING.
                db_transaction = PaymentTransaction.objects.create(
                    user=request.user,
                    property=property_obj,
                    amount=amount,
                    buy_order=buy_order
                )
                
                print("===========================================")
                print(f"Código de Comercio que se usará: '{settings.WEBPAY_PLUS_COMMERCE_CODE}'")
                print(f"API Key que se usará: '{settings.WEBPAY_PLUS_API_KEY_SECRET}'")
                print("===========================================")

                # 2. Prepara e inicia la transacción con Transbank.
                options = WebpayOptions(
                    settings.WEBPAY_PLUS_COMMERCE_CODE, 
                    settings.WEBPAY_PLUS_API_KEY_SECRET, 
                    'TEST'
                )
                tx = Transaction(options=options)
                tbk_response = tx.create(buy_order, session_id, amount, return_url)

                # 3. Si Transbank responde OK, actualiza tu registro con el token.
                db_transaction.transbank_token = tbk_response['token']
                db_transaction.save()

            
            return response.Response(tbk_response, status=status.HTTP_200_OK)

        except TransbankError as e:
            print(f"Error de Transbank al crear la transacción: {e.message}")
            PaymentTransaction.objects.create(
                user=request.user, property=property_obj, amount=amount,
                buy_order=buy_order, status='FAILED'
            )
            return response.Response({"error": f"Error de comunicación con el banco: {e.message}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            # Captura cualquier otro error inesperado (ej. problemas con la BBDD)
            print(f"Error inesperado al crear transacción: {str(e)}")
            return response.Response({"error": "Ocurrió un error inesperado al procesar tu solicitud."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConfirmTransactionView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TransactionConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        token = serializer.validated_data.get('token_ws')

        # Escenario: el usuario cancela el pago en Webpay o cierra la pestaña.
        # Transbank lo redirige con otros parámetros.
        if not token:
            buy_order = serializer.validated_data.get('TBK_ORDEN_COMPRA')
            if buy_order:
                transaction = PaymentTransaction.objects.filter(buy_order=buy_order).first()
                if transaction:
                    transaction.status = 'FAILED'
                    transaction.save()
            # Respondemos que todo OK, el frontend debe redirigir a una página de fallo.
            return response.Response({"status": "failed", "message": "Pago cancelado por el usuario."}, status=status.HTTP_200_OK)

        try:
            options = WebpayOptions(
                settings.WEBPAY_PLUS_COMMERCE_CODE, 
                settings.WEBPAY_PLUS_API_KEY_SECRET, 
                'TEST'
            )
            tx = Transaction(options=options)
            # -------------------------------------
            tbk_response = tx.commit(token)
            
            # Buscamos nuestra transacción interna
            transaction = PaymentTransaction.objects.get(transbank_token=token)
            transaction.raw_response = tbk_response
            transaction.response_code = tbk_response.get('response_code')

            if tbk_response.get('status') == 'AUTHORIZED':
                transaction.status = 'COMPLETED'
                transaction.save()
                return response.Response({"status": "success", "details": tbk_response}, status=status.HTTP_200_OK)
            else:
                transaction.status = 'FAILED'
                transaction.save()
                return response.Response({"status": "failed", "details": tbk_response}, status=status.HTTP_200_OK)

        except TransbankError as e:
            print(f"Error de Transbank al confirmar: {e.message}")
            # Busca por token si lo encuentras y actualiza a FAILED.
            return response.Response({"error": f"Error de comunicación con el banco: {e.message}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except PaymentTransaction.DoesNotExist:
            return response.Response({"error": "Transacción no encontrada"}, status=status.HTTP_404_NOT_FOUND)