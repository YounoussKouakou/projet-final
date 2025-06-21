# Backend API - Système de Réservation d'Espaces de Coworking

## Description

API REST complète pour la gestion d'un système de réservation d'espaces de coworking. Cette API permet aux utilisateurs de réserver des espaces, aux administrateurs de gérer les espaces et les réservations, et fournit des statistiques détaillées.

## Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hashage des mots de passe
- **CORS** - Gestion des requêtes cross-origin

## Installation

1. **Cloner le projet**
   ```bash
   cd backend-projet-final
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   - Copier le fichier `config.env.example` vers `config.env`
   - Modifier les valeurs selon votre configuration

4. **Démarrer MongoDB**
   - Assurez-vous que MongoDB est installé et en cours d'exécution

5. **Lancer le serveur**
   ```bash
   # Mode développement
   npm run dev
   
   # Mode production
   npm start
   ```

## Configuration

### Variables d'environnement

Créer un fichier `config.env` avec les variables suivantes :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coworking_reservation
JWT_SECRET=votre_secret_jwt_tres_securise_ici
NODE_ENV=development
```

## Structure de l'API

### Authentification

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

#### POST `/api/auth/login`
Connexion d'un utilisateur
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Récupérer le profil de l'utilisateur connecté (Token requis)

#### PUT `/api/auth/profile`
Mettre à jour le profil de l'utilisateur (Token requis)

### Espaces

#### GET `/api/spaces`
Récupérer tous les espaces (Public)

#### GET `/api/spaces/:id`
Récupérer un espace par ID (Public)

#### GET `/api/spaces/available`
Récupérer les espaces disponibles pour une période (Public)
```
?date=2024-03-20&startTime=09:00&endTime=11:00
```

#### POST `/api/spaces`
Créer un nouvel espace (Admin seulement)
```json
{
  "name": "Salle de réunion A",
  "description": "Salle moderne avec équipements",
  "type": "salle_reunion",
  "capacity": 10,
  "pricePerHour": 50000,
  "amenities": ["Projecteur", "Tableau blanc", "WiFi"],
  "location": {
    "building": "Bâtiment A",
    "floor": 2,
    "room": "A201"
  }
}
```

### Réservations

#### POST `/api/reservations`
Créer une nouvelle réservation (Token requis)
```json
{
  "spaceId": "space_id_here",
  "date": "2024-03-20",
  "startTime": "09:00",
  "endTime": "11:00",
  "notes": "Réunion équipe",
  "paymentMethod": "card"
}
```

#### GET `/api/reservations`
Récupérer les réservations (Token requis)
- Utilisateurs : leurs propres réservations
- Admins : toutes les réservations

#### GET `/api/reservations/:id`
Récupérer une réservation par ID (Token requis)

#### PUT `/api/reservations/:id`
Mettre à jour une réservation (Token requis)

#### PUT `/api/reservations/:id/cancel`
Annuler une réservation (Token requis)

#### GET `/api/reservations/stats`
Statistiques des réservations (Admin seulement)

#### GET `/api/reservations/recent`
Réservations récentes (Admin seulement)
```
?limit=5
```

## Modèles de données

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashé),
  role: String (user/admin),
  phone: String,
  address: String,
  isActive: Boolean
}
```

### Space
```javascript
{
  name: String,
  description: String,
  type: String (salle_reunion, bureau_prive, espace_coworking, salle_conference),
  capacity: Number,
  pricePerHour: Number,
  amenities: [String],
  images: [String],
  isAvailable: Boolean,
  location: {
    building: String,
    floor: Number,
    room: String
  },
  operatingHours: {
    open: String,
    close: String
  }
}
```

### Reservation
```javascript
{
  userId: ObjectId (ref: User),
  spaceId: ObjectId (ref: Space),
  date: Date,
  startTime: String,
  endTime: String,
  duration: Number,
  totalPrice: Number,
  status: String (pending, confirmed, cancelled, completed),
  paymentStatus: String (pending, paid, failed, refunded),
  paymentMethod: String (cash, card, mobile_money, paypal),
  notes: String,
  cancellationReason: String,
  cancelledBy: ObjectId (ref: User),
  cancelledAt: Date
}
```

## Sécurité

- **Authentification JWT** : Toutes les routes protégées nécessitent un token valide
- **Hashage des mots de passe** : Utilisation de bcryptjs
- **Validation des données** : Validation côté serveur avec Mongoose
- **Gestion des rôles** : Différenciation entre utilisateurs et administrateurs
- **CORS** : Configuration pour les requêtes cross-origin

## Fonctionnalités avancées

### Vérification des conflits
- Détection automatique des conflits de réservation
- Calcul automatique de la durée et du prix
- Validation des heures d'ouverture

### Statistiques
- Nombre total de réservations
- Réservations par statut
- Revenus totaux
- Réservations récentes

### Filtres et recherche
- Filtrage par type d'espace
- Filtrage par capacité
- Filtrage par prix
- Recherche d'espaces disponibles

## Scripts disponibles

```bash
npm run dev    # Démarrer en mode développement avec nodemon
npm start      # Démarrer en mode production
```

## Base de données

L'API utilise MongoDB avec les collections suivantes :
- `users` - Utilisateurs du système
- `spaces` - Espaces de coworking
- `reservations` - Réservations des espaces

## Déploiement

1. **Préparer l'environnement de production**
   - Modifier `NODE_ENV=production` dans `config.env`
   - Configurer une base de données MongoDB de production
   - Utiliser un secret JWT sécurisé

2. **Démarrer le serveur**
   ```bash
   npm start
   ```

## Support

Pour toute question ou problème, veuillez consulter la documentation ou contacter l'équipe de développement.