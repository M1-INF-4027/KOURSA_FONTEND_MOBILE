# Configuration de l'API Backend - Koursa Mobile

## Vue d'ensemble

L'application mobile Koursa a été configurée pour se connecter au backend hébergé sur le VPS en production.

## URLs configurées

### Production (VPS)
- **URL complète:** `https://koursa.duckdns.org/api`
- **Backend:** Django REST Framework
- **Utilisation:** Mode production de l'application
- **Compilation:** Release builds (APK/IPA)

### Développement (Local)
- **Android Emulator:** `http://10.0.2.2:8000/api`
- **iOS Simulator:** `http://localhost:8000/api`
- **Device physique:** `http://[VOTRE_IP_LOCALE]:8000/api`

## Configuration actuelle

### Fichier principal: `src/api/config.ts`

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api'           // Android Emulator (dev)
  : 'https://koursa.duckdns.org/api';    // Production VPS

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour l'authentification JWT
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default api;
export { API_BASE_URL };
```

## Scénarios d'utilisation

### 1. Développement avec backend local

Si vous développez le backend localement sur votre machine:

**Android Emulator:**
```typescript
const API_BASE_URL = 'http://10.0.2.2:8000/api';
```

**iOS Simulator:**
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

**Device physique:**
```typescript
// Trouvez votre IP locale avec:
// Windows: ipconfig
// Mac/Linux: ifconfig
const API_BASE_URL = 'http://192.168.1.X:8000/api';
```

### 2. Test avec l'API de production

Pour tester l'app en développement avec l'API de production:

```typescript
const API_BASE_URL = 'https://koursa.duckdns.org/api';
```

### 3. Build de production

En mode production (`__DEV__ = false`), l'app utilise automatiquement:
```
https://koursa.duckdns.org/api
```

## Endpoints disponibles

L'API backend expose les endpoints suivants:

### Authentification
- `POST /auth/token/` - Obtenir un token JWT
- `POST /auth/token/refresh/` - Rafraîchir le token

### Utilisateurs
- `GET /users/utilisateurs/` - Liste des utilisateurs
- `POST /users/utilisateurs/` - Créer un utilisateur
- `GET /users/utilisateurs/{id}/` - Détail d'un utilisateur
- `PUT/PATCH /users/utilisateurs/{id}/` - Modifier un utilisateur
- `DELETE /users/utilisateurs/{id}/` - Supprimer un utilisateur

### Académique
- `GET/POST /academic/facultes/` - Facultés
- `GET/POST /academic/departements/` - Départements
- `GET/POST /academic/filieres/` - Filières
- `GET/POST /academic/niveaux/` - Niveaux

### Enseignement
- `GET/POST /teaching/unites-enseignement/` - Unités d'enseignement
- `GET/POST /teaching/fiches-suivi/` - Fiches de suivi
- `POST /teaching/fiches-suivi/{id}/valider/` - Valider une fiche
- `POST /teaching/fiches-suivi/{id}/refuser/` - Refuser une fiche

### Documentation
- Swagger UI: `https://koursa.duckdns.org/swagger/`
- ReDoc: `https://koursa.duckdns.org/redoc/`
- Admin Django: `https://koursa.duckdns.org/admin/`

## Tester la connexion

### Depuis votre terminal

```bash
# Test de l'API
curl https://koursa.duckdns.org/api/

# Test de connexion (remplacez par vos identifiants)
curl -X POST https://koursa.duckdns.org/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

### Depuis l'application

1. Compilez l'app en mode release:
   ```bash
   # Android
   npm run android -- --mode="release"

   # iOS
   npm run ios -- --configuration Release
   ```

2. Ouvrez l'écran de login

3. Essayez de vous connecter avec un compte existant

4. Vérifiez les logs:
   ```bash
   # Android
   npx react-native log-android

   # iOS
   npx react-native log-ios
   ```

## Gestion des erreurs

L'API client gère automatiquement:

### Token expiré (401)
```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré - déconnexion automatique
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // Redirection vers login
    }
    return Promise.reject(error);
  }
);
```

### Timeout (10 secondes)
```typescript
const api = axios.create({
  timeout: 10000, // 10 secondes
});
```

### Erreurs réseau
L'application affiche un message d'erreur si:
- Pas de connexion internet
- Serveur inaccessible
- Timeout dépassé

## Troubleshooting

### L'app ne se connecte pas à l'API

**1. Vérifiez que le backend est en ligne:**
```bash
curl https://koursa.duckdns.org/api/
```

**2. Vérifiez la configuration dans `config.ts`:**
```typescript
console.log('API URL:', API_BASE_URL);
```

**3. Vérifiez les logs de l'app:**
```bash
npx react-native log-android  # ou log-ios
```

**4. Vérifiez que CORS est configuré sur le backend:**

Dans `settings.py` du backend:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://koursa.duckdns.org",
]

# En développement
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
```

### Erreur 401 (Unauthorized)

- Vérifiez que le token est bien stocké: `AsyncStorage.getItem('authToken')`
- Vérifiez que le token est valide (pas expiré)
- Essayez de vous reconnecter

### Erreur 403 (Forbidden)

- Vérifiez les permissions de l'utilisateur
- Vérifiez que CSRF_TRUSTED_ORIGINS est configuré sur le backend

### Timeout

- Vérifiez votre connexion internet
- Augmentez le timeout si nécessaire:
  ```typescript
  const api = axios.create({
    timeout: 30000, // 30 secondes
  });
  ```

## Sécurité

### En production

- ⚠️ **HTTPS:** Idéalement, configurez HTTPS sur le VPS avec un certificat SSL
- ✅ **JWT:** Authentification sécurisée par token
- ✅ **AsyncStorage:** Stockage sécurisé local du token
- ✅ **Timeout:** Protection contre les requêtes longues
- ✅ **Auto-logout:** Déconnexion automatique si token expiré

### Recommandations futures

1. **Migrer vers HTTPS:**
   ```typescript
   const API_BASE_URL = 'https://koursa.duckdns.org:8082/api';
   ```

2. **Utiliser react-native-keychain** pour un stockage ultra-sécurisé:
   ```bash
   npm install react-native-keychain
   ```

3. **Implémenter le refresh token automatique**

4. **Ajouter un certificat SSL sur le VPS (Let's Encrypt)**

## Changelog

### 13 janvier 2026
- ✅ Configuration initiale de l'API de production
- ✅ URL du VPS: `https://koursa.duckdns.org/api`
- ✅ Mise à jour de `src/api/config.ts`
- ✅ Mise à jour du README.md
- ✅ Création de `.env.example`
- ✅ Création de ce guide de configuration

---

**L'application mobile est maintenant configurée pour utiliser le backend hébergé sur le VPS!** 🎉
