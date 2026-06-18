from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Etudiant

class InscriptionSerializer(serializers.ModelSerializer):
    mot_de_passe = serializers.CharField(write_only=True, min_length=6)
    class Meta:
        model = Etudiant
        fields = ['first_name','last_name','username','email','serie_bac','moyenne_bac','numero_pv','mot_de_passe']

    def validate_username(self, v):
        if Etudiant.objects.filter(username=v).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return v

    def validate_email(self, v):
        if v and Etudiant.objects.filter(email=v).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        return v

    def validate_mot_de_passe(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def create(self, data):
        mdp = data.pop('mot_de_passe')
        u = Etudiant(**data)
        u.set_password(mdp)
        u.save()
        return u

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = ['id','first_name','last_name','username','email','serie_bac','moyenne_bac','numero_pv','date_inscription','is_staff']
        read_only_fields = ['id','date_inscription','is_staff']
