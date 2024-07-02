from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(APIKey)
admin.site.register(Message)
admin.site.register(Code)
admin.site.register(Room)