from django.urls import path
from .views import *

urlpatterns = [
    path("signup", RegisterView.as_view(), name="register"),
    path('login', UserLoginView.as_view(), name='login'),
]
