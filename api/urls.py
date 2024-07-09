from django.urls import path
from .views import *

urlpatterns = [
    path("signup", RegisterView.as_view(), name="register"),
    path('login', UserLoginView.as_view(), name='login'),
    path('token', TokenView.as_view(), name='token'),
    path('token_verify', VerifyTokenView.as_view(), name='token_verify'),
    path('room_view', ViewRoom.as_view(), name='room_view'),
    path('view_message', ViewMesage.as_view(), name='view_message'),
]
