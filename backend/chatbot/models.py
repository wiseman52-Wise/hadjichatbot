from django.db import models
from accounts.models import Etudiant

class Universite(models.Model):
    nom = models.CharField(max_length=200)
    sigle = models.CharField(max_length=20, unique=True)
    ville = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    capacite = models.IntegerField(default=0)
    color = models.CharField(max_length=20, default="#1a56db")
    image_url = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return f"{self.sigle} - {self.nom}"

class Filiere(models.Model):
    universite = models.ForeignKey(Universite, on_delete=models.CASCADE, related_name='filieres')
    nom = models.CharField(max_length=200)
    moyenne_requise = models.FloatField(default=10.0)
    profils_acceptes = models.CharField(max_length=100, help_text="ex: SE, SM, SS-FA")
    capacite = models.IntegerField(default=0)
    duree = models.CharField(max_length=50, default="3 ans")
    debouches = models.TextField(blank=True)
    conditions_admission = models.TextField(blank=True)

    def __str__(self):
        return f"{self.nom} ({self.universite.sigle})"

class FAQEntry(models.Model):
    CATEGORIES = [
        ('admission', 'Admission & Inscription'),
        ('bourse', 'Bourses & Frais'),
        ('logement', 'Logement & Vie'),
        ('autre', 'Autre'),
    ]
    question = models.CharField(max_length=255)
    reponse = models.TextField()
    categorie = models.CharField(max_length=20, choices=CATEGORIES, default='autre')
    
    def __str__(self):
        return self.question

class CalendrierEvent(models.Model):
    titre = models.CharField(max_length=200)
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.titre} ({self.date_debut})"

class Conversation(models.Model):
    etudiant   = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='conversations')
    titre      = models.CharField(max_length=200, default='Nouvelle conversation')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta: ordering = ['-updated_at']
    def __str__(self): return f"{self.etudiant.username} — {self.titre}"

class Message(models.Model):
    ROLES = [('user','Étudiant'),('assistant','OrientaBot')]
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    role         = models.CharField(max_length=10, choices=ROLES)
    contenu      = models.TextField()
    created_at   = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['created_at']

class MessageFeedback(models.Model):
    message = models.OneToOneField(Message, on_delete=models.CASCADE, related_name='feedback')
    est_positif = models.BooleanField()
    commentaire = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
