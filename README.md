Mini Application Immobilière

Bienvenue dans Mini Application Immobilière, une application web moderne conçue pour simplifier la gestion des biens immobiliers. Avec elle, vous pouvez consulter les propriétés, organiser des visites et gérer facilement les demandes de visite — le tout de manière intuitive et rapide.

Table des matières

À propos

Technologies utilisées

Architecture

Installation

Utilisation

Structure du projet

API Endpoints

Fonctionnalités

Configuration

Licence


À propos

Cette application permet aux utilisateurs de :

Explorer et rechercher facilement les propriétés disponibles.

Télécharger et gérer des images pour chaque propriété.

Créer, suivre et organiser des visites.

Gérer les demandes de visite et planifier les rendez-vous.

Bref, tout ce dont un gestionnaire immobilier a besoin, accessible depuis votre navigateur.

Technologies utilisées
Backend

Fastify : serveur web ultra-rapide.

TypeScript : code robuste et typé.

Zod : validation des données.

UUID : génération d’identifiants uniques.

Fastify Cors : gestion des accès cross-origin.

Fastify Multipart : gestion des uploads de fichiers.

Fastify Static : serveur de fichiers statiques.

Frontend

React 18 : interface utilisateur réactive.

TypeScript : typage fort côté client.

React Router : navigation fluide entre les pages.

Vite : build tool rapide et moderne.

Tailwind CSS : design simple et modulable.

Lucide React : icônes élégantes.

Architecture
Mini Application Immobilière/
├── back-end/          # Serveur Fastify (API REST)
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── uploads/
│   ├── package.json
│   └── tsconfig.json
└── frontend/          # Application React
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── types/
    │   ├── assets/
    │   └── styles/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json

Installation
Prérequis

Node.js 18+

npm ou yarn

Étapes

Cloner le projet

git clone <repository-url>
cd "Mini Application immobilière"


Installer les dépendances du backend

cd back-end
npm install


Installer les dépendances du frontend

cd ../frontend
npm install

Utilisation
Mode développement
Démarrer le backend
cd back-end
npm run dev


Le serveur tourne sur http://localhost:3000.

Démarrer le frontend

Dans un autre terminal :

cd frontend
npm run dev


L’application s’ouvre sur http://localhost:5173.

Mode production
Backend
cd back-end
npm run build
npm start

Frontend
cd frontend
npm run build
npm run preview

Fonctionnalités principales
Gestion des Propriétés

Liste complète des propriétés

Création, modification et suppression

Upload multiple d’images

Gestion des Visites

Planification de visites

Liste des visites à venir

Modification et annulation

Demandes de Visite

Soumission et suivi des demandes

Gestion (acceptation ou refus)

Upload d’Images

Téléchargement d’images par propriété

Galerie interactive

Gestion côté serveur

API Endpoints
Propriétés

GET /api/properties – Toutes les propriétés

GET /api/properties/:id – Détails d’une propriété

POST /api/properties – Créer une propriété

PUT /api/properties/:id – Modifier une propriété

DELETE /api/properties/:id – Supprimer

Visites

GET /api/visits – Toutes les visites

GET /api/visits/:id – Détails d’une visite

POST /api/visits – Créer une visite

PUT /api/visits/:id – Modifier

DELETE /api/visits/:id – Supprimer

Demandes de visite

GET /api/visit-requests – Toutes les demandes

POST /api/visit-requests – Créer une demande

PUT /api/visit-requests/:id – Modifier

DELETE /api/visit-requests/:id – Supprimer

Upload

POST /api/upload – Télécharger une image

GET /api/uploads/:filename – Récupérer une image

Configuration
Backend (back-end/src/config/env.ts)
export const config = {
  port: 3000,
  host: '0.0.0.0',
  // autres configs
}

Frontend

Les configs se trouvent dans vite.config.ts et les services API.

Licence

Projet de stage – tous droits réservés.
