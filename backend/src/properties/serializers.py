# backend/src/properties/serializers.py
from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    """
    Un serializador simple y declarativo para el modelo Property.
    
    Dado que hemos corregido los tipos de datos en `models.py` para que coincidan
    con la base de datos, ya no necesitamos ninguna lógica de limpieza o conversión personalizada.
    El `ModelSerializer` de Django REST Framework puede manejar todo automáticamente.
    """
    class Meta:
        model = Property
        
        # --- LA ÚNICA FUENTE DE LA VERDAD ---
        # La directiva '__all__' le dice a Django REST Framework:
        # "Inspecciona el modelo 'Property' y expón TODOS sus campos en la API."
        # Esto es exactamente lo que pediste: que el serializador contenga
        # todos los atributos del modelo de propiedad.
        fields = '__all__'

        # Si en el futuro quisieras exponer solo algunos campos, cambiarías
        # la línea de arriba por una lista explícita, como hicimos antes:
        # fields = ['id', 'title', 'address', 'price', 'bedrooms', 'bathrooms']