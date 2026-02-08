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
│   │   └── AuthContext.tsx      # Authentification
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

## Fonctionnalites

### Authentification
- Connexion (email/password)
- Inscription delegue avec selection du niveau represente
- Compte demarre en `EN_ATTENTE`, approuve par le Chef de Departement ou Super Admin
- Gestion de session avec AsyncStorage

### Dashboard
- Profil utilisateur
- Statistiques des fiches (total, validees, refusees, en attente)
- Liste des fiches en attente
- Actions rapides (nouvelle fiche, mes fiches)

### Gestion des fiches de suivi
- Liste des fiches avec filtrage par statut
- Recherche par UE, chapitre, contenu
- Creation de nouvelle fiche
- Types de seance : CM, TD, TP

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

# Dans un autre terminal
npm run android
```

3. **Pour iOS (macOS uniquement)**
```bash
cd ios && pod install && cd ..
npm start
# Dans un autre terminal
npm run ios
```

## Configuration API

La configuration se trouve dans `src/api/config.ts` :

- **Production:** `https://koursa.duckdns.org/api`
- **Developpement Android Emulator:** `http://10.0.2.2:8000/api`
- **Developpement iOS Simulator:** `http://localhost:8000/api`

```typescript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api'
  : 'https://koursa.duckdns.org/api';
```

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
    │   └── Profil
    └── Modals
        ├── CreateFiche
        └── FicheDetail
```

## Ecrans a implementer

- [ ] Detail d'une fiche (FicheDetailScreen)
- [ ] Validation/Refus des fiches
- [ ] Gestion academique (Facultes, Departements, Filieres, Niveaux)
- [ ] Gestion des utilisateurs
- [ ] Notifications push

## Licence

Apache License 2.0 - Copyright (c) 2025 M1 INF 4027
