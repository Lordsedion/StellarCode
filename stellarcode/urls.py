from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from api.views import MyTokenObtainPairView, MyTokenRefreshView

from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls), 
    path("api/", include("api.urls")),
    path('api/token/access', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', MyTokenRefreshView.as_view(), name='token_refresh'),
    path("", include("frontend.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
