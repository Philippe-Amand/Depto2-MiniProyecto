from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet

# DefaultRouter se encarga de generar automáticamente las URLs para un ViewSet.
router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')

# Las URLs de la API son ahora determinadas automáticamente por el router.
urlpatterns = [
    path('', include(router.urls)),
]