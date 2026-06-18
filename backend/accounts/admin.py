from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Etudiant
@admin.register(Etudiant)
class EtudiantAdmin(UserAdmin):
    list_display = ['username','first_name','last_name','serie_bac','moyenne_bac','numero_pv','date_inscription']
    fieldsets = UserAdmin.fieldsets + (('BAC', {'fields': ('serie_bac','moyenne_bac','numero_pv')}),)
