from django.contrib import admin
from .models import Property
from .models import Property, Document

# Definimos una clase de configuración para el modelo Property
class DocumentInline(admin.TabularInline):
    model = Document
    extra = 1 # Muestra un campo de subida vacío por defecto
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
    
    inlines = [DocumentInline]

