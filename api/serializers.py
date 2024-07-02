from rest_framework import serializers
from .models import *

class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = ['public_key', 'secret_key']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["receiver", "sender", "message"]


class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ["receiver", "sender", "message"]
