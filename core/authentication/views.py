from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to the Home API"})


@api_view(['POST'])
def login_page(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not User.objects.filter(username=username).exists():
        return Response({"error": "Invalid Username"}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Invalid Password"}, status=400)

    login(request, user)
    return Response({"message": "Login successful"})


@api_view(['POST'])
def register_page(request):
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    user = User.objects.create_user(
        first_name=first_name,
        last_name=last_name,
        username=username,
        password=password,
    )
    user.save()

    return Response({"message": "Account created successfully"})
