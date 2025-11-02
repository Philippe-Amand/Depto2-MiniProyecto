from io import BytesIO
from django.http import HttpResponse
from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import docx

from .models import Property
from .serializers import PropertySerializer



class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [AllowAny] 

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def generate_property_report(request, property_pk=None):
    """
    Genera y devuelve un informe .docx para una propiedad específica,
    rellenando los datos disponibles desde el modelo Property (tabla 'arriendos').
    """
    try:
        propiedad = Property.objects.get(pk=property_pk)
    except Property.DoesNotExist:
        return HttpResponse("Error: Propiedad no encontrada.", status=404)

    try:
        template_path = settings.BASE_DIR.parent / 'templates/reports/informe_propiedad.docx'
        document = docx.Document(template_path)
        
        # Diccionario de mapeo entre placeholders del DOCX y atributos del modelo Django
        context = {
            # Propiedad
            '[dirección]': propiedad.address,
            '[precio en UF]': propiedad.price_string,
            '[sup total]': propiedad.surface_total,
            '[sup útil]': propiedad.surface_useful,
            '[nro dorms]': propiedad.bedrooms,
            '[nro baños]': propiedad.bathrooms,
            '[nro estacionamientos]': propiedad.parking_spots,
            '[nro bodegas]': propiedad.storage_units,
            
            # Usuario (Ejemplo)
            '[nombre cliente]': request.user.get_full_name() or request.user.username,
            
            # NOTA: Los placeholders faltantes (ej. '[valor CAE]', '[plusvalía comuna]', etc.)
            # no serán reemplazados porque no tenemos los datos en el modelo Property.
        }

        # Lógica de reemplazo robusta para Párrafos
        for p in document.paragraphs:
            # Crea una lista de textos de 'runs' para reconstruir el párrafo
            full_text = "".join(run.text for run in p.runs)
            if any(key in full_text for key in context.keys()):
                # Realiza los reemplazos en la cadena de texto completa
                for key, value in context.items():
                    full_text = full_text.replace(key, str(value or '')) # Usa '' si el valor es None
                
                # Borra todos los runs existentes y añade uno nuevo con el texto completo
                for run in p.runs:
                    run.text = ''
                if p.runs:
                    p.runs[0].text = full_text

        # Lógica de reemplazo robusta para Tablas
        for table in document.tables:
            for row in table.rows:
                for cell in row.cells:
                    # Aplica la misma lógica que para los párrafos a cada celda
                    full_text = "".join(run.text for run in cell.paragraphs[0].runs) if cell.paragraphs else ''
                    if any(key in full_text for key in context.keys()):
                        for key, value in context.items():
                            full_text = full_text.replace(key, str(value or ''))
                        
                        cell.text = ''
                        cell.add_paragraph(full_text)
        
        file_stream = BytesIO()
        document.save(file_stream)
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
        print(f"Error generando reporte: {str(e)}")
        return HttpResponse(f"Error inesperado al generar el reporte.", status=500)