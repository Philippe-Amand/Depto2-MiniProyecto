# backend/src/users/serializers.py
# --- CAMBIO #1: Importa get_user_model ---
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- Obtiene el modelo de usuario activo ---
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        # --- CAMBIO #2: El modelo ahora es el correcto ---
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # --- CAMBIO #3: El método create_user ahora es llamado en el modelo correcto ---
        user = User.objects.create_user(
            validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Puedes añadir campos de tu CustomUser aquí si lo deseas
        # Por ejemplo, si añadieras un campo 'phone_number' a CustomUser:
        # token['phone_number'] = user.phone_number
        token['username'] = user.username
        token['email'] = user.email
        return token