# API de Gestion de Flotte de Transport Routier

API REST développée avec **Node.js, Express.js et MongoDB** dans le cadre du projet YouCode 2026/2027.

L'application permet de gérer une flotte de transport routier : camions, remorques, pneus, trajets et opérations de maintenance.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Tests](#tests)
- [Authentification](#authentification)
- [Principaux endpoints](#principaux-endpoints)

## Fonctionnalités

- Authentification avec JWT et gestion des rôles.
- Gestion des camions, remorques et pneus.
- Gestion des trajets et vérification de disponibilité des ressources.
- Calcul du kilométrage parcouru et de la consommation moyenne de carburant.
- Gestion des maintenances et des règles de maintenance.
- Détection des pneus usés et des maintenances non résolues lors de l'affectation.
- Gestion du statut des trajets.
- Génération d'un ordre de mission au format PDF.

## Technologies

- **Node.js** : environnement d'exécution JavaScript.
- **Express.js** : framework pour construire l'API REST.
- **MongoDB** : base de données NoSQL.
- **Mongoose** : modélisation des données et interaction avec MongoDB.
- **JWT (jsonwebtoken)** : authentification par jetons.
- **bcrypt** : hachage des mots de passe.
- **PDFKit** : génération des documents PDF.
- **Jest** : tests automatisés.
- **Supertest** : tests HTTP.
- **mongodb-memory-server** : base MongoDB en mémoire pour les tests.

## Architecture

Le projet suit une architecture en couches afin de séparer les responsabilités.

```text
src/
├── app.js
├── config/
│   └── db.js
├── controllers/
├── middlewares/
├── models/
├── routes/
└── services/
```

- **Routes** : définissent les endpoints et les middlewares associés.
- **Controllers** : reçoivent les requêtes HTTP et construisent les réponses.
- **Services** : centralisent la logique métier.
- **Models** : définissent les schémas et les modèles Mongoose.
- **Middlewares** : gèrent notamment l'authentification, les autorisations et les erreurs.
- **Config** : contient la configuration de la connexion à MongoDB.

Le fichier `server.js` charge les variables d'environnement, initialise la connexion à MongoDB et démarre le serveur Express.

## Prérequis

- Node.js et npm.
- MongoDB, installé localement ou accessible via une URI.
- Git.

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/khalil-elqaddabi/GFTR.git
cd GFTR
```

Installer les dépendances :

```bash
npm install
```

Créer un fichier `.env` à la racine du projet et configurer les variables d'environnement.

## Configuration

Exemple de configuration à adapter dans le fichier `.env` :

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fleet_management
JWT_ACCESS_SECRET=replace_with_a_secure_access_secret
JWT_REFRESH_SECRET=replace_with_a_secure_refresh_secret
```

Remplacer les valeurs d'exemple par une configuration adaptée à l'environnement. Les secrets JWT doivent être longs, aléatoires et conservés confidentiels.

Ne jamais publier le fichier `.env` ou ses secrets sur GitHub.

## Démarrage

Mode développement avec redémarrage automatique :

```bash
npm run dev
```

Mode normal :

```bash
npm start
```

Lorsque le serveur démarre correctement, il affiche le port utilisé et confirme la connexion à MongoDB.

L'endpoint racine est accessible à l'adresse :

```text
http://localhost:5000/
```

Il retourne un message confirmant que l'API est en cours d'exécution.

## Tests

Exécuter les tests avec :

```bash
npm test
```

Les tests automatisés couvrent notamment les calculs de kilométrage et de consommation de carburant.

## Authentification

Les routes protégées nécessitent un jeton d'accès JWT, valable 15 minutes. Le jeton de rafraîchissement est valable 30 jours. Il n’existe pas de route de déconnexion serveur. La connexion et le rafraîchissement refusent un compte suspendu; le middleware relit le rôle et l’état du compte en base pour les requêtes protégées.

Dans Postman, ajouter l'en-tête suivant aux requêtes authentifiées :

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Les autorisations dépendent du rôle associé à l'utilisateur et aux routes.

## Principaux endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/refresh` | Renouvellement du jeton |
| GET | `/` | Vérification de l'API |
| GET, POST | `/api/camions` | Liste et création (Admin) |
| GET, PUT, DELETE | `/api/camions/:id` | Détail, modification, suppression définitive (Admin) |
| GET | `/api/camions/count` | Nombre de camions non archivés (Admin) |
| GET | `/api/users` | Liste des utilisateurs (Admin, sans mot de passe) |
| POST | `/api/users/chauffeurs` | Création d’un Chauffeur (Admin) |
| PATCH | `/api/users/:id/status` | Suspension/réactivation d’un Chauffeur (Admin) |
| GET | `/api/users/chauffeurs/count` | Nombre de Chauffeurs inscrits (Admin) |
| `/api/remorques` | CRUD | Gestion des remorques |
| `/api/pneus` | CRUD | Gestion des pneus |
| GET, POST | `/api/trajets` | Liste et création des trajets (Admin) |
| GET | `/api/trajets/mes-trajets` | Trajets du Chauffeur connecté |
| `/api/maintenances` | CRUD | Gestion des maintenances |
| `/api/maintenance-rules` | CRUD | Gestion des règles de maintenance |

Les autres méthodes et rôles autorisés sont décrits dans les routes et dans OpenAPI (`/api-docs`).

### Routes utilisées par le frontend Sprint 3

- `GET /api/users` (Admin) renvoie les utilisateurs sans champ mot de passe.
- `POST /api/users/chauffeurs` (Admin) crée un Chauffeur avec `firstName`, `lastName`, `email` et `password`.
- `PATCH /api/users/:id/status` (Admin) modifie `isActive` pour un Chauffeur.
- `GET /api/users/chauffeurs/count` renvoie le nombre de Chauffeurs.
- `GET /api/camions` et `GET /api/camions/:id` nécessitent un rôle Admin. `DELETE /api/camions/:id` supprime définitivement le camion ; il ne s’agit pas d’un archivage.
- `GET /api/trajets/mes-trajets` renvoie uniquement les trajets liés à l’identifiant du compte présent dans le jeton.

Le middleware vérifie la signature JWT puis recharge le compte et son rôle en base. Un compte suspendu reçoit 401 pour les connexions protégées, y compris avec un access token émis avant la suspension. Le rafraîchissement rejette aussi les comptes suspendus. CORS autorise `http://localhost:5173` (Vite) et le backend écoute par défaut sur `http://localhost:5000`.

## Auteur

Projet individuel réalisé dans le cadre de la formation YouCode, spécialisation MERN Stack, promotion 2026/2027.

Dépôt GitHub : https://github.com/khalil-elqaddabi/GFTR
