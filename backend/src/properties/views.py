from django.shortcuts import render

from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .models import Property
from .serializers import PropertySerializer

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint que permite ver las propiedades.
    """
    # El conjunto de objetos que estarán disponibles en la API.
    queryset = Property.objects.all().order_by('-created_at')
    
    # La clase serializer que se usará para traducir los objetos.
    serializer_class = PropertySerializer
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
# Create your views here.
