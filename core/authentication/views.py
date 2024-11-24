from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response

from authentication.models import CustomUser


@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to the Home API"})


@api_view(['POST'])
def login_page(request):
    email = request.data.get('email')  # Use email instead of username
    password = request.data.get('password')

    if not CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Invalid Email"}, status=400)

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response({"error": "Invalid Password"}, status=400)

    login(request, user)
    return Response({"message": "Login successful"})


@api_view(['POST'])
def register_page(request):
    email = request.data.get('email')  # Use email for registration
    password = request.data.get('password')

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already taken"}, status=400)

    # Create user
    user = CustomUser.objects.create_user(
        email=email,
        password=password,
    )
    user.save()

    return Response({"message": "Account created successfully"})
