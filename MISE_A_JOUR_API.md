# Mise à Jour de l'API Backend - Koursa Mobile

## ✅ Changements effectués

L'application mobile a été mise à jour pour utiliser le backend hébergé sur votre VPS au lieu de l'ancien backend Render.

### 1. Fichier de configuration API mis à jour

**Fichier:** `src/api/config.ts`

**Avant:**
```typescript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api'
  : 'https://votre-api-production.com/api';  // Placeholder
```

**Après:**
```typescript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api'
  : 'http://84.247.183.206:8082/api';  // Production VPS ✅
```

### 2. Documentation créée

- ✅ **`.env.example`** - Template de configuration
- ✅ **`API_CONFIGURATION.md`** - Guide complet de configuration
- ✅ **`README.md`** - Section "Configuration API" mise à jour
- ✅ **`MISE_A_JOUR_API.md`** - Ce fichier récapitulatif

## 🌐 URLs configurées

### Backend de Production (VPS)
```
Base URL: http://84.247.183.206:8082
API: http://84.247.183.206:8082/api
Admin: http://84.247.183.206:8082/admin/
Swagger: http://84.247.183.206:8082/swagger/
```

### Backend de Développement (Local)
```
Android Emulator: http://10.0.2.2:8000/api
iOS Simulator: http://localhost:8000/api
Device physique: http://[VOTRE_IP]:8000/api
```

## 🚀 Prochaines étapes

### 1. Tester l'application en mode développement

```bash
cd KOURSA_FONTEND_MOBILE

# Installer les dépendances (si pas déjà fait)
npm install

# Lancer Metro Bundler
npm start

# Dans un autre terminal, lancer l'app
npm run android  # ou npm run ios
```

### 2. Tester avec l'API de production

Pour tester avec l'API de production en mode dev, modifiez temporairement `config.ts`:

```typescript
const API_BASE_URL = 'http://84.247.183.206:8082/api';
```

Puis lancez l'app et essayez de:
1. Créer un compte
2. Se connecter
3. Voir le dashboard
4. Créer une fiche de suivi

### 3. Build de production

Pour créer un build de production (APK/IPA):

**Android:**
```bash
# Build release APK
cd android
./gradlew assembleRelease

# L'APK sera dans: android/app/build/outputs/apk/release/
```

**iOS:**
```bash
# Ouvrir Xcode
open ios/KoursaMobile.xcworkspace

# Puis: Product → Archive → Distribute App
```

## 🔍 Vérification

### Vérifier que l'API est accessible

```bash
# Test simple
curl http://84.247.183.206:8082/api/

# Test de login
curl -X POST http://84.247.183.206:8082/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Vérifier la configuration dans l'app

Ajoutez un console.log dans `config.ts` pour vérifier:

```typescript
console.log('🌐 API URL:', API_BASE_URL);
console.log('🔧 Mode:', __DEV__ ? 'Développement' : 'Production');
```

## 📱 Comportement attendu

### Mode Développement (`__DEV__ = true`)
- L'app se connecte au backend local sur `http://10.0.2.2:8000/api`
- Utilisé pendant le développement avec `npm start`
- Hot reload activé

### Mode Production (`__DEV__ = false`)
- L'app se connecte au VPS sur `http://84.247.183.206:8082/api`
- Utilisé dans les builds release (APK/IPA)
- Optimisations activées

## ⚠️ Points d'attention

### 1. CORS
Le backend doit autoriser les requêtes cross-origin. Vérifiez `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://84.247.183.206:8082",
]

if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
```

### 2. CSRF
Le backend doit avoir `CSRF_TRUSTED_ORIGINS` configuré:

```python
CSRF_TRUSTED_ORIGINS = [
    'http://84.247.183.206:8082',
]
```

### 3. Authentification JWT
L'app utilise JWT pour l'authentification. Le token est:
- Stocké dans AsyncStorage
- Ajouté automatiquement aux headers via un intercepteur Axios
- Supprimé automatiquement si expiré (401)

### 4. HTTPS (Recommandé pour la production)
Actuellement, l'API utilise HTTP. Pour la production, il est recommandé de:
1. Configurer un certificat SSL (Let's Encrypt)
2. Mettre à jour l'URL vers `https://`
3. Configurer Nginx pour HTTPS

## 🐛 Troubleshooting

### L'app ne se connecte pas

1. **Vérifiez que le backend est en ligne:**
   ```bash
   curl http://84.247.183.206:8082/api/
   ```

2. **Vérifiez l'URL dans config.ts:**
   ```bash
   cat src/api/config.ts | grep API_BASE_URL
   ```

3. **Regardez les logs de l'app:**
   ```bash
   npx react-native log-android  # Android
   npx react-native log-ios      # iOS
   ```

4. **Clear cache et rebuild:**
   ```bash
   npm start -- --reset-cache
   ```

### Erreur "Network Error"

- Vérifiez votre connexion internet
- Vérifiez que le serveur VPS est accessible
- Vérifiez que le port 8082 est ouvert
- Testez avec curl depuis votre terminal

### Erreur 401 (Unauthorized)

- Token expiré ou invalide
- Essayez de vous reconnecter
- Vérifiez AsyncStorage: `AsyncStorage.getItem('authToken')`

### Erreur 403 (Forbidden)

- Problème CSRF
- Vérifiez `CSRF_TRUSTED_ORIGINS` sur le backend

## 📊 Résumé

### Avant
- ❌ URL de production non configurée (placeholder)
- ❌ Ancien backend Render (si configuré)

### Après
- ✅ URL de production configurée: `http://84.247.183.206:8082/api`
- ✅ Backend VPS hébergé et fonctionnel
- ✅ Documentation complète
- ✅ Mode dev et prod correctement configurés

## 📚 Documentation

Pour plus de détails, consultez:
- **[API_CONFIGURATION.md](API_CONFIGURATION.md)** - Guide complet
- **[README.md](README.md)** - Documentation principale
- **[.env.example](.env.example)** - Template de configuration

---

**L'application mobile est maintenant prête à communiquer avec le backend hébergé sur le VPS!** 🎉

Pour tout problème, vérifiez:
1. Que le backend est accessible: `http://84.247.183.206:8082`
2. Les logs de l'application
3. La configuration dans `src/api/config.ts`
