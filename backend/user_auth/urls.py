# auth_app/urls.py

from django.urls import path
from .views import RegisterView, login_view, user_info

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('user/', user_info, name='user-info'),
]
