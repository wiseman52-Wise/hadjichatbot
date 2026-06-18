from rest_framework import serializers
from .models import Universite, Filiere, FAQEntry, CalendrierEvent, Conversation, Message, MessageFeedback


class FiliereSerializer(serializers.ModelSerializer):
    universite_sigle = serializers.CharField(source='universite.sigle', read_only=True)
    universite_nom = serializers.CharField(source='universite.nom', read_only=True)
    universite_color = serializers.CharField(source='universite.color', read_only=True)

    class Meta:
        model = Filiere
        fields = ['id', 'universite', 'universite_sigle', 'universite_nom', 'universite_color',
                  'nom', 'moyenne_requise', 'profils_acceptes', 'capacite', 'duree',
                  'debouches', 'conditions_admission']


class UniversiteSerializer(serializers.ModelSerializer):
    filieres = FiliereSerializer(many=True, read_only=True)
    nb_filieres = serializers.SerializerMethodField()

    def get_nb_filieres(self, obj):
        return obj.filieres.count()

    class Meta:
        model = Universite
        fields = ['id', 'nom', 'sigle', 'ville', 'description', 'capacite',
                  'color', 'image_url', 'filieres', 'nb_filieres']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQEntry
        fields = ['id', 'question', 'reponse', 'categorie']


class CalendrierEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendrierEvent
        fields = ['id', 'titre', 'date_debut', 'date_fin', 'description']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'contenu', 'created_at']


class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'titre', 'created_at', 'updated_at', 'messages']


class MessageFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageFeedback
        fields = ['id', 'message', 'est_positif', 'commentaire']
