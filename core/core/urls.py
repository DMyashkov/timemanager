# Import necessary modules
from django.conf import settings  # Application settings
from django.conf.urls.static import static  # Import static function
from django.contrib import admin  # Django admin module
from django.contrib.staticfiles.urls import \
    staticfiles_urlpatterns  # Static files serving
from django.urls import path  # URL routing

from authentication.views import *  # Import views from the authentication app
from authentication.views import home, login_page, register_page

urlpatterns = [
    path('api/home/', home, name="home"),
    path('api/login/', login_page, name="login"),
    path('api/register/', register_page, name="register"),
]
# Serve media files if DEBUG is True (development mode)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

# Serve static files using staticfiles_urlpatterns
urlpatterns += staticfiles_urlpatterns()
