# backend/src/properties/models.py

from django.db import models

class Property(models.Model):
    # La clave de negocio principal
    id = models.IntegerField(db_column='idArriendo', primary_key=True)

    # Campos de Texto Generales
    title = models.CharField(db_column='titulo', max_length=255, blank=True, null=True)
    address = models.CharField(db_column='direccion', max_length=255, blank=True, null=True)
    
    # Campos de Fecha y Hora
    # Usaremos CharField por seguridad, la base de datos podría tener fechas mal formateadas.
    # El ORM puede tener problemas convirtiéndolos.
    download_date = models.CharField(db_column='fechaDescarga', max_length=100, blank=True, null=True)
    correspondence_date = models.CharField(db_column='fechaCorrespondiente', max_length=100, blank=True, null=True)

    # Campos de Localización (IDs foráneos tratados como texto por ahora)
    region_comuna_id = models.CharField(db_column='idRegionComuna', max_length=100, blank=True, null=True)
    comuna_id = models.CharField(db_column='idComuna', max_length=100, blank=True, null=True)

    # Campos de Superficie (usamos CharField por si contienen "m2" u otro texto)
    surface_total = models.CharField(db_column='superficieTotal', max_length=50, blank=True, null=True)
    surface_useful = models.CharField(db_column='superficieUtil', max_length=50, blank=True, null=True)
    surface_weighted = models.CharField(db_column='superficiePonderada', max_length=50, blank=True, null=True)

    # Características de la Propiedad
    age_string = models.CharField(db_column='antiguedad', max_length=100, blank=True, null=True)
    age_data = models.CharField(db_column='dataAntiguedad', max_length=100, blank=True, null=True)
    is_furnished = models.CharField(db_column='amoblado', max_length=50, blank=True, null=True)
    
    # Campos Numéricos (los mapeamos como CharField por seguridad de datos legados)
    price_string = models.CharField(db_column='precio', max_length=100, blank=True, null=True)
    uf_per_sqm = models.CharField(db_column='uf_m2', max_length=100, blank=True, null=True)
    bedrooms = models.CharField(db_column='habitaciones', max_length=50, blank=True, null=True)
    bathrooms = models.CharField(db_column='banos', max_length=50, blank=True, null=True)
    parking_spots = models.CharField(db_column='estacionamientos', max_length=50, blank=True, null=True)
    storage_units = models.CharField(db_column='bodegas', max_length=50, blank=True, null=True)
    
    # Multimedia y Geolocalización
    youtube_video_url = models.CharField(db_column='url', max_length=500, blank=True, null=True)
    latitude = models.CharField(max_length=50, blank=True, null=True)
    longitude = models.CharField(max_length=50, blank=True, null=True)

    # Campos Financieros Adicionales
    uf_clp_value = models.CharField(db_column='uf_clp', max_length=100, blank=True, null=True)
    currency = models.CharField(db_column='moneda', max_length=50, blank=True, null=True)
    
    # El modelo Django no tendrá una columna 'image', ya que no está en tu tabla.
    # Necesitaríamos una tabla separada para imágenes o añadir la columna a 'arriendos'.

    class Meta:
        managed = False  # Le dice a Django: "No toques esta tabla, ya existe."
        db_table = 'arriendos' # Le dice a Django el nombre exacto de la tabla en MySQL.
        verbose_name = 'Propiedad de Arriendo'
        verbose_name_plural = 'Propiedades de Arriendo'