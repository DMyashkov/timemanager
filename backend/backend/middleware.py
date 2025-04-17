import logging

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.debug(f"Request path: {request.path}")
        logger.debug(f"Request method: {request.method}")
        logger.debug(f"Request headers: {request.headers}")
        
        response = self.get_response(request)
        
        logger.debug(f"Response status: {response.status_code}")
        return response 