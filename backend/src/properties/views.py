from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .models import Property, Document
from .serializers import PropertySerializer, DocumentSerializer

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint que permite ver las propiedades.
    """
    # El conjunto de objetos que estarán disponibles en la API.
    queryset = Property.objects.all().order_by('-created_at')
    
    # La clase serializer que se usará para traducir los objetos.
    serializer_class = PropertySerializer
    permission_classes = [AllowAny] 

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser) # Permite la subida de archivos
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Asocia automáticamente el documento a la propiedad de la URL
        serializer.save(property_id=self.kwargs['property_pk'])
        
    def get_queryset(self):
        # Filtra los documentos para mostrar solo los de la propiedad especificada en la URL
        return Document.objects.filter(property_id=self.kwargs['property_pk'])


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
# Create your views here.
