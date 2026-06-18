# Plan d'Implémentation : Application "100% Chatbot" (Style ChatGPT)

Suite à votre précision fondamentale (*"c'est pas un site web qu'on développe mais un chatbot"*), ce plan refonde l'architecture pour que **la fenêtre de Chat soit le cœur exclusif de l'application**, et non plus une page parmi d'autres.

## User Review Required

> [!IMPORTANT]  
> Ce plan implique de supprimer l'ancienne barre de navigation classique (Accueil, Universités, Filières) pour passer à une interface de type messagerie plein écran.
> - **Est-ce que ce design (où le bot affiche les universités et le calendrier directement dans la discussion ou dans un panneau latéral) vous convient à 100% ?**
> - **Confirmez-vous que vous souhaitez le Panel Admin intégré au frontend React (onglet caché pour les admins) pour éditer les bases de données du bot sans coder ?**

## Proposed Changes

### 1. Refonte Globale de l'Interface (Frontend React)

L'application deviendra une Single Page Application (SPA) centrée sur la conversation.

#### [MODIFY] `frontend/src/App.jsx`
- Suppression de la structure classique de site web (Navbar globale, pages multiples).
- Création d'un layout "Messagerie" :
  - **Sidebar gauche** : Historique des conversations, FAQ intégrée, Profil Bachelier, Lien Admin (si autorisé).
  - **Zone centrale** : Interface du Chat conversationnel fluide.
  - **Panneau droit (Contextuel)** : S'ouvre pour afficher des informations riches (Détails d'une université, Calendrier académique) appelées par le bot.

#### [MODIFY] `frontend/src/pages/Chatbot.jsx`
- Devient la page principale (`/`).
- Implémentation des **"Questions rapides"** (boutons cliquables dans le chat : "Voir les filières Informatique", "Conditions d'admission UGANC", etc.).
- Intégration de cartes riches (Rich UI) : Lorsque le bot présente une filière, il renvoie un composant visuel avec les critères d'accès.

#### [MODIFY] `frontend/src/pages/Admin.jsx` (Panel Admin)
- Devient un panneau exclusif (`/admin`) sécurisé.
- **Base de connaissances** : Formulaires pour modifier dynamiquement les filières, les conditions d'admission, et la FAQ du bot sans toucher au code source.
- **Historique & Stats** : Tableau de bord affichant le nombre de conversations, les questions les plus posées et les retours (feedback utilisateurs).

---

### 2. Backend (Django) - Le "Cerveau" Dynamique du Bot

Pour que le Panel Admin fonctionne "sans toucher au code", la base de connaissances du bot (`knowledge_base.py` et `universities.js`) doit devenir une base de données relationnelle.

#### [MODIFY] `backend/chatbot/models.py`
Ajout des modèles fondamentaux pour nourrir le bot :
- `Universite` (Nom, ville, description)
- `Filiere` (Nom, moyenne requise, conditions d'admission spécifiques, université affiliée)
- `FAQ_Entry` (Question, Réponse, Mots-clés)
- `CalendrierEvent` (Titre, Date, Description)
- `MessageFeedback` (Pour le système de notation "pouce en l'air/bas" des réponses du bot).

#### [MODIFY] `backend/chatbot/views.py`
- Mise à jour du moteur local du chatbot (`_fallback`) pour qu'il interroge dynamiquement la base de données (modèles `Filiere`, `Universite`) au lieu du texte statique. S'il détecte "Informatique", il filtre la DB pour trouver les filières pertinentes.
- Création des endpoints API (CRUD) permettant au Panel Admin React de lire, ajouter, modifier ou supprimer ces données.

#### [NEW] Scripts d'intégration
- Script Python de migration initiale pour charger vos données actuelles (UGANC, UGLCS, etc.) dans les nouvelles tables de la base de données.

## Verification Plan

### Automated Tests
- Test de l'API de base de connaissances (récupération des filières dynamiques).
- Test de l'algorithme d'orientation du chatbot branché sur la DB.

### Manual Verification
- Lancement de l'app : le premier écran doit être le chat.
- Le bot doit répondre en affichant des données extraites en temps réel de la DB.
- L'Admin modifie la "moyenne requise" d'une filière dans le Panel Admin React, et le bot ajuste immédiatement sa recommandation dans la conversation suivante sans redémarrage.
