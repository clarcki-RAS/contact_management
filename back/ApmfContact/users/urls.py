# users/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/auth/register', views.register, name='register'),
]
