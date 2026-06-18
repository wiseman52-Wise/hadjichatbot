from django.urls import path
from . import views

urlpatterns = [
    path('inscription/', views.inscription),
    path('connexion/', views.connexion),
    path('deconnexion/', views.deconnexion),
    path('profil/', views.profil),
    path('token/refresh/', views.CookieTokenRefreshView.as_view()),
]
