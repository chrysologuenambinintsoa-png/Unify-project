# Dépannage du Système de Notifications

## Problèmes Courants et Solutions

### 1. Les notifications ne s'affichent pas

**Symptôme**: La page `/notifications` est vide

**Causes possibles**:
- Pas de notifications dans la base de données
- L'utilisateur n'est pas authentifié
- La session a expiré

**Solutions**:
```bash
# Vérifier que vous êtes connecté
# Allez sur /auth/login ou /register

# Vérifier que des notifications existent en DB:
# Exécutez: SELECT COUNT(*) FROM notifications WHERE userId = '[user-id]';

# Vérifier les logs d'erreur dans la console du navigateur
# F12 → Console → Voir les erreurs network
```

### 2. Cliquer sur une notification n'appelle pas markAsRead

**Symptôme**: Le point bleu reste après un clic

**Causes possibles**:
- La prop `onRead` n'est pas passée au NotificationItem
- Le composant NotificationItem n'est pas importé correctement
- Erreur dans le hook useNotifications

**Solutions**:
```tsx
// Vérifier que NotificationItem reçoit onRead prop
<NotificationItem
  id={notification.id}
  type={notification.type}
  user={notification.user}
  content={notification.content}
  time={notification.time}
  read={notification.read}
  onRead={markAsRead}  // ← Doit être présent
  actionLink={getActionLink(notification)}
/>

// Vérifier dans DevTools:
// Network → /api/notifications/[id]/read → Status 200 ou 401
```

### 3. Le compteur en haut reste à 0 après marquer comme lu

**Symptôme**: `{unreadCount} notifications non lues` n'se met pas à jour

**Causes possibles**:
- Le hook retourne pas le bon `unreadCount`
- L'API ne retourne pas `unreadCount` dans la réponse

**Solutions**:
```typescript
// Vérifier que useNotifications retourne unreadCount
const { unreadCount } = useNotifications();
console.log('Unread count:', unreadCount);

// Vérifier la réponse API:
// Network → POST /api/notifications/[id]/read
// Response body doit avoir: { unreadCount: 3 }
```

### 4. Le badge sidebar ne se met pas à jour après marquer comme lu

**Symptôme**: Le badge montre toujours l'ancien nombre

**Causes possibles**:
- Le hook useBadges ne fetch pas assez souvent
- La communication entre hooks n'est pas synchrone

**Solutions**:
```typescript
// Les deux hooks ont leur propre polling
// Max 30 secondes avant mise à jour

// Forcer le refresh manuel:
const { refetch } = useBadges();
refetch(); // Appeler après marquer comme lu

// Ou ouvrir une autre notification pour forcer le polling
```

### 5. Erreur 401 Unauthorized

**Symptôme**: API retourne 401 quand on marque une notification comme lue

**Causes**:
- Session expiée
- Token NextAuth invalide
- Utilisateur n'est pas authentifié

**Solutions**:
```bash
# Vérifier les cookies:
# DevTools → Application → Cookies
# Doit avoir: next-auth.session-token

# Se reconnecter:
# Allez sur /auth/logout puis /auth/login

# Vérifier la configuration NextAuth:
# app/api/auth/[...nextauth]/route.ts
```

### 6. Erreur "Notification not found"

**Symptôme**: Cliquer sur une notification affiche une erreur 404

**Causes**:
- La notification a été supprimée entre le fetch et le clic
- L'ID est incorrect
- L'utilisateur n'a pas la permission

**Solutions**:
```bash
# Vérifier la notification existe:
# SELECT * FROM notifications WHERE id = '[notification-id]';

# Vérifier que userId correspond:
# La notification doit appartenir à l'utilisateur authentifié
```

### 7. Les notifications se mettent à jour trop lentement

**Symptôme**: Après marquer comme lu, il faut attendre 30 secondes pour voir le changement

**Cause**:
- Le polling interval de 30 secondes est par design

**Solution**:
- C'est normal et optimisé pour la performance
- Pour du temps réel immédiat, implémenter WebSocket (futur)

```typescript
// Actuellement: Polling toutes les 30 secondes
const interval = setInterval(fetchNotifications, 30000);

// Futur: WebSocket pour temps réel
const socket = new WebSocket('ws://...');
socket.on('notification:read', (data) => { ... });
```

### 8. Les animations ne s'affichent pas

**Symptôme**: Les notifications n'ont pas d'animation d'apparition

**Causes**:
- Framer Motion pas installé
- Les classNames sont mal appliqués

**Solutions**:
```bash
# Vérifier Framer Motion:
npm list framer-motion

# Doit être installé: ≥ 10.0.0

# Vérifier les imports:
import { motion } from 'framer-motion';
```

### 9. Marquer tous comme lu ne fonctionne pas

**Symptôme**: Cliquer "Tout marquer comme lu" n'a aucun effet

**Causes**:
- Le handler n'est pas attaché au bouton
- L'API endpoint n'existe pas

**Solutions**:
```tsx
// Vérifier le bouton:
<button onClick={handleMarkAllAsReadClick}>

// Vérifier la fonction existe:
const handleMarkAllAsReadClick = async () => {
  await markAllAsRead();
}

// Vérifier l'API:
// PATCH /api/notifications
// Body: { all: true }
```

### 10. Les filtres ne fonctionnent pas

**Symptôme**: Changer le filtre n'affiche rien

**Causes**:
- La logique de filtrage est incorrecte
- Les types de notifications ne correspondent pas

**Solutions**:
```typescript
// Types valides:
'like', 'comment', 'follow', 'mention'

// Vérifier la notification a le bon type:
SELECT DISTINCT type FROM notifications;

// Vérifier le filtrage:
const filteredNotifications = activeFilter === 'all'
  ? notifications
  : notifications.filter(n => n.type === activeFilter);
```

## Déboguer avec les Logs

### Logs à vérifier:

```typescript
// 1. Console du navigateur (F12 → Console)
// Doit voir: "Fetching notifications..."

// 2. Network tab (F12 → Network)
// Requêtes attendues:
// - GET /api/notifications
// - PATCH /api/notifications/[id]/read
// - GET /api/badges (après 30s)

// 3. Vérifier les réponses:
// Response devrait avoir status 200 et inclure unreadCount
```

### Activer les logs de débogage:

```typescript
// Dans useNotifications.ts, ajouter:
console.log('Fetching notifications...');
console.log('Notifications fetched:', data.notifications);
console.log('Unread count:', data.unreadCount);

// Dans NotificationItem.tsx, ajouter:
console.log('Marking notification as read:', id);
```

## Vérification Rapide

Copiez-collez dans la console (F12):

```javascript
// Vérifier les notifications
fetch('/api/notifications')
  .then(r => r.json())
  .then(d => console.log('Notifications:', d))

// Vérifier les badges
fetch('/api/badges')
  .then(r => r.json())
  .then(d => console.log('Badges:', d))

// Marquer une notification comme lue (remplacer l'ID)
fetch('/api/notifications/notification-id-here/read', {
  method: 'PATCH'
})
  .then(r => r.json())
  .then(d => console.log('Result:', d))
```

## Contacter le Support

Si aucune solution ne fonctionne:

1. Vérifiez les logs serveur (terminal où npm run dev tourne)
2. Exportez la DB et vérifiez les données
3. Activez le mode debug NextAuth
4. Vérifiez la configuration environment variables
