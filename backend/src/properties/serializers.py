# backend/src/properties/serializers.py
from rest_framework import serializers
from .models import Arriendo, Venta, ArriendoVenta

class ArriendoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arriendo
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'

class ArriendoVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArriendoVenta
        fields = '__all__'