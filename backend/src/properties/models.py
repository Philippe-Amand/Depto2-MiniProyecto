# backend/src/properties/models.py

from django.db import models

class Arriendo(models.Model):
    idArriendo = models.IntegerField(db_column='idArriendo', primary_key=True)
    fechaDescarga = models.DateField(db_column='fechaDescarga', blank=True, null=True)
    fechaCorrespondiente = models.DateField(db_column='fechaCorrespondiente', blank=True, null=True)
    titulo = models.CharField(db_column='titulo', max_length=255, blank=True, null=True)
    direccion = models.CharField(db_column='direccion', max_length=255, blank=True, null=True)
    
    # Foreign keys as Integers for now since referenced models don't exist in this file
    idRegionComuna = models.IntegerField(db_column='idRegionComuna', blank=True, null=True)
    idComuna = models.IntegerField(db_column='idComuna', blank=True, null=True)
    
    superficieTotal = models.CharField(db_column='superficieTotal', max_length=255, blank=True, null=True)
    superficieUtil = models.CharField(db_column='superficieUtil', max_length=255, blank=True, null=True)
    superficiePonderada = models.CharField(db_column='superficiePonderada', max_length=255, blank=True, null=True)
    
    antiguedad = models.IntegerField(db_column='antiguedad', blank=True, null=True)
    dataAntiguedad = models.CharField(db_column='dataAntiguedad', max_length=15, blank=True, null=True)
    amoblado = models.IntegerField(db_column='amoblado', blank=True, null=True)
    precio = models.IntegerField(db_column='precio', blank=True, null=True)
    moneda = models.CharField(db_column='moneda', max_length=2, blank=True, null=True)
    uf_m2 = models.FloatField(db_column='uf_m2', blank=True, null=True)
    habitaciones = models.IntegerField(db_column='habitaciones', blank=True, null=True)
    banos = models.IntegerField(db_column='banos', blank=True, null=True)
    estacionamientos = models.IntegerField(db_column='estacionamientos', blank=True, null=True)
    bodegas = models.IntegerField(db_column='bodegas', blank=True, null=True)
    url = models.CharField(db_column='url', max_length=255, blank=True, null=True)
    latitud = models.FloatField(db_column='latitud', blank=True, null=True)
    longitud = models.FloatField(db_column='longitud', blank=True, null=True)
    uf_clp = models.FloatField(db_column='uf_clp', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'arriendos'
        verbose_name = 'Arriendo'
        verbose_name_plural = 'Arriendos'

    def __str__(self):
        return f"{self.idArriendo} - {self.titulo}"


class Venta(models.Model):
    idVenta = models.IntegerField(db_column='idVenta', primary_key=True)
    fechaDescarga = models.DateField(db_column='fechaDescarga', blank=True, null=True)
    fechaCorrespondiente = models.DateField(db_column='fechaCorrespondiente', blank=True, null=True)
    titulo = models.CharField(db_column='titulo', max_length=255, blank=True, null=True)
    direccion = models.CharField(db_column='direccion', max_length=255, blank=True, null=True)
    
    idRegionComuna = models.IntegerField(db_column='idRegionComuna', blank=True, null=True)
    idComuna = models.IntegerField(db_column='idComuna', blank=True, null=True)
    
    disponibilidad = models.CharField(db_column='disponibilidad', max_length=255, blank=True, null=True)
    tipo = models.CharField(db_column='tipo', max_length=255, blank=True, null=True)
    superficieTotal = models.CharField(db_column='superficieTotal', max_length=255, blank=True, null=True)
    superficieUtil = models.CharField(db_column='superficieUtil', max_length=255, blank=True, null=True)
    superficiePonderada = models.CharField(db_column='superficiePonderada', max_length=255, blank=True, null=True)
    
    antiguedad = models.IntegerField(db_column='antiguedad', blank=True, null=True)
    dataAntiguedad = models.CharField(db_column='dataAntiguedad', max_length=15, blank=True, null=True)
    amoblado = models.IntegerField(db_column='amoblado', blank=True, null=True)
    precio = models.IntegerField(db_column='precio', blank=True, null=True)
    moneda = models.CharField(db_column='moneda', max_length=2, blank=True, null=True)
    uf_m2 = models.FloatField(db_column='uf_m2', blank=True, null=True)
    habitaciones = models.IntegerField(db_column='habitaciones', blank=True, null=True)
    banos = models.IntegerField(db_column='banos', blank=True, null=True)
    estacionamientos = models.IntegerField(db_column='estacionamientos', blank=True, null=True)
    bodegas = models.IntegerField(db_column='bodegas', blank=True, null=True)
    url = models.CharField(db_column='url', max_length=255, blank=True, null=True)
    latitud = models.FloatField(db_column='latitud', blank=True, null=True)
    longitud = models.FloatField(db_column='longitud', blank=True, null=True)
    uf_clp = models.FloatField(db_column='uf_clp', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ventas'
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'

    def __str__(self):
        return f"{self.idVenta} - {self.titulo}"


class ArriendoVenta(models.Model):
    idArriendoVenta = models.IntegerField(db_column='idArriendoVenta', primary_key=True)
    
    # Foreign Keys
    arriendo = models.ForeignKey(Arriendo, models.DO_NOTHING, db_column='idArriendo', related_name='arriendos_ventas')
    venta = models.ForeignKey(Venta, models.DO_NOTHING, db_column='idVenta', related_name='arriendos_ventas')
    
    distancia = models.IntegerField(db_column='distancia', blank=True, null=True)
    precioTransformadoLineal = models.FloatField(db_column='precioTransformadoLineal', blank=True, null=True)
    precioTransformadoPonderado = models.FloatField(db_column='precioTransformadoPonderado', blank=True, null=True)
    inversoDistanciaFactor = models.FloatField(db_column='inversoDistanciaFactor', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'arriendosventas'
        verbose_name = 'Arriendo Venta'
        verbose_name_plural = 'Arriendos Ventas'

    def __str__(self):
        return f"Relation {self.idArriendoVenta}: Arriendo {self.arriendo_id} - Venta {self.venta_id}"