import json
from channels.generic.websocket import WebsocketConsumer
from .models import *
from asgiref.sync import async_to_sync
from .bot import simple_bot
from .bots.bot import default_bot

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

        bot_response = default_bot(message)

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
        
        self.key = self.scope['query_string'].decode().split('=')[1]
        self.user = self.scope['user']

        self.user = User.objects.filter(id=APIKey.objects.filter(public_key=self.key).values()[0]["user_id"])[0]
        self.receiver = User.objects.filter(username="Stellarcode")[0]

        print(f"User is {self.user}")

        self.room_name = "None"
        self.room_group_name = "None"
        self.is_authenticated = False
        self.bot_response = ""

        self.room_id = "None"
        self.room_group_id = "None"
        
        # if user.is_authenticated:
        if self.verify(self.key):
            self.accept()
            

            self.room_name = APIKey.objects.filter(public_key=self.key).values()[0]["secret_key"]
            self.room_group_name = f'chat_{self.room_name}'

            self.room_id = self.scope['url_route']['kwargs']['room_id']
            self.room_group_id = f'chat_{self.room_id}'

            print(f"Room name: {self.room_id}\nGroup Name: {self.room_group_id}")

            async_to_sync(self.channel_layer.group_add) (
                self.room_group_id,
                self.channel_name
                )
            print(f"User connected to room: {self.room_id} with key {self.key}")
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

        self.bot_response = simple_bot(message=message)

        if Room.objects.filter(room_id=self.room_id).exists():
            room = Room.objects.filter(room_id=self.room_id)[0]

            # Create message logic here. 
            new_message = Message.objects.create(
                sender = self.user, 
                receiver = self.receiver, # Edit later to support the actual sender which should be bot
                room = room,
                message = message
            )

            bot_message = Message.objects.create(
                sender = self.receiver,
                receiver = self.user,
                room = room,
                message = self.bot_response
            )

        async_to_sync(self.channel_layer.group_send) (
            self.room_group_id, 
                {
                    "type": "chat_message",
                    "message": message,
                    "username": self.user.username,
                    # "timestamp": new_message.timestamp.isoformat()
                }
        )
        
        bot_res = default_bot(message)
        async_to_sync(self.channel_layer.group_send) (
            
            self.room_group_name, 
                {
                    "type": "chat_message",
                    "message": {
                        "user": message,
                        "bot": bot_res,
                    }
                }
        )

    
    def chat_message(self, event):
        message = event["message"]

        try:
            room = Room.objects.filter(room_id=self.room_id)[0]
            bot = Message.objects.filter(room=room).order_by("-created_at")[0]
            messages = Message.objects.filter(room=room).order_by("-created_at")[1]

            fr_response = simple_bot(self.bot_response)

            self.send(text_data=json.dumps({
                    'message': messages.message,
                    "sender": messages.sender.username,
                    "receiver": messages.receiver.username,
                    "created_at": messages.created_at.isoformat(),
                    "id": messages.id,
                    "room_id": messages.room_id
                }))
            
            self.send(text_data=json.dumps({
                    'message': bot.message,
                    "sender": bot.sender.username,
                    "receiver": bot.receiver.username,
                    "created_at": bot.created_at.isoformat(),
                    "id": bot.id,
                    "room_id": bot.room_id
                }))
        except:
            print("Nothing found here")

    
    def verify(self, key):
        return APIKey.objects.filter(public_key=key).exists()
    

    def send_previous_messages(self):
        try:
            room = Room.objects.filter(room_id=self.room_id)[0]
            previous_messages = Message.objects.filter(room=room).order_by("created_at")
            for message in previous_messages:
                self.send(text_data=json.dumps({
                    'message': message.message,
                    "sender": message.sender.username,
                    "receiver": message.receiver.username,
                    "created_at": message.created_at.isoformat(),
                    "id": message.id,
                    "room_id": message.room_id
                }))
        except:
            print("No item found in this room")
    

