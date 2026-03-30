# Koursa Mobile

Application mobile React Native pour la plateforme **Koursa** - Systeme de gestion academique et de suivi pedagogique.

## Technologies utilisees

| Technologie | Version | Description |
|-------------|---------|-------------|
| React Native | 0.83.1 | Framework mobile cross-platform |
| React | 19.2.0 | Librairie UI |
| TypeScript | 5.8.3 | Typage statique |
| React Native Paper | 5.12.5 | UI Kit Material Design 3 |
| React Navigation | 7.x | Navigation |
| Axios | 1.7.9 | Client HTTP |
| AsyncStorage | 2.1.0 | Stockage local |
| Firebase Messaging | 23.8.6 | Notifications push |
| Google Sign-In | 16.1.1 | Authentification Google |
| Lucide React Native | - | Icones |

## Structure du projet

```
KOURSA_FONTEND_MOBILE/
├── src/
│   ├── api/                    # Services API
│   │   ├── config.ts           # Configuration Axios
│   │   └── services.ts         # Services CRUD
│   ├── contexts/               # Contextes React
│   │   ├── AuthContext.tsx     # Authentification + Google Sign-In
│   │   └── NotificationContext.tsx # Notifications FCM + vibration
│   ├── navigation/             # Navigation
│   │   └── AppNavigator.tsx    # Configuration routes (Tabs, Drawer, Stack)
│   ├── screens/                # Ecrans
│   │   ├── auth/               # Authentification
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── dashboard/          # Dashboard avec logout dialog
│   │   │   └── DashboardScreen.tsx
│   │   ├── fiches/             # Fiches de suivi
│   │   │   ├── FichesListScreen.tsx
│   │   │   ├── CreateFicheScreen.tsx  # Avec preview avant soumission
│   │   │   └── FicheDetailScreen.tsx  # Validation directe
│   │   ├── academic/           # Structure academique
│   │   │   └── AcademicScreen.tsx
│   │   ├── users/              # Utilisateurs (vue adaptee par role)
│   │   │   └── UsersScreen.tsx
│   │   ├── profile/            # Profil + changement niveau
│   │   │   └── ProfileScreen.tsx
│   │   └── notifications/      # Notifications avec routage intelligent
│   │       └── NotificationsScreen.tsx
│   ├── theme/                  # Theme et couleurs
│   │   └── index.ts
│   └── types/                  # Types TypeScript
│       └── index.ts
├── App.tsx                     # Point d'entree
├── package.json
└── babel.config.js
```

## Fonctionnalites implementees

### Authentification
- Ecran de connexion (email/password)
- Google Sign-In via Firebase Authentication
- Ecran d'inscription avec selection de role
- Gestion de session avec AsyncStorage
- Dialog de confirmation avant deconnexion

### Dashboard
- Affichage du profil utilisateur avec nom du departement pour les chefs
- Statistiques des fiches (total, validees, refusees, en attente)
- Liste des fiches en attente
- Actions rapides (nouvelle fiche, mes fiches, academique)

### Gestion des fiches de suivi
- Liste des fiches avec filtrage par statut
- Recherche par UE, chapitre, contenu
- Creation de nouvelle fiche avec previsualisation avant soumission
- Restriction de date a 3 jours dans le passe pour les delegues
- Validation directe par l'enseignant (sans mot de passe)
- Telechargement PDF de la fiche validee (format officiel universite)
- Detection de conflits (salle, enseignant)
- Affichage du type de seance (CM, TD, TP)

### Notifications
- Notifications push via Firebase Cloud Messaging
- Canal Android `koursa_default` (importance HIGH, son + vibration)
- Son par defaut sur iOS via payload APNs
- Vibration du telephone a la reception en foreground (respecte le mode sonnerie)
- Routage intelligent : notifications fiche → detail fiche, alertes → dialog details
- Badge de compteur non-lus

### Espace enseignant
- Vue des delegues par matiere (filiere/niveau)
- Validation/refus des fiches

### Profil
- Edition des informations personnelles
- Changement de mot de passe
- Changement de niveau/filiere pour les delegues (nouvelle annee academique)

### Theme
- Support mode clair/sombre automatique
- Couleurs personnalisees Koursa
- Material Design 3

## Installation

### Prerequis
- Node.js >= 20
- npm ou Yarn
- Android Studio (pour Android)
- Xcode (pour iOS, macOS uniquement)

### Etapes

1. **Installer les dependances**
```bash
cd KOURSA_FONTEND_MOBILE
npm install
```

2. **Pour Android**
```bash
# Demarrer Metro
npm start

# Dans un autre terminal, lancer l'app
npm run android
```

3. **Pour iOS (macOS uniquement)**
```bash
# Installer les pods
cd ios && pod install && cd ..

# Demarrer Metro
npm start

# Dans un autre terminal
npm run ios
```

## Configuration API

L'URL de l'API est configuree dans `src/api/config.ts` :

```typescript
// Production (par defaut)
const API_BASE_URL = 'https://koursa.duckdns.org/api';

// Pour Android Emulator (dev)
const API_BASE_URL = 'http://10.0.2.2:8000/api';

// Pour iOS Simulator (dev)
const API_BASE_URL = 'http://localhost:8000/api';
```

## Securite

- ProGuard active pour les builds release (minification du code)
- Les fichiers `.env` ne sont pas versionnes (dans `.gitignore`)
- Les tokens JWT sont stockes dans AsyncStorage
- Authentification Google via Firebase

## Ecrans implementes

- [x] Dashboard avec statistiques et actions rapides
- [x] Detail d'une fiche (FicheDetailScreen)
- [x] Validation/Refus des fiches (validation directe sans mot de passe)
- [x] Telechargement PDF des fiches (ouverture navigateur avec token JWT)
- [x] Gestion academique (Facultes, Departements, Filieres, Niveaux)
- [x] Gestion des utilisateurs (vue adaptee par role)
- [x] Vue enseignant : delegues par matiere
- [x] Profil utilisateur avec changement de niveau
- [x] Notifications avec routage intelligent et canal Android dedie
- [x] Previsualisation fiche avant soumission

## Navigation

```
App
├── Auth (non connecte)
│   ├── Login
│   └── Register
└── Main (connecte)
    ├── Tabs
    │   ├── Dashboard
    │   ├── Fiches
    │   ├── Academique
    │   ├── Utilisateurs
    │   └── Profil
    └── Modals
        ├── CreateFiche
        └── FicheDetail
```

## API Services disponibles

```typescript
// Utilisateurs
usersService.getAll()
usersService.getById(id)
usersService.create(data)
usersService.update(id, data)
usersService.delete(id)

// Roles
rolesService.getAll()

// Facultes
facultesService.getAll()
facultesService.create(data)
// ... CRUD complet

// Departements
departementsService.getAll()
// ... CRUD complet

// Filieres
filieresService.getAll()
// ... CRUD complet

// Niveaux
niveauxService.getAll()
// ... CRUD complet

// Unites d'enseignement
unitesEnseignementService.getAll()
// ... CRUD complet

// Fiches de suivi
fichesSuiviService.getAll()
fichesSuiviService.getEnAttente()
fichesSuiviService.create(data)
fichesSuiviService.valider(id)
fichesSuiviService.refuser(id, motif)
fichesSuiviService.resoumettre(id)
fichesSuiviService.exportPdfUrl(id)    // URL pour telechargement PDF
fichesSuiviService.checkConflicts(data)
// ... CRUD complet
```

## Couleurs du theme

```typescript
// Couleurs principales
primary: '#1E88E5'      // Bleu
secondary: '#26A69A'    // Vert-bleu
tertiary: '#7E57C2'     // Violet

// Statuts
soumise: '#FB8C00'      // Orange
validee: '#43A047'      // Vert
refusee: '#E53935'      // Rouge

// Types de seance
CM: '#1E88E5'           // Bleu
TD: '#26A69A'           // Vert
TP: '#7E57C2'           // Violet
```

## Troubleshooting

### Erreur "Unable to resolve module"
```bash
npm start -- --reset-cache
```

### Erreur sur Android Emulator
Verifier que l'API backend tourne sur `http://10.0.2.2:8000`

### Erreur de build iOS
```bash
cd ios && pod install && cd ..
```

## Deploiement Production

- **API:** https://koursa.duckdns.org/api
- **Build release:** `npm run android` (ProGuard active)
- **CI/CD:** Push sur `develop` (pas de deploy auto pour le mobile)

## Licence

Apache License 2.0 - Copyright (c) 2025 M1 INF 4027
