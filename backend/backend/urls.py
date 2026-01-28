from authentication.views import * 
from authentication.views import home, login_page, register_page
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import \
    staticfiles_urlpatterns
from django.urls import path
from django.urls import include

urlpatterns = [
    path('api/home/', home, name="home"),
    path('api/login/', login_page, name="login"),
    path('api/register/', register_page, name="register"),
    path('admin/', admin.site.urls),
    path('api/', include('tags.urls')), 
    path('api/', include('time_sessions.urls')),
    path('api/', include('tasks.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

urlpatterns += staticfiles_urlpatterns()
