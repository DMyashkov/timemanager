from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        # List of paths that don't require authentication
        open_paths = ['/api/register/', '/api/login/']
        
        # Skip authentication for specified paths
        if request.path in open_paths:
            return None
            
        # For all other paths, perform token authentication
        return super().authenticate(request) 