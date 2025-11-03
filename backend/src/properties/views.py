from io import BytesIO
from django.http import HttpResponse
from django.conf import settings
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination as StandardResultsSetPagination
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import docx
from docxtpl import DocxTemplate

from .models import Property
from .serializers import PropertySerializer



class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    
    ordering_fields = ['id'] 
    ordering = ['id']        


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def generate_property_report(request, property_pk=None):
    """
    Genera y devuelve un informe .docx para una propiedad específica,
    utilizando los campos limpios del modelo Property refactorizado.
    """
    try:
        propiedad = Property.objects.get(pk=property_pk)
    except Property.DoesNotExist:
        return HttpResponse("Error: Propiedad no encontrada.", status=404)

    try:
        template_path = settings.BASE_DIR.parent / 'templates/reports/informe_propiedad.docx'
        doc = DocxTemplate(template_path)
        
        # --- CORRECCIÓN CLAVE: Usamos los nombres de campo del modelo limpio ---
        # También formateamos los datos y manejamos los casos nulos.
        context = {
            'address': propiedad.address or 'No disponible',
            
            # Formateamos el precio como moneda, o ponemos un texto por defecto
            'price': f"${propiedad.price:,.0f}" if propiedad.price is not None else 'Consultar',
            
            'surface_total': propiedad.surface_total or 'No disponible',
            'surface_useful': propiedad.surface_useful or 'No disponible',
            
            # Usamos los nombres de campo correctos
            'bedrooms': propiedad.bedrooms if propiedad.bedrooms is not None else 'No disponible',
            'bathrooms': propiedad.bathrooms if propiedad.bathrooms is not None else 'No disponible',
            'parking_spots': propiedad.parking_spots if propiedad.parking_spots is not None else 'No disponible',
            'storage_units': propiedad.storage_units if propiedad.storage_units is not None else 'No disponible',
            
            'nombre_cliente': request.user.get_full_name() or request.user.username,
        }
        
        doc.render(context)
        
        file_stream = BytesIO()
        doc.save(file_stream)
        file_stream.seek(0)
        
        response = HttpResponse(
            file_stream.read(),
            content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        response['Content-Disposition'] = f'attachment; filename="informe_{propiedad.id}.docx"'
        
        return response

    except FileNotFoundError:
        return HttpResponse(f"Error: No se encontró la plantilla de reporte.", status=500)
    except Exception as e:
        # Añadimos un print del error para facilitar la depuración en el futuro
        print(f"Error generando reporte: {e}")
        return HttpResponse(f"Error inesperado al generar el reporte.", status=500)