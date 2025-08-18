from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    """
    Serializer para traducir objetos Property a y desde formato JSON.
    """
    class Meta:
        model = Property
        # Especifica todos los campos del modelo para ser incluidos en la API.
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Llama al método original para obtener el token
        token = super().get_token(user)

        # Añade claims (datos) personalizados al payload del token
        token['username'] = user.username
        token['email'] = user.email
        # ...puedes añadir cualquier otro dato del modelo User que necesites

        return token