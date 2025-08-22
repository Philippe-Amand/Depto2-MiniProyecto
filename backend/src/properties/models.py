from django.db import models

class Property(models.Model):
    """
    Representa una propiedad inmobiliaria en el sistema.
    """
    name = models.CharField(
        max_length=255,
        verbose_name="Nombre de la Propiedad"
    )
    address = models.CharField(
        max_length=255,
        verbose_name="Dirección"
    )
    description = models.TextField(
        verbose_name="Descripción",
        help_text="Descripción detallada de la propiedad.",
        null=True,  # Permite valores nulos en la BBDD
        blank=True  # Permite que el campo esté en blanco en los formularios
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Precio"
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        verbose_name="Latitud",
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        verbose_name="Longitud",
        null=True,
        blank=True
    )
    youtube_video_url = models.URLField(
        max_length=255, 
        null=True, 
        blank=True, 
        verbose_name="URL del Video de YouTube"
    )
    image = models.ImageField(
        upload_to='properties/',
        null=True,
        blank=True,
        verbose_name="Imagen de la Propiedad"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de Creación"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de Actualización"
    )

class Meta:
    verbose_name = "Propiedad"
    verbose_name_plural = "Propiedades"
    ordering = ['-created_at']

def __str__(self):
    return f"{self.name} - {self.address}"

class Document(models.Model):
    property = models.ForeignKey(
        Property, 
        related_name='documents', # Nos permite acceder a los documentos desde una propiedad
        on_delete=models.CASCADE   # Si se borra la propiedad, se borran sus documentos
    )
    file = models.FileField(
        upload_to='documents/',     # Se guardarán en 'media_root/documents/'
        verbose_name="Documento"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Documento para {self.property.name} - {self.file.name}"
    