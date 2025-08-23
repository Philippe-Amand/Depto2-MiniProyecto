from rest_framework import serializers

class TransactionCreateSerializer(serializers.Serializer):
    property_id = serializers.IntegerField(required=True)

class TransactionConfirmSerializer(serializers.Serializer):
    token_ws = serializers.CharField(required=False)
    # Transbank envía estos tokens si el usuario cancela
    TBK_TOKEN = serializers.CharField(required=False)
    TBK_ORDEN_COMPRA = serializers.CharField(required=False)
    TBK_ID_SESION = serializers.CharField(required=False)