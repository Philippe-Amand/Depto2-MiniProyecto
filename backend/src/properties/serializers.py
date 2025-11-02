# backend/src/properties/serializers.py

from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        # Usa '__all__' para incluir automáticamente todos los campos del nuevo modelo
        fields = '__all__'