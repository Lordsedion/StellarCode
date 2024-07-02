from channels.routing import ProtocolTypeRouter, URLRouter
from api.middleware import APIKeyAuthMiddleware
import api.routing

application = ProtocolTypeRouter({
    'websocket': APIKeyAuthMiddleware(
        URLRouter(
            api.routing.websocket_urlpatterns
        )
    ),
})
