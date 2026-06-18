import requests

url = "http://localhost:8000/api/auth/inscription/"
data = {
    "first_name": "Test",
    "last_name": "User",
    "username": "testuser3",
    "email": "test3@test.com",
    "mot_de_passe": "password123",
    "serie_bac": "SE",
    "moyenne_bac": 15.0
}
res = requests.post(url, json=data)
print(res.status_code)
print(res.text)
