from django.db import models
from django.conf import settings # Para enlazar con el modelo User

class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pendiente'),
        ('COMPLETED', 'Completado'),
        ('FAILED', 'Fallido'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name="Usuario"
    )
    property = models.ForeignKey(
        'properties.Property',  # Enlaza al modelo Property de la app 'properties'
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name="Propiedad"
    )
    buy_order = models.CharField(max_length=255, unique=True, verbose_name="Orden de Compra")
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Monto")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', verbose_name="Estado")
    
    # Campos que se llenarán durante el flujo de Transbank
    transbank_token = models.CharField(max_length=255, null=True, blank=True, unique=True)
    response_code = models.IntegerField(null=True, blank=True)
    raw_response = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    confirmed_at = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de Confirmación")

    def __str__(self):
        return f"Transacción {self.buy_order} - {self.status}"