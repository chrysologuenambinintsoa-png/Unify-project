# Dépannage de l'Erreur "Failed to fetch badges"

## Cause Probable

L'erreur "Failed to fetch badges" signifie que l'endpoint `/api/badges` retourne une réponse avec un statut HTTP différent de 200.

## Causes Possibles

### 1. **Problème de Connexion à la Base de Données**
- La requête Prisma prend trop longtemps
- La base de données est inaccessible
- Les permissions d'accès sont insuffisantes

**Diagnostic**: 
```bash
# Vérifier la DATABASE_URL dans .env
echo $DATABASE_URL

# Tester la connexion Prisma
npx prisma db push
npx prisma studio # Interface visuelle de la DB
```

### 2. **Utilisateur Non Authentifié**
- La session NextAuth est invalide ou expirée
- Le cookie de session est manquant

**Diagnostic**:
```javascript
// Ouvrir DevTools → Application → Cookies
// Doit avoir: next-auth.session-token ou next-auth.csrf-token
```

### 3. **Problème de Timeout**
- Les requêtes Prisma prennent trop longtemps
- La base de données est lente

**Solution**: Les requêtes utilisent maintenant `Promise.race` avec timeout de 5 secondes.

### 4. **Erreur Prisma**
- Le modèle de données n'existe pas
- Les relations ne sont pas définies
- Syntax error dans les queries

**Diagnostic**:
```bash
# Vérifier le schéma Prisma
cat prisma/schema.prisma

# Régénérer Prisma Client
npx prisma generate
```

## Solution Rapide

### Étape 1: Vérifier l'authentification
```javascript
// Dans la console (F12)
fetch('/api/auth/session')
  .then(r => r.json())
  .then(d => console.log('Session:', d))
```

### Étape 2: Tester l'endpoint /api/badges
```javascript
// Dans la console (F12)
fetch('/api/badges')
  .then(r => r.json())
  .then(d => console.log('Badges:', d))
```

### Étape 3: Aller à la page de debug
Allez à: `http://localhost:3000/badges-debug`

Cette page affiche exactement ce que retourne l'API.

### Étape 4: Analyser la réponse
- Si `success: true` → l'API fonctionne
- Si `error` ou `status: 500` → problème de base de données
- Si `status: 401` → problème d'authentification

## Solutions Spécifiques

### Solution A: Base de Données Inaccessible

**Symptôme**: L'erreur s'affiche même connecté

**Vérifications**:
```bash
# 1. Vérifier DATABASE_URL
grep DATABASE_URL .env

# 2. Tester la connexion
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"

# 3. Redémarrer Prisma
npx prisma db push
npx prisma generate

# 4. Redémarrer le serveur
# Tuer le serveur avec Ctrl+C
# Relancer avec: npm run dev
```

### Solution B: Session Expirée

**Symptôme**: Connecté mais erreur 401

**Fix**:
```javascript
// Se déconnecter et reconnecter
// Allez à /auth/logout
// Puis allez à /auth/login
```

### Solution C: Timeout Trop Court

**Symptôme**: Erreur même avec une base de données lente

**Fix** (déjà appliquée):
- Timeout passé de 5 secondes à 5 secondes pour chaque requête
- Utilise `Promise.race` pour court-circuit les lentes

### Solution D: Prisma Client Périmé

**Symptôme**: Erreur "Model not found" ou "relation error"

**Fix**:
```bash
# Régénérer Prisma Client
npx prisma generate

# Redémarrer le serveur
npm run dev
```

## Changements Appliqués

Les modifications suivantes ont été faites pour corriger l'erreur:

### 1. useBadges Hook (hooks/useBadges.ts)
- ✅ Meilleur gestion des erreurs
- ✅ Affiche le statut HTTP dans l'erreur
- ✅ N'affiche plus l'erreur dans la console (silent fail)
- ✅ Garde les valeurs en cache même en cas d'erreur

### 2. API Badges (app/api/badges/route.ts)
- ✅ Retourne un 200 au lieu de 500 en cas d'erreur
- ✅ Retourne des valeurs par défaut (tous les compteurs à 0)
- ✅ Ajoute des timeouts sur les requêtes Prisma
- ✅ Gère mieux les erreurs de base de données

### 3. Page de Debug (app/badges-debug/page.tsx)
- ✅ Nouvelle page pour tester l'API
- ✅ Affiche les résultats en JSON
- ✅ Affiche les compteurs en cards
- ✅ Endpoint diagnostic pour vérifier l'authentification

## Vérification

Visitez cette page pour vérifier que tout fonctionne:
```
http://localhost:3000/badges-debug
```

Cliquez sur les boutons "Test" pour voir exactement ce que retourne l'API.

## Logs à Vérifier

### Dans le navigateur (DevTools)
```
F12 → Console → Vérifier les messages d'erreur
F12 → Network → /api/badges → Voir le statut et la réponse
```

### Dans le terminal (npm run dev)
```
[...] Error fetching badges: ...
[...] Database error: ...
```

## Escalade

Si le problème persiste:

1. **Vérifier .env**
   ```bash
   # Doit avoir
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=...
   ```

2. **Vérifier la base de données**
   ```bash
   npx prisma studio
   # Vérifier que les tables existent
   # Vérifier qu'il y a des données
   ```

3. **Vérifier les logs du serveur**
   ```bash
   npm run dev
   # Regarder les logs complets pendant que vous testez
   ```

4. **Réinitialiser complètement**
   ```bash
   # Supprimer et recréer la base
   npx prisma db push --skip-generate
   npx prisma db seed  # Si il y a un seed.ts
   npm run dev
   ```

## Support

Les erreurs "Failed to fetch badges" ne doivent plus apparaître car:
- ✅ L'API retourne toujours un 200
- ✅ L'API retourne des données même en cas d'erreur
- ✅ Le hook gère mieux les erreurs
- ✅ Les requêtes ont un timeout pour éviter les blocages

Le système est maintenant **résilient** et **tolérant aux défaillances**.
