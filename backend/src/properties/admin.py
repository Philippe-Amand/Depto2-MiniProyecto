from django.contrib import admin
from .models import Property # Importamos nuestro modelo Property

# Definimos una clase de configuración para el modelo Property
@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """
    Configuración personalizada para el modelo Property en el panel de administración.
    """
    # Campos que se mostrarán en la vista de lista de propiedades.
    list_display = ('name', 'address', 'price', 'created_at', 'updated_at')

    # Campos que tendrán una barra de búsqueda para encontrarlos fácilmente.
    search_fields = ('name', 'address', 'description')

    # Campos que tendrán filtros en la barra lateral.
    list_filter = ('created_at', 'updated_at')

# La línea @admin.register(Property) es un atajo (decorador) que hace lo mismo que
# la siguiente línea, que es la forma tradicional de registrarlo:
# admin.site.register(Property, PropertyAdmin)
