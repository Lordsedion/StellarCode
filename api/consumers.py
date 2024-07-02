import json
from channels.generic.websocket import WebsocketConsumer
from .models import *
from asgiref.sync import async_to_sync
from .bot import simple_bot

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

        bot_response = simple_bot(message)

        async_to_sync(self.channel_layer.group_send) (
            self.room_group_name, 
                {
                    "type": "chat_message",
                    "message": {
                        "user": message,
                        "bot": bot_response
                    }
                }
        )

    
    def chat_message(self, event):
        message = event["message"]

        self.send(text_data=json.dumps({
                "message": message
            }))

    
    def verify(self, key):
        return APIKey.objects.filter(public_key=key).exists()


class FrontConsumer(WebsocketConsumer):
    def connect(self):
        
        key = self.scope['query_string'].decode().split('=')[1]

        self.room_name = "None"
        self.room_group_name = "None"

        self.room_id = "None"
        self.room_group_id = "None"
        
        if self.verify(key):
            self.accept()
            

            self.room_name = APIKey.objects.filter(public_key=key).values()[0]["secret_key"]
            self.room_group_name = f'chat_{self.room_name}'

            self.room_id = self.scope['url_route']['kwargs']['room_id']
            self.room_group_id = f'chat_{self.room_id}'

            print(f"Room name: {self.room_id}\nGroup Name: {self.room_group_id}")

            async_to_sync(self.channel_layer.group_add) (
                self.room_group_id,
                self.channel_name
                )
            print(f"User connected to room: {self.room_id} with key {key}")
            self.send_previous_messages()
        else:
            self.close()


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard) (
            self.room_group_id,
            self.channel_name
        )


    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        bot_response = simple_bot(message=message)

        if Room.objects.filter(room_id=self.room_id).exists():
            room = Room.objects.filter(room_id=self.room_id)[0]

            #Create message logic here.

        async_to_sync(self.channel_layer.group_send) (
            self.room_group_id, 
                {
                    "type": "chat_message",
                    "message": message
                }
        )
        
        async_to_sync(self.channel_layer.group_send) (
            self.room_group_name, 
                {
                    "type": "chat_message",
                    "message": {
                        "user": message,
                        "bot": bot_response
                    }
                }
        )

    
    def chat_message(self, event):
        message = event["message"]

        self.send(text_data=json.dumps({
                "message": message
            }))

    
    def verify(self, key):
        return APIKey.objects.filter(public_key=key).exists()
    

    def send_previous_messages(self):
        room = Room.objects.filter(room_id=self.room_id)[0]
        previous_messages = Message.objects.filter(room=room).order_by("created_at")
        for message in previous_messages:
            self.send(text_data=json.dumps({
                'message': message.message,
                "sender": message.sender.username,
                "receiver": message.receiver.username,
                "created_at": message.created_at.isoformat()
            }))
    

