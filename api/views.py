from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import APIKey
from .serializers import *
from django.http import HttpResponse, FileResponse, JsonResponse
from django.contrib.auth import login, authenticate
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

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
                        profile_picture = f'http://localhost:8000/{Profile.objects.filter(email=email).values()[0]["image"]}'
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

# class MessageView(generics.ListCreateAPIView):
#     def post(self,request):
#         serializer = MessageSerializer(data=request.data)
#         if serializer.is_valid():

            
