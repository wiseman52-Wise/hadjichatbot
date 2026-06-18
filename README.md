# OrientaGN — Chatbot d'Orientation Académique Guinée

**Stack : Django REST Framework + React + PostgreSQL + Hugging Face API**

Réalisé par : **Hadjiratou Diallo** & **Mariama Tabara Diallo** — UGANC · Centre Informatique · S6 · 2026

---

## 🚀 Lancement rapide

### BACKEND Django
```bash
cd backend/
pip install -r requirements.txt

# Configurer .env (voir section Configuration ci-dessous)

# Créer la base PostgreSQL
createdb orientagn_db   # ou via psql: CREATE DATABASE orientagn_db;

python manage.py migrate
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
SECRET_KEY=votre-super-secret-key-longue-32-chars-minimum
DEBUG=True
DB_NAME=orientagn_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx   ← Obligatoire pour activer l'IA
```

> **Obtenir la clé Hugging Face :** Créez un compte gratuit sur [huggingface.co](https://huggingface.co), puis allez dans **Settings > Access Tokens** et créez un token avec le rôle "Read".
>
> Sans clé, le chatbot fonctionne en mode **fallback intelligent** (réponses structurées depuis la base de données locale).

---

## 👤 Créer un compte Administrateur

```bash
cd backend/
python manage.py shell -c "
from accounts.models import Etudiant
u, _ = Etudiant.objects.get_or_create(username='admin')
u.set_password('VotreMotDePasse!')
u.is_staff = True
u.is_superuser = True
u.first_name = 'Admin'
u.save()
print('Compte admin créé !')
"
```

Puis connectez-vous sur **`http://localhost:3000/connexion`** avec `admin` / `VotreMotDePasse!` et accédez au tableau de bord via **`http://localhost:3000/admin`**.

> L'interface admin Django classique est également disponible sur **`http://localhost:8000/admin/`**.

---

## 📁 Architecture
```
orientagn2/
├── backend/
│   ├── config/              ← Settings Django + URLs principales
│   ├── accounts/            ← Authentification JWT par cookie HttpOnly
│   │   ├── models.py        ← Modèle Etudiant (prénom, nom, série_bac, moyenne_bac, n° PV)
│   │   ├── authentication.py ← CookieJWTAuthentication (sécurité renforcée)
│   │   ├── serializers.py
│   │   ├── views.py         ← inscription, connexion, profil, CookieTokenRefreshView
│   │   └── urls.py
│   ├── chatbot/
│   │   ├── knowledge_base.py ← Prompt système + 7 universités + 171 filières enrichies
│   │   ├── rag_engine.py     ← Moteur RAG (recherche Jaccard, 171 documents indexés)
│   │   ├── models.py         ← Conversation, Message, Universite, Filiere, FAQEntry
│   │   ├── views.py          ← API chat, stats, fallback intelligent (_call_llm)
│   │   └── urls.py
│   ├── data_mining/
│   │   └── all_universities_enriched.json  ← Base enrichie des universités guinéennes
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx           ← Routeur principal (SPA React)
│   │   ├── pages/
│   │   │   ├── Home.jsx      ← Page d'accueil
│   │   │   ├── Chatbot.jsx   ← Interface chatbot
│   │   │   ├── Universites.jsx
│   │   │   ├── Filieres.jsx
│   │   │   ├── Profil.jsx
│   │   │   ├── Admin.jsx     ← Tableau de bord admin (is_staff requis)
│   │   │   ├── Connexion.jsx
│   │   │   └── Inscription.jsx
│   │   ├── services/api.js   ← Axios + intercepteur JWT cookie
│   │   └── utils/constants.js ← Design system + constantes
│   └── package.json
└── README.md
```

---

## 🎯 Fonctionnalités

### Authentification
- ✅ Inscription avec Prénom, Nom, Nom d'utilisateur, Série BAC, Moyenne, Numéro PV
- ✅ Connexion / Déconnexion avec JWT (tokens HttpOnly en cookie, sécurisé)
- ✅ Rafraîchissement automatique du token via `CookieTokenRefreshView`
- ✅ Profil étudiant modifiable

### Universités & Filières (7 universités, 171 filières)
- ✅ UGANC (Conakry), Université de Kindia, Université de Labé
- ✅ UJNK (Kankan), Université de Ziguinchor, ISMGB (Mines Boké)
- ✅ Université Général Lansana Conté de Sonfonia (UGLCS)
- ✅ Filtres par université, recherche plein texte, fiches détaillées
- ✅ Données officielles enrichies (débouchés, conditions d'admission, durée)

### Chatbot IA
- ✅ Moteur RAG (171 documents indexés) — priorité aux données officielles
- ✅ IA via **Hugging Face Inference API** (Mixtral-8x7B-Instruct, gratuit)
- ✅ Fallback intelligent local (DB, mots-clés, détection dynamique des débouchés)
- ✅ Mode guidé conversationnel (Salutations → Demandes → Vérifications → Suggestions → Conclusion)
- ✅ Reconnaissance des 8 aspects conversationnels (salut, merci, excuses, erreurs...)
- ✅ Recherche de métier dans les débouchés (ex: "magistrat" → Droit)
- ✅ Historique des conversations sauvegardé en PostgreSQL
- ✅ Import de fichiers (PDF, texte) pour analyse contextuelle

### Interface Admin (`/admin`)
- ✅ Tableau de bord : nombre d'étudiants, conversations, messages
- ✅ Statistiques sur 7 jours (graphique messages/jour)
- ✅ Liste des utilisateurs récents et conversations
- ✅ Gestion des universités, filières, FAQ et calendrier

---

## 🔌 API Endpoints
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/inscription/` | Créer un compte |
| POST | `/api/auth/connexion/` | Se connecter (cookie JWT) |
| POST | `/api/auth/deconnexion/` | Se déconnecter |
| GET/PUT | `/api/auth/profil/` | Voir/modifier profil |
| POST | `/api/auth/token/refresh/` | Rafraîchir token (depuis cookie) |
| GET | `/api/universites/` | Toutes les universités |
| GET | `/api/filieres/` | Toutes les filières |
| GET | `/api/stats/` | Statistiques (admin complet) |
| GET/POST | `/api/conversations/` | Liste / Créer conversation |
| GET/DELETE | `/api/conversations/{id}/` | Détail / Supprimer |
| POST | `/api/conversations/message/` | Envoyer message → réponse IA |
| POST | `/api/messages/{id}/feedback/` | Donner un feedback |

---

## 🤖 Moteur IA

Le chatbot utilise une architecture hybride **RAG + LLM + Fallback** :

1. **RAG** (`rag_engine.py`) : Recherche par intersection de jetons (Jaccard) dans 171 documents indexés. Injecte le contexte pertinent dans le prompt.
2. **LLM** (`Hugging Face`) : Appel HTTP direct à `mistralai/Mixtral-8x7B-Instruct-v0.1`. Format de prompt instruct Mistral. Gratuit sans provider requis.
3. **Fallback local** (`_fallback`) : Si l'API est indisponible, le moteur local répond en analysant la base PostgreSQL (filières, débouchés, universités) et le profil étudiant.

---

## 🔐 Sécurité
- Tokens JWT stockés en **cookies HttpOnly** (non accessibles en JavaScript)
- Rafraîchissement automatique via cookie `refresh_token`
- CORS limité à `localhost:3000`
- `CookieJWTAuthentication` personnalisée (ne lit que l'access token)
