from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        open_paths = ['/api/register/', '/api/login/']
        
        if request.path in open_paths:
            return None
            
        return super().authenticate(request) 