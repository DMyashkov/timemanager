# auth_app/views.py

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password
from rest_framework.serializers import ModelSerializer
from rest_framework.permissions import AllowAny

# User Serializer
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# Register API
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        try:
            # Validate that required fields are present
            if not data.get('username') or not data.get('password'):
                return Response(
                    {"error": "Username and password are required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if username already exists
            if User.objects.filter(username=data['username']).exists():
                return Response(
                    {"error": "Username already exists"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create and save user (automatically saves to database)
            user = User.objects.create(
                username=data['username'],
                password=make_password(data['password']),
                email=data.get('email', '')
            )
            
            # Return serialized user data along with success message
            serializer = UserSerializer(user)
            return Response({
                "message": "User registered successfully",
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Login API with JWT token generation
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    data = request.data
    try:
        user = User.objects.get(username=data['username'])
        if user.check_password(data['password']):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

# User info endpoint
@api_view(['GET'])
def user_info(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)
