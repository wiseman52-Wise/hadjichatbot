from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Etudiant
from .serializers import InscriptionSerializer, EtudiantSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def inscription(request):
    s = InscriptionSerializer(data=request.data)
    if s.is_valid():
        etudiant = s.save()
        refresh = RefreshToken.for_user(etudiant)
        res = Response({
            'user': EtudiantSerializer(etudiant).data,
            'message': 'Inscription réussie'
        }, status=status.HTTP_201_CREATED)
        res.set_cookie('access_token', str(refresh.access_token), httponly=True, samesite='Lax', secure=False, max_age=3600)
        res.set_cookie('refresh_token', str(refresh), httponly=True, samesite='Lax', secure=False, max_age=86400)
        return res
    return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def connexion(request):
    username = request.data.get('username','')
    password = request.data.get('password','')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        res = Response({
            'user': EtudiantSerializer(user).data,
            'message': 'Connexion réussie'
        })
        res.set_cookie('access_token', str(refresh.access_token), httponly=True, samesite='Lax', secure=False, max_age=3600)
        res.set_cookie('refresh_token', str(refresh), httponly=True, samesite='Lax', secure=False, max_age=86400)
        return res
    return Response({'detail': "Nom d'utilisateur ou mot de passe incorrect."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def deconnexion(request):
    res = Response({'message': 'Déconnecté'})
    res.delete_cookie('access_token')
    res.delete_cookie('refresh_token')
    return res

@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def profil(request):
    if request.method == 'GET':
        return Response(EtudiantSerializer(request.user).data)
    s = EtudiantSerializer(request.user, data=request.data, partial=True)
    if s.is_valid():
        s.save()
        return Response(s.data)
    return Response(s.errors, status=400)

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({"detail": "Refresh token manquant."}, status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = self.get_serializer(data={'refresh': refresh_token})
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            raise InvalidToken(e.args[0])
            
        res = Response(serializer.validated_data, status=status.HTTP_200_OK)
        res.set_cookie(
            'access_token', 
            serializer.validated_data.get('access'), 
            httponly=True, 
            samesite='Lax', 
            secure=False, 
            max_age=3600
        )
        return res
