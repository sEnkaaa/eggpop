# 🎬 Eggpop.fun

**Eggpop.fun** est un jeu multijoueur en ligne, drôle et décalé, basé sur la créativité et l'humour. Le principe ? Sous-titrez des extraits de films avec vos amis et votez pour les propositions les plus hilarantes !

---

## 🕹️ Description

Eggpop est un jeu multijoueur en ligne où chaque partie se joue en **4 rounds**. Voici comment ça se passe :

1. Créez une partie et invitez vos amis via un lien.
2. Chaque tour vous propose un **clip vidéo à sous-titrer** (une seule zone de sous-titre est disponible).
3. Tous les joueurs regardent le clip ensemble en temps réel.
4. Chacun propose un sous-titre.
5. Les clips avec les sous-titres de chaque joueur sont visionnés.
6. Les joueurs votent pour le sous-titre le plus drôle.
7. À la fin de la partie, un **podium** des meilleurs joueurs est affiché.

🔗 [Demo en ligne : eggpop.fun](https://eggpop.fun)

---

## 🚀 Stack technique

- **Frontend** : React
- **Backend** : Kotlin + Spring Boot
- **Base de données** : PostgreSQL
- **Websockets** : communication temps réel pour les parties
- **Docker** : orchestration via `docker-compose`
- **CI/CD** : GitHub Actions (`.github/workflows/ci.yml`)

---

## 📦 Installation & Lancement

Tout est **entièrement dockerisé**, aucun script d'installation nécessaire.

### Prérequis

- Docker & Docker Compose

### Initialisation du projet

1. Créez un fichier `.env` à la racine du projet (voir section suivante).
2. Lancez les commandes suivantes :

---

## 🔐 Variables d'environnement

Créez un fichier `.env` à la racine avec les variables suivantes :

```env
APP_ENV=development
NODE_ENV=development
VITE_NODE_ENV=development
VITE_BACKEND_HTTP=http://localhost:8080
VITE_BACKEND_WS=ws://localhost:8080/ws

SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/eggpop
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_PROFILES_ACTIVE=dev
FLYWAY_ENABLED=true

POSTGRES_DB=eggpop
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

## 🗂️ Structure du projet

```bash
eggpop.fun/
├── frontend/         # Application React
├── backend/          # API Kotlin + Spring Boot
├── nginx/            # Config Nginx (proxy reverse)
├── .github/
│   └── workflows/
│       └── ci.yml    # CI/CD GitHub Actions
├── docker-compose.yml
└── .env              # Fichier d'environnement à cré
```

## 🔧 CI/CD
Le pipeline d'intégration continue est défini dans :

```bash
.github/workflows/ci.yml
```

## 👤 Auteur

Alexandre Trupin  
📧 [alexandretrupin@gmail.com](mailto:alexandretrupin@gmail.com)  
🌐 [eggpop.fun](https://eggpop.fun)