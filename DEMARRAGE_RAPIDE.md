# ▶ GUIDE DE DÉMARRAGE — OrientaGN

## Étape 1 — Ouvrir dans VS Code
1. Extraire le ZIP
2. Dans VS Code : **Fichier → Ouvrir le dossier** → choisir `orientagn2`

---

## Étape 2 — BACKEND Django

Ouvrir un **Terminal** dans VS Code (`Ctrl + ù` ou `Terminal → Nouveau terminal`)

```bash
cd backend
pip install -r requirements.txt
```

Ouvrir `.env` et modifier tes infos PostgreSQL :
```
DB_USER=postgres
DB_PASSWORD=TON_MOT_DE_PASSE
```

Créer la base de données (dans psql ou pgAdmin) :
```sql
CREATE DATABASE orientagn_db;
```

Lancer le backend :
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
→ Backend disponible sur **http://localhost:8000**

---

## Étape 3 — FRONTEND React

Ouvrir un **2ème terminal** dans VS Code (`+` dans le panel terminal)

```bash
cd frontend
npm install
npm start
```
→ Site disponible sur **http://localhost:3000**

---

## ✅ C'est tout !
- Site web : http://localhost:3000
- Admin Django : http://localhost:8000/admin
