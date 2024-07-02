import json
from channels.generic.websocket import WebsocketConsumer
from .models import *
from asgiref.sync import async_to_sync


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print(f"Hello boss {self.scope['query_string'].decode().split('=')[1]}")
        
        key = self.scope['query_string'].decode().split('=')[1]     
        
        self.room_name = "None"
        self.room_group_name = "None"
        
        if self.verify(key):
            self.accept()
            self.room_name = APIKey.objects.filter(public_key=key).values()[0]["secret_key"]
            self.room_group_name = f'chat_{self.room_name}'

            print(f"Room name: {self.room_name}\nGroup Name: {self.room_group_name}")

            async_to_sync(self.channel_layer.group_add) (
                self.room_group_name,
                self.channel_name
                )
            print(f"User connected to room: {self.room_name} with key {key}")
            
        else:
            self.close()


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard) (
            self.room_group_name,
            self.channel_name
        )


    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        async_to_sync(self.channel_layer.group_send) (
            self.room_group_name, 
                {
                    "type": "chat_message",
                    "message": message
                }
        )

    
    def chat_message(self, event):
        message = event["message"]

        self.send(text_data=json.dumps({
                "message": message
            }))

    
    def verify(self, key):
        return APIKey.objects.filter(public_key=key).exists()

