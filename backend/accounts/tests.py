from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

Etudiant = get_user_model()

class AuthRegressionTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Etudiant.objects.create_user(
            username='testuser',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )

    def test_connexion_returns_httponly_cookies(self):
        """Teste que la connexion renvoie bien des cookies HttpOnly et non des tokens en clair dans le JSON"""
        response = self.client.post('/api/auth/connexion/', {
            'username': 'testuser',
            'password': 'testpassword123'
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        # Vérifie que access_token n'est pas dans le corps de la réponse
        self.assertNotIn('access', response.json())
        
        # Vérifie la présence des cookies
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)
        
        # Vérifie que les cookies sont HttpOnly
        self.assertTrue(response.cookies['access_token']['httponly'])
        self.assertTrue(response.cookies['refresh_token']['httponly'])

    def test_deconnexion_clears_cookies(self):
        """Teste que la déconnexion efface bien les cookies"""
        self.client.cookies['access_token'] = 'fake_token'
        response = self.client.post('/api/auth/deconnexion/')
        self.assertEqual(response.status_code, 200)
        
        # Max-Age=0 (ou deleted) confirme l'effacement
        self.assertEqual(response.cookies['access_token']['max-age'], 0)
