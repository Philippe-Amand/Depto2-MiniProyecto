# backend/src/properties/urls.py

from django.urls import path
from rest_framework.routers import SimpleRouter

# ¡Importa las vistas desde SU PROPIO directorio!
from .views import PropertyViewSet, generate_property_report 

# --- router ---
router = SimpleRouter()
router.register(r'', PropertyViewSet, basename='property') # Cambiado para anidar correctamente

# --- urlpatterns ---
urlpatterns = router.urls + [
    path('<int:property_pk>/report/', generate_property_report, name='property-report'),
]