from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from api.views import MyTokenObtainPairView, MyTokenRefreshView

from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("frontend.urls")),
    path("api/", include("api.urls")),
    path('api/token', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', MyTokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
