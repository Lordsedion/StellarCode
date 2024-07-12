from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import APIKey
from .serializers import *
from django.http import HttpResponse, FileResponse, JsonResponse
from django.contrib.auth import login, authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
import jwt
from django.utils import timezone
from datetime import timedelta
from datetime import datetime
from django.core.files import File
import environ

# Initialize environment variables
env = environ.Env()
environ.Env.read_env()

class MyTokenObtainPairView(TokenObtainPairView):
    pass

class MyTokenRefreshView(TokenRefreshView):
    pass


def generate_username(name):
    while User.objects.filter(username=name).exists():
        print( not User.objects.filter(username=name).exists())
        code = ''.join(rnd.choices(string.digits+string.ascii_letters, k=5))
        name = name+code
    return name


def get_email_name(email):
    match = re.match(r"([^@]+)@", email)
    if match:
        return match.group(1)
    return None

class VerifyTokenView(generics.CreateAPIView):
    serializer_class = GetTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = GetTokenSerializer(data=request.data)
        print(serializer, serializer.is_valid(), serializer.validated_data)
        if serializer.is_valid():
            token = serializer.validated_data["access_token"]
            refresh_token = serializer.validated_data["refresh_token"]

            decoded_token = jwt.decode(token, options={"verify_signature": False})
            user = User.objects.filter(id=decoded_token['user_id'])[0]
            api_key = APIKey.objects.filter(user=user).values()[0]["public_key"]

            try:
                AccessToken(token=token).verify()
                return Response({
                    "username": user.username,
                    "apiKey": api_key,
                    "message": True
                }, status=status.HTTP_200_OK)
            except TokenError as e:
                print(e, token)
                try:
                    RefreshToken(token=refresh_token).verify()
                    access_token = RefreshToken(token=refresh_token).access_token
                    print(f"I'm alive!!! {access_token}")
                    return Response({
                        "username": user.username,
                        "apiKey": api_key,
                        "message": "reset",
                        "token": f"{access_token}"
                    }, status=status.HTTP_201_CREATED) 
                except:
                    print("Firte fire fire")
                    return Response({
                        "message": f"Invalid Token!!! {e} {token}", 
                    }, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {"message": "Invalid token"}
        , status=status.HTTP_400_BAD_REQUEST)

class TokenView(generics.CreateAPIView):
    serializer_class = TokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = TokenSerializer(data=request.data)

        if serializer.is_valid():
            token = serializer.validated_data["access_token"]
            try:
                decoded_token = jwt.decode(token, options={"verify_signature": False})
                exp = decoded_token.get("exp")
                if exp: 
                    expiration_time = datetime.fromtimestamp(exp)
                    current_time = datetime.now()

                    if expiration_time < current_time:
                        return Response({
                            "message": "Expired token, Login to use app",
                        }, status=status.HTTP_403_FORBIDDEN)
                    else:
                        if True:# not User.objects.filter(email=decoded_token["email"]).exists():
                            user = User.objects.create_user(
                                generate_username(get_email_name(decoded_token["email"])),
                                decoded_token["email"],
                                env("SOCIAL_SECRET")
                            )


                            Profile.objects.create(
                                user=user,
                                email=decoded_token["email"],
                                image=decoded_token["picture"],
                                credits=1000
                            )

                            login(request, user)
                            refresh = RefreshToken.for_user(user)


                            return Response({
                                "access": str(refresh.access_token),
                                "refresh": str(refresh),
                                "response": decoded_token,
                            }, status=status.HTTP_200_OK)
            except:
                return Response({
                    "message": f"Invalid Token!!! {token}", 
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(f"Invalid request!")


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            if not User.objects.filter(email=serializer.validated_data["email"]).exists():
                user = User.objects.create_user(
                    generate_username(get_email_name(serializer.validated_data["email"])),
                    serializer.validated_data["email"],
                    serializer.validated_data["password"]
                )

                profile = Profile.objects.create(
                   serializer.validated_data["email"],
                    credits=1000
                )
                login(request, user)

                refresh = RefreshToken.for_user(user)

                return Response(({
                    'user': RegisterSerializer(user, context=self.get_serializer_context()).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }))
            else:
                return Response({
                    "message": "User with email exists!"
                })
        
        return Response({
            "error": "Username or email constraint"
        })


class UserLoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        print(serializer, serializer.is_valid())
        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = None
            password = serializer.validated_data['password']

            if User.objects.filter(email=email).exists():
                username = User.objects.get(email=email).username

            if username != None:
                user = authenticate(username=username, password=password)
                # print(f"Hello {user}")
                try:
                    if user.is_active:
                        profile_picture = f'http://localhost:8000/{Profile.objects.filter(user=user).values()[0]["image"]}'
                        login(request, user)
                        refresh = RefreshToken.for_user(user)

                        return Response({
                            "success": "Success",
                            "access": str(refresh.access_token),
                            "refresh": str(refresh),
                            "picture": profile_picture,
                            "email": get_email_name(email=email),
                            # "status": status.HTTP_200_OK
                            })
                except Exception as e:
                    print(f"Exception {e}")
        return HttpResponse(f"User does not exist")
    

class ViewRoom(generics.ListAPIView):
    serializer_class = ViewRoomSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        one_week_ago = timezone.now() - timedelta(days=7)
        rooms_by_user = Room.objects.filter(user=user, created_at__gte=one_week_ago).order_by("-created_at").values()
        older_rooms = Room.objects.filter(user=user, created_at__lt=timezone.now() - timedelta(days=7)).order_by("created_at").values()
        
        return Response({
            "user": user.username,
            "room": rooms_by_user,
            "older": older_rooms,
        })


class ViewMesage(generics.CreateAPIView):
    serializer_class = ViewMessageSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        room_id = request.data["room_id"]
        room = Room.objects.filter(room_id=room_id)[0]
        room_messages = Message.objects.filter(room=room).values()

        return Response({
            "user": user.username,
            "message": room_messages
        })
    


class CreateRoom(generics.CreateAPIView):
    serializer_class = ViewRoomSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        user = request.user
        print(f"User o {user}")

        room_name = f'New Room {Room.objects.filter(user=request.user).order_by("-created_at").values()[0]["id"]}'

        room = Room.objects.create(
            name = room_name,
            user = request.user
        )

        return Response({
            "room_id": room.room_id,
            "name": room.name,
            "user": room.user.username
        })

# class MessageView(generics.ListCreateAPIView):
#     def post(self,request):
#         serializer = MessageSerializer(data=request.data)
#         if serializer.is_valid():

            
