from django.contrib.auth.models import AbstractUser
from django.db import models

class Etudiant(AbstractUser):
    SERIE_BAC = [
        ('SM',    'SM — Sciences Mathématiques'),
        ('SE',    'SE — Sciences Expérimentales'),
        ('SE-FA', 'SE-FA — Sciences Expérimentales FA'),
        ('SS',    'SS — Sciences Sociales'),
        ('SS-FA', 'SS-FA — Sciences Sociales FA'),
    ]
    first_name   = models.CharField('Prénom', max_length=100)
    last_name    = models.CharField('Nom', max_length=100)
    username     = models.CharField("Nom d'utilisateur", max_length=50, unique=True)
    serie_bac    = models.CharField('Série BAC', max_length=10, choices=SERIE_BAC, blank=True)
    moyenne_bac  = models.FloatField('Moyenne BAC', null=True, blank=True)
    numero_pv    = models.CharField('Numéro PV du BAC', max_length=50, blank=True)
    date_inscription = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD  = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    class Meta:
        verbose_name = 'Étudiant'
        verbose_name_plural = 'Étudiants'

    def __str__(self):
        return f"{self.first_name} {self.last_name} (@{self.username})"
