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

## Structure du projet

```
KOURSA_FONTEND_MOBILE/
├── src/
│   ├── api/                    # Services API
│   │   ├── config.ts           # Configuration Axios
│   │   └── services.ts         # Services CRUD
│   ├── contexts/               # Contextes React
│   │   └── AuthContext.tsx     # Authentification
│   ├── navigation/             # Navigation
│   │   └── AppNavigator.tsx    # Configuration routes
│   ├── screens/                # Ecrans
│   │   ├── auth/               # Authentification
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── dashboard/          # Dashboard
│   │   │   └── DashboardScreen.tsx
│   │   └── fiches/             # Fiches de suivi
│   │       ├── FichesListScreen.tsx
│   │       └── CreateFicheScreen.tsx
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
- Ecran d'inscription avec selection de role
- Gestion de session avec AsyncStorage
- Deconnexion

### Dashboard
- Affichage du profil utilisateur
- Statistiques des fiches (total, validees, refusees, en attente)
- Liste des fiches en attente
- Actions rapides (nouvelle fiche, mes fiches, academique)

### Gestion des fiches de suivi
- Liste des fiches avec filtrage par statut
- Recherche par UE, chapitre, contenu
- Creation de nouvelle fiche
- Affichage du type de seance (CM, TD, TP)

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

L'application mobile se connecte automatiquement à l'API backend hébergée sur le VPS.

### URLs configurées

**Production (VPS):**
- URL: `http://84.247.183.206:8082/api`
- Utilisée lorsque l'app est compilée en mode production

**Développement (local):**
- Android Emulator: `http://10.0.2.2:8000/api`
- iOS Simulator: `http://localhost:8000/api`
- Device physique: Remplacez par l'IP de votre machine (ex: `http://192.168.1.X:8000/api`)

### Modifier la configuration

La configuration se trouve dans `src/api/config.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api'           // Mode développement
  : 'http://84.247.183.206:8082/api';    // Mode production (VPS)
```

Pour tester avec l'API de production en mode développement, changez temporairement:

```typescript
const API_BASE_URL = 'http://84.247.183.206:8082/api';
```

## Ecrans a implementer

- [ ] Detail d'une fiche (FicheDetailScreen)
- [ ] Validation/Refus des fiches
- [ ] Gestion academique (Facultes, Departements, Filieres, Niveaux)
- [ ] Gestion des utilisateurs
- [ ] Profil utilisateur
- [ ] Notifications

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

## Licence

MIT License - Copyright (c) 2025 M1 INF 4027
