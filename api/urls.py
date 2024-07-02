from django.urls import path
from .views import ValidateAPIKey

urlpatterns = [
    path('validate-key/', ValidateAPIKey.as_view(), name='validate-key'),
]
