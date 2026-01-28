from authentication.models import CustomUser
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to the Home API"})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_page(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        validate_email(email)
    except ValidationError:
        return Response({"error": "Invalid Email Format"}, status=status.HTTP_400_BAD_REQUEST)

    if not CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Invalid Email"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response({"error": "Invalid Password"}, status=status.HTTP_400_BAD_REQUEST)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({"message": "Login successful", "token": token.key}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_page(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        validate_email(email)
    except ValidationError:
        return Response({"error": "Invalid Email Format"}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects.create_user(
        email=email,
        password=password,
    )
    user.save()

    token, _ = Token.objects.get_or_create(user=user)

    return Response({"message": "Account created successfully", "token": token.key}, status=status.HTTP_201_CREATED)
