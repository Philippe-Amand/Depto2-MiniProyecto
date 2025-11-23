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

from .models import Arriendo
from .serializers import ArriendoSerializer



class ArriendoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Arriendo.objects.all()
    serializer_class = ArriendoSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    
    ordering_fields = ['idArriendo'] 
    ordering = ['idArriendo']        


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def generate_property_report(request, property_pk=None):
    """
    Genera y devuelve un informe .docx para una propiedad específica (Arriendo).
    """
    try:
        propiedad = Arriendo.objects.get(pk=property_pk)
    except Arriendo.DoesNotExist:
        return HttpResponse("Error: Propiedad no encontrada.", status=404)

    try:
        # Usamos el template original solicitado por el usuario
        template_path = settings.BASE_DIR.parent / 'templates/reports/informe_propiedad.docx'
        doc = DocxTemplate(template_path)

        # Mapeo de campos del modelo Arriendo a las variables del template
        # NOTA: Las variables en el Word deben ser snake_case (sin espacios)
        context = {
            # Encabezado
            'address': propiedad.direccion or 'No disponible',
            'id': propiedad.idArriendo,
            'comuna_id': 'Arica', # Dato simulado o extraer de dirección
            'region_comuna_id': 'Arica y Parinacota', # Dato simulado
            'fecha': propiedad.fechaDescarga.strftime("%d/%m/%Y") if propiedad.fechaDescarga else 'N/A',
            'nombre_cliente': request.user.get_full_name() or request.user.username,

            # Tabla de detalles
            'direccion': propiedad.direccion or 'No disponible',
            'nro_depto': 'N/A', # No tenemos este campo específico
            'comuna': 'Arica',
            'region': 'Arica y Parinacota',
            'precio_en_uf': f"${propiedad.precio:,.0f}" if propiedad.precio is not None else 'Consultar', # Mostramos precio en pesos por ahora
            'tipo_propiedad': 'Departamento',
            'nueva_usada': 'Usada',
            'tipo_entrega': 'Inmediata',
            'sup_total': propiedad.superficieTotal or '0',
            'tipologia': f"{propiedad.habitaciones} Dorm / {propiedad.banos} Baños",
            'nro_estacionamientos_bodegas': f"{propiedad.estacionamientos or 0} / {propiedad.bodegas or 0}",
        }
        
        doc.render(context)
        
        file_stream = BytesIO()
        doc.save(file_stream)
        file_stream.seek(0)
        
        response = HttpResponse(
            file_stream.read(),
            content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        response['Content-Disposition'] = f'attachment; filename="informe_{propiedad.idArriendo}.docx"'
        
        return response

    except FileNotFoundError:
        return HttpResponse(f"Error: No se encontró la plantilla de reporte.", status=500)
    except Exception as e:
        print(f"Error generando reporte: {e}")
        return HttpResponse(f"Error inesperado al generar el reporte.", status=500)