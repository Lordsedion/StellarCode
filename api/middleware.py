from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from .models import APIKey

@database_sync_to_async
def validate_api_key(key):
    return APIKey.objects.filter(key=key).exists()

class APIKeyAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope['query_string'].decode())
        api_key = query_string.get('api_key', [None])[0]
        if api_key and await validate_api_key(api_key):
            scope['user'] = 'authenticated'
        else:
            scope['user'] = 'anonymous'
        return await super().__call__(scope, receive, send)
