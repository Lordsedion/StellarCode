"""

||| REMEMBER REMEMBER REMEMBER |||

    I wanna love you forever
    Baby oh, do you remember?
    Remember, my baby, remember

    I just want to spend all my cheddar on you
    Ọmọ to dun jọ-jọ, jọ
    Fun mi l'eyo kan, kin toh

    Ragabomi jọ, n to, to
    I know say you want some more
    Mr. Money with vibе, you know, I no dey dull
    Don't dull, dull
    Give it to me jọ-jọ, jọ

    Je a jo ma shakiti bobo
    Skepele, Barbie jọ
    My chubby Babylon, I dey knock on your door, door, door
    Give it to me jọ-jọ, jọ

    Je a jo ma shakiti bobo
    Skepele, Barbie jọ
    My chubby Babylon, I dey knock on your door

"""


import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer # type: ignore
from asgiref.sync import sync_to_async # type: ignore
from .models import *
from asgiref.sync import async_to_sync # type: ignore
from .bots.bot import programmer, dependency_bot, simple_bot, executioner_bot, debugger
from itertools import chain
from operator import attrgetter

@sync_to_async
def verify(key):
        return APIKey.objects.filter(public_key=key).exists()
    
@sync_to_async
def get_key(key):
        return APIKey.objects.filter(public_key=key).values()[0]["secret_key"]

@sync_to_async
def get_user(key):
    return APIKey.objects.filter(public_key=key)[0].user

@sync_to_async
def get_room(user, rm):
    return Room.objects.filter(user=user, name=rm["room"])[0]

@sync_to_async
def get_code(room):
    return Code.objects.filter(room=room).order_by("created_at")


def get_code_pure(room):
    return Code.objects.filter(room=room).order_by("created_at")


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(f"Hello boss {self.scope['query_string'].decode().split('=')[1]}")
        
        self.key = self.scope['query_string'].decode().split('=')[1]     
        
        self.room_name = "None"
        self.room_group_name = "None"
        
        if await verify(self.key):
            await self.accept()
            self.room_name = await get_key(self.key)
            self.room_group_name = f'chat_{self.room_name}'

            print(f"Room name: {self.room_name}\nGroup Name: {self.room_group_name}\nKey: {await verify(self.key)}")

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
                )
            print(f"User connected to room: {self.room_name} with key {self.key}")
            
        else:
            await self.close()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        room = "None"
        message = text_data_json['message']
        room_name = text_data_json["room"]

        print(f"message received by server to client: {text_data_json}\n\n\n")

        # async_to_sync(self.channel_layer.group_send) (
        #     self.room_group_name, 
        #         {   
        #             "type": "chat_message",
        #             "message": {
        #                 "user": message,
        #                 "bot": bot_response
        #             }
        #         }
        # )

        history = []
        self.user = await get_user(self.key)
        print(f"Key: {self.key}\nRoom Name: {self.room_name}\nUser: {self.user}")

        room = await get_room(self.user, rm=text_data_json["room"])

        code_in_room = await get_code(room)

        items_in_room = list(chain(code_in_room))
        sorted_items = sorted(items_in_room, key=attrgetter("created_at"), reverse=True)

        for item in sorted_items:
            if item.sender.username == self.user.username or item.sender.username == "DrymFyre":
                history.append({"role": "user", "parts": item.message})
            elif item.sender.username == "code":
                history.append({"role": "model", "parts": item.message})

        history.append({"role": "model", "parts": text_data_json["message"]})

        bot_res = debugger(message, chat_history=history)

        bot_res = bot_res

        await (self.channel_layer.group_send) (
            self.room_group_name, 
                {   
                    "type": "chat_message",
                    "message": {
                        "response": bot_res
                    }
                }
        )

        # code_sender = User.objects.filter(username="DrymFyre")[0]
        # for block in bot_res:

        #     code = Code.objects.create(
        #         sender = code_sender,
        #         receiver = self.user,
        #         room = room,
        #         message=bot_res[block],
        #         name = str(block),
        #     )

        #     self.send(text_data=json.dumps({
        #         'message': code.message,
        #         "sender": code.sender.username,
        #         "receiver": code.receiver.username,
        #         "created_at": code.created_at.isoformat(),
        #         "id": code.id,
        #         "room_id": code.room_id,
        #         "name": code.name,
        #         "language": code.language
        #     }))


        # dependencies = dependency_bot(str(bot_res))
        # shell_commands = executioner_bot(str(bot_res))

        # async_to_sync(self.channel_layer.group_send) (
        #     self.room_group_name, 
        #         {
        #             "type": "chat_message",
        #             "message": {
        #                 "user": message,
        #                 "bot": bot_res,
        #                 "directory_name": room_name,
        #                 "dependency": dependencies,
        #                 "shell_commands": shell_commands
        #             }
        #         }
        # )


    
    async def chat_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({
                "message": message
            }))



@sync_to_async
def get_user_front(key):
    return APIKey.objects.filter(public_key=key)[0].user
    # return User.objects.filter(id=APIKey.objects.filter(public_key=key).values()[0]["user_id"])[0]


@sync_to_async
def get_base_user():
    return User.objects.filter(username="Stellarcode")[0]

@sync_to_async 
def get_secret_front(key):
    return APIKey.objects.filter(public_key=key).values()[0]["secret_key"]

@sync_to_async
def verify_room(room_id):
    return Room.objects.filter(room_id=room_id).exists()

@sync_to_async
def get_room_front(room_id):
    return Room.objects.filter(room_id=room_id)[0]


def get_room_front_pure(room_id):
    return Room.objects.filter(room_id=room_id)[0]


@sync_to_async
def create_message(user, receiver, room, message):
    return Message.objects.create(
                sender = user, 
                receiver = receiver, # Edit later to support the actual sender which should be bot
                room = room,
                message = message
            )


@sync_to_async
def filter_messages_begin(room):
    return Message.objects.filter(room=room).order_by("-created_at")[0]


@sync_to_async
def filter_messages_end(room):
    return Message.objects.filter(room=room).order_by("created_at")[0]


def filter_messages_end_pure(room):
    return Message.objects.filter(room=room).order_by("created_at")

@sync_to_async
def get_tips(room):
    return ProductAgent.objects.filter(room=room).order_by("created_at")

@sync_to_async
def get_base_user_2():
    return User.objects.filter(username="DrymFyre")[0]

@sync_to_async
def create_code(sender, receiver, room, message, name):
    return Code.objects.create(
                    sender = sender,
                    receiver = receiver,
                    room = room,
                    message= message,
                    name = name,
                )

@sync_to_async
def create_message_2(user, receiver, room, bot_response):
    return Message.objects.create(
                sender = receiver,
                receiver = user,
                room = room,
                message = bot_response
            )

class FrontConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        self.key = self.scope['query_string'].decode().split('=')[1]
        self.user = self.scope['user']

        try:
            self.user = await get_user_front(self.key)
        except Exception as e:
            print(f"Boring: {e} {self.user}")
            await self.send_previous_messages()
        self.receiver = await get_base_user()

        print(f"User is {self.user}, {self.key} {await verify(self.key)}")

        self.room_name = "None"
        self.room_group_name = "None"
        self.is_authenticated = False
        self.bot_response = ""

        self.room_id = "None"
        self.room_group_id = "None"
        
        # if user.is_authenticated:
        if await verify(self.key):
            await self.accept()

            self.room_name = await get_secret_front(self.key)
            self.room_group_name = f'chat_{self.room_name}'

            self.room_id = self.scope['url_route']['kwargs']['room_id']
            self.room_group_id = f'chat_{self.room_id}'

            if self.room_id == "undefined":
                await self.close()

            print(f"Room name: {self.room_id}\nGroup Name: {self.room_group_id}")

            await (self.channel_layer.group_add) (
                self.room_group_id,
                self.channel_name
                )
            print(f"User connected to room: {self.room_id} with key {self.key}")
            self.send_previous_messages()

            
        else:
            await self.close()


    async def disconnect(self, close_code):
        await (self.channel_layer.group_discard) (
            self.room_group_id,
            self.channel_name
        )


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        room = None
        room_name = ""

        if await verify_room(self.room_id) and message != "":
            room = await get_room_front(self.room_id)
            room_name = room.name

            # Create message logic here. 
            
            new_message = await create_message(user=self.user, receiver=self.receiver, room=room,message=message)

            messages = await filter_messages_begin(room)
            
            # Sends message received from the user back to the frontend ui to be displayed.
            await self.send(text_data=json.dumps({
                    'message': messages.message,
                    "sender": messages.sender.username,
                    "receiver": messages.receiver.username,
                    "created_at": messages.created_at.isoformat(),
                    "id": messages.id,
                    "room_id": messages.room_id
                }))
            
            message_in_room = await filter_messages_end(room)
            tips_in_room = await get_tips(room)
            code_in_room = await get_code(room=room)

            items_in_room = list(chain(message_in_room, code_in_room, tips_in_room))
            sorted_items = sorted(items_in_room, key=attrgetter("created_at"), reverse=True)
            
            history = []
            for item in sorted_items:
                if item.sender.username == self.user.username or item.sender.username == "DrymFyre":
                    history.append({"role": "user", "parts": item.message})
                elif item.sender.username == "code":
                    history.append({"role": "model", "parts": item.message})

            bot_res = programmer(message, chat_history=history)

            bot_res = bot_res
            code_sender = await get_base_user_2()
            for block in bot_res:

                code = await create_code(
                    sender=code_sender,
                    receiver=self.user,
                    room=room,
                    message=bot_res[block],
                    name = str(block),
                    )

                await self.send(text_data=json.dumps({
                    'message': code.message,
                    "sender": code.sender.username,
                    "receiver": code.receiver.username,
                    "created_at": code.created_at.isoformat(),
                    "id": code.id,
                    "room_id": code.room_id,
                    "name": code.name,
                    "language": code.language
                }))


            dependencies = dependency_bot(str(bot_res))
            shell_commands = executioner_bot(directory=room.name, prompt=str(bot_res))

            await (self.channel_layer.group_send) (
                self.room_group_name, 
                    {
                        "type": "chat_message",
                        "message": {
                            "user": message,
                            "bot": bot_res,
                            "directory_name": room_name,
                            "dependency": dependencies,
                            "shell_commands": shell_commands
                        }
                    }
            )
            
            self.bot_response = simple_bot(message=str(bot_res))
            bot_message = await create_message_2(
                sender = self.receiver,
                receiver = self.user,
                room = room,
                message = self.bot_response
                )

            bot = await filter_messages_begin(room=room)
            
            await self.send(text_data=json.dumps({
                    'message': bot.message,
                    "sender": bot.sender.username,
                    "receiver": bot.receiver.username,
                    "created_at": bot.created_at.isoformat(),
                    "id": bot.id,
                    "room_id": bot.room_id
                }))


        # async_to_sync(self.channel_layer.group_send) (
        #     self.room_group_id, 
        #         {
        #             "type": "chat_message",
        #             "message": message,
        #             "username": self.user.username,
        #             # "timestamp": new_message.timestamp.isoformat()
        #         }
        # )

    
    async def chat_message(self, event):
        message = event["message"]

        try:
            room = await get_room_front(room_id=self.room_id)
            # room = Room.objects.filter(room_id=self.room_id)[0]
            bot = await filter_messages_begin(room=room)
            # messages = Message.objects.filter(room=room).order_by("-created_at")[1]

            # fr_response = simple_bot(self.bot_response)

            # self.send(text_data=json.dumps({
            #         'message': messages.message,
            #         "sender": messages.sender.username,
            #         "receiver": messages.receiver.username,
            #         "created_at": messages.created_at.isoformat(),
            #         "id": messages.id,
            #         "room_id": messages.room_id
            #     }))
            
            await self.send(text_data=json.dumps({
                    'message': bot.message,
                    "sender": bot.sender.username,
                    "receiver": bot.receiver.username,
                    "created_at": bot.created_at.isoformat(),
                    "id": bot.id,
                    "room_id": bot.room_id
                }))
        except:
            print("Nothing found here")

    
    # async def verify(self, key):
    #     return APIKey.objects.filter(public_key=key).exists()
    

    async def send_previous_messages(self,):
        try:
            room = get_room_front_pure(room_id=self.room_id)
            messages = filter_messages_end_pure(room=room)
            code = get_code_pure(room=room)
            previous_messages = list(chain(messages, code))

            previous_messages = sorted(previous_messages, key=attrgetter("created_at"))
            for message in previous_messages:
                if message._meta.model_name == "message":
                    await self.send(text_data=json.dumps({
                        'message': message.message,
                        "sender": message.sender.username,
                        "receiver": message.receiver.username,
                        "created_at": message.created_at.isoformat(),
                        "id": message.id,
                        "language": "",
                        "room_id": message.room_id,
                        "name": ""
                    }))
                else:
                    await self.send(text_data=json.dumps({
                    'message': message.message,
                    "sender": message.sender.username,
                    "receiver": message.receiver.username,
                    "created_at": message.created_at.isoformat(),
                    "language": message.language,
                    "id": message.id,
                    "room_id": message.room_id,
                    "name": message.name
                }))
        except Exception as e:
            print(f"No item found in this room {e}")
    

