# Changelog - Koursa Mobile

Toutes les modifications notables de l'application mobile Koursa.

## [13 janvier 2026] - Configuration Backend VPS

### ✅ Modifié

#### Configuration API
- **`src/api/config.ts`**
  - Mise à jour de l'URL de production: `https://koursa.duckdns.org/api`
  - Ancien: `https://votre-api-production.com/api` (placeholder)
  - Nouveau: Backend VPS hébergé et fonctionnel

#### Documentation
- **`README.md`**
  - Section "Configuration API" entièrement réécrite
  - Ajout des URLs de production et développement
  - Instructions pour modifier la configuration

### ✅ Ajouté

#### Nouveaux fichiers de documentation
- **`.env.example`**
  - Template de configuration des variables d'environnement
  - Documentation des URLs dev/prod

- **`API_CONFIGURATION.md`**
  - Guide complet de configuration de l'API
  - Liste des endpoints disponibles
  - Troubleshooting détaillé
  - Recommandations de sécurité

- **`MISE_A_JOUR_API.md`**
  - Récapitulatif des changements
  - Guide de vérification
  - Prochaines étapes

- **`CHANGELOG.md`**
  - Ce fichier
  - Historique des modifications

### 📋 Détails techniques

#### URLs configurées

**Production (VPS):**
```
Base: https://koursa.duckdns.org
API: https://koursa.duckdns.org/api
Admin: https://koursa.duckdns.org/admin/
Swagger: https://koursa.duckdns.org/swagger/
ReDoc: https://koursa.duckdns.org/redoc/
```

**Développement (Local):**
```
Android Emulator: http://10.0.2.2:8000/api
iOS Simulator: http://localhost:8000/api
Device physique: http://[IP_LOCALE]:8000/api
```

#### Configuration backend

Le backend Django REST Framework est maintenant hébergé sur:
- Serveur: VPS koursa.duckdns.org
- Port: 8082 (externe), 8002 (interne)
- Base de données: PostgreSQL
- Service: systemd + Gunicorn + Nginx
- CI/CD: GitHub Actions

### 🔒 Sécurité

- ✅ Authentification JWT
- ✅ Token stocké dans AsyncStorage
- ✅ Auto-déconnexion sur token expiré (401)
- ✅ Timeout des requêtes: 10 secondes
- ⚠️ HTTP (recommandé: migrer vers HTTPS)

### 🎯 Prochaines améliorations

- [ ] Migrer vers HTTPS avec certificat SSL
- [ ] Implémenter le refresh token automatique
- [ ] Utiliser react-native-keychain pour stockage ultra-sécurisé
- [ ] Ajouter un système de cache des requêtes
- [ ] Implémenter le mode offline

### 📊 Impact

- ✅ L'app mobile peut maintenant communiquer avec le backend en production
- ✅ Mode développement toujours fonctionnel avec backend local
- ✅ Build de production prêt à être déployé
- ✅ Documentation complète disponible

---

## [9-10 janvier 2026] - Version initiale

### ✅ Ajouté

#### Fonctionnalités principales
- Authentification (Login/Register)
- Dashboard avec statistiques
- Gestion des fiches de suivi
- Navigation avec React Navigation
- Thème Material Design 3
- Support mode clair/sombre

#### Architecture
- React Native 0.83.1
- TypeScript
- React Native Paper
- Axios pour les appels API
- AsyncStorage pour la persistance
- Context API pour l'état global

#### Écrans implémentés
- `LoginScreen` - Connexion
- `RegisterScreen` - Inscription
- `DashboardScreen` - Tableau de bord
- `FichesListScreen` - Liste des fiches
- `CreateFicheScreen` - Création de fiche

#### Services API
- Utilisateurs (CRUD)
- Rôles
- Facultés, Départements, Filières, Niveaux (CRUD)
- Unités d'enseignement (CRUD)
- Fiches de suivi (CRUD + validation/refus)

---

## Format du Changelog

Ce changelog suit le format [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

### Types de changements

- **Ajouté** - Nouvelles fonctionnalités
- **Modifié** - Changements dans les fonctionnalités existantes
- **Déprécié** - Fonctionnalités qui seront supprimées
- **Supprimé** - Fonctionnalités supprimées
- **Corrigé** - Corrections de bugs
- **Sécurité** - Changements liés à la sécurité
