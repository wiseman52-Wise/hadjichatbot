from django.contrib import admin
from .models import Conversation, Message
class MsgInline(admin.TabularInline):
    model = Message; extra = 0; readonly_fields = ['role','contenu','created_at']
@admin.register(Conversation)
class ConvAdmin(admin.ModelAdmin):
    list_display = ['etudiant','titre','created_at']; inlines = [MsgInline]
