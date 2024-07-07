from rest_framework import serializers
from .models import *
import re, string

def get_email_name(email):
    match = re.match(r"([^@]+)@", email)
    if match:
        return match.group(1)
    return None

class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = ['public_key', 'secret_key']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["receiver", "sender", "message"]


def generate_username(name):
    while User.objects.filter(username=name).exists():
        print( not User.objects.filter(username=name).exists())
        code = ''.join(rnd.choices(string.digits+string.ascii_letters, k=5))
        name = name+code
    return name
        


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password"]

    def create(self, validated_data):
        if not User.objects.filter(email=validated_data["email"]).exists():
            user = User.objects.create_user(
                generate_username(get_email_name(validated_data["email"])),
                validated_data["email"],
                validated_data["password"]
            )
            return user
        return "Invalid Email"
    

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password"]
    
    email = serializers.CharField()
    password = serializers.CharField(style={
        "input_type": "password"
    })


class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ["receiver", "sender", "message"]
