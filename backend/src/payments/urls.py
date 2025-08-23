from django.urls import path
from .views import CreateTransactionView, ConfirmTransactionView

urlpatterns = [
    path('create/', CreateTransactionView.as_view(), name='payment-create'),
    path('confirm/', ConfirmTransactionView.as_view(), name='payment-confirm'),
]