from django.db import models
from django.contrib.auth.models import User
import random as rnd
import string
from .models import *
# Create your models here.


def generate_key():
    while True:
        code = ''.join(rnd.choices(string.digits+string.ascii_letters, k=64))
        if APIKey.objects.filter(public_key=code).count() == 0:
            break
    return code


def generate_secret():
    while True:
        code = ''.join(rnd.choices(string.digits+string.ascii_letters, k=64))
        if APIKey.objects.filter(secret_key=code).count() == 0:
            break
    return code


def generate_room_id():
    while True:
        code = ''.join(rnd.choices(string.digits+string.ascii_letters, k=64))
        if Room.objects.filter(room_id=code).count() == 0:
            break
    return code


class APIKey(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    public_key = models.CharField(max_length=64, default=generate_key, unique=True)
    secret_key = models.CharField(max_length=64, default=generate_secret, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self) -> str:
        return f"{self.user.username}"
    

    class Meta:
        unique_together = ('user',)


class Room(models.Model):
    room_id = models.CharField(max_length=64, unique=True, default=generate_room_id)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self) -> str:
        return f"Room created by {self.user.username}"


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    message = models.CharField(max_length=50000)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self) -> str:
        return f"Message by {self.sender.username}"   
    

class Code(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="code_server")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="code_client")
    message = models.CharField(max_length=50000)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self) -> str:
        return f"Code to {self.receiver.username}"




