from django.urls import path
from . import views

urlpatterns = [
    # Universités & Filières
    path('universites/', views.universites),
    path('universites/<int:pk>/', views.universite_detail),
    path('filieres/', views.filieres),
    path('filieres/<int:pk>/', views.filiere_detail),

    # FAQ & Calendrier
    path('faq/', views.faq),
    path('faq/<int:pk>/', views.faq_detail),
    path('calendrier/', views.calendrier),
    path('calendrier/<int:pk>/', views.calendrier_detail),

    # Stats
    path('stats/', views.stats),

    # Conversations
    path('conversations/', views.conversations),
    path('conversations/<int:pk>/', views.conversation_detail),
    path('conversations/message/', views.envoyer_message),

    # Feedback
    path('messages/<int:message_id>/feedback/', views.message_feedback),

    # Chat anonyme (sans auth, fallback local)
    path('chat-anonyme/', views.chat_anonyme),
]
