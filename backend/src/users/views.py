# backend/src/users/views.py

from rest_framework import generics
from rest_framework.permissions import AllowAny
# --- CAMBIO #1: Importa get_user_model para obtener dinámicamente el modelo de usuario correcto ---
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# --- Esta es la mejor práctica para obtener el modelo de usuario activo ---
User = get_user_model()

class RegisterView(generics.CreateAPIView):
    # --- CAMBIO #2: Usa el modelo de usuario correcto que acabamos de obtener ---
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# Crea una vista personalizada que usa nuestro serializer
class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = MyTokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]