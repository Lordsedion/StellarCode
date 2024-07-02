from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import APIKey
from .serializers import *

class ValidateAPIKey(APIView):
    def post(self, request, *args, **kwargs):
        serializer = APIKeySerializer(data=request.data)
        if serializer.is_valid():
            key = serializer.validated_data.get('key')
            if APIKey.objects.filter(key=key).exists():
                return Response({"detail": "API key is valid"}, status=status.HTTP_200_OK)
            return Response({"detail": "Invalid API key"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class MessageView(generics.ListCreateAPIView):
#     def post(self,request):
#         serializer = MessageSerializer(data=request.data)
#         if serializer.is_valid():

            
