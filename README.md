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

Les routes protégées nécessitent un jeton d'accès JWT.

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
| `/` | `GET /` | Vérification de l'API |
| `/api/camions` | CRUD | Gestion des camions |
| `/api/remorques` | CRUD | Gestion des remorques |
| `/api/pneus` | CRUD | Gestion des pneus |
| `/api/trajets` | CRUD | Gestion des trajets |
| `/api/maintenances` | CRUD | Gestion des maintenances |
| `/api/maintenance-rules` | CRUD | Gestion des règles de maintenance |

Les méthodes HTTP disponibles et les rôles autorisés dépendent de la configuration effective des routes du projet.

## Auteur

Projet individuel réalisé dans le cadre de la formation YouCode, spécialisation MERN Stack, promotion 2026/2027.

Dépôt GitHub : https://github.com/khalil-elqaddabi/GFTR
