# OrientaGN — Chatbot d'Orientation Académique Guinée
**Stack : Django REST Framework + React + PostgreSQL + Claude API**

Réalisé par : **Hadjiratou Diallo** & **Mariama Tabara Diallo** — UGANC · Centre Informatique · S6 · 2026

---

## 🚀 Lancement rapide

### BACKEND Django
```bash
cd backend/
pip install -r requirements.txt

# Configurer .env (DB_USER, DB_PASSWORD, ANTHROPIC_API_KEY)

# Créer la base PostgreSQL
createdb orientagn_db   # ou via psql: CREATE DATABASE orientagn_db;

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
# → http://localhost:8000
```

### FRONTEND React
```bash
cd frontend/
npm install
npm start
# → http://localhost:3000
```

---

## ⚙️ Configuration .env (backend/)
```
SECRET_KEY=votre-secret-key
DEBUG=True
DB_NAME=orientagn_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
ANTHROPIC_API_KEY=sk-ant-...   ← optionnel, fallback sans clé
```

---

## 📁 Architecture
```
orientagn2/
├── backend/
│   ├── config/          ← Settings Django + URLs
│   ├── accounts/        ← Modèle Etudiant (JWT auth)
│   │   ├── models.py    ← Etudiant (first_name, last_name, username, serie_bac, moyenne_bac, numero_pv)
│   │   ├── serializers.py
│   │   ├── views.py     ← inscription, connexion, profil
│   │   └── urls.py
│   ├── chatbot/
│   │   ├── knowledge_base.py  ← 5 universités, 60+ filières
│   │   ├── models.py    ← Conversation, Message
│   │   ├── views.py     ← API universites, stats, chat
│   │   └── urls.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx          ← Application complète (SPA)
│   │   ├── context/AuthContext.js
│   │   ├── services/api.js  ← Axios + JWT interceptors
│   │   └── index.js
│   ├── public/index.html
│   └── package.json
└── README.md
```

---

## 🎯 Fonctionnalités

### Authentification
- ✅ Inscription : Prénom, Nom, Nom d'utilisateur, Série BAC, Moyenne, **Numéro PV** (champ texte), Mot de passe
- ✅ Connexion / Déconnexion avec JWT (access + refresh tokens)
- ✅ Profil modifiable

### Universités & Filières
- ✅ 5 universités (UGANC, Kindia, Labé, UJNK Kankan, N'Zérékoré)
- ✅ 60+ filières avec descriptions, durées, débouchés
- ✅ Filtres par université, recherche plein texte
- ✅ Fiches détaillées en modal
- ✅ Données ParcourSup 2025 officielles

### Chatbot IA
- ✅ Mode libre (questions en langage naturel)
- ✅ Mode guidé en 3 étapes (bac → moyenne → domaine)
- ✅ Questions rapides pré-définies
- ✅ Historique des conversations en PostgreSQL
- ✅ Personnalisation selon profil étudiant
- ✅ Fallback intelligent sans clé API Claude

### Design
- ✅ React SPA (Single Page App)
- ✅ Design professionnel (palette Guinée : vert forêt, or solaire, bleu nuit)
- ✅ Responsive mobile + desktop
- ✅ Animations et micro-interactions

---

## 🔌 API Endpoints
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | /api/auth/inscription/ | Créer un compte |
| POST | /api/auth/connexion/ | Se connecter (JWT) |
| GET/PUT | /api/auth/profil/ | Voir/modifier profil |
| POST | /api/auth/token/refresh/ | Rafraîchir token JWT |
| GET | /api/universites/ | Toutes les universités + filières |
| GET | /api/stats/ | Statistiques globales |
| GET/POST | /api/conversations/ | Liste / Créer conversation |
| GET/DELETE | /api/conversations/{id}/ | Détail / Supprimer |
| POST | /api/conversations/message/ | Envoyer message → réponse IA |
