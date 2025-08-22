from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import PropertyViewSet, DocumentViewSet

# DefaultRouter se encarga de generar automáticamente las URLs para un ViewSet.
router = routers.SimpleRouter()
router.register(r'properties', PropertyViewSet)

# Router anidado para los documentos
# Esto creará URLs como /properties/{property_pk}/documents/
properties_router = routers.NestedSimpleRouter(router, r'properties', lookup='property')
properties_router.register(r'documents', DocumentViewSet, basename='property-documents')

urlpatterns = router.urls + properties_router.urls