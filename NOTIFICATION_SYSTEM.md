# Système de Notifications - Documentation

## Vue d'ensemble

Le système de notifications a été complètement implémenté avec les fonctionnalités suivantes :
- Affichage des notifications cliquables
- Marquage des notifications comme lues (individuellement et en masse)
- Mise à jour automatique des compteurs de badges
- Filtrage des notifications par type
- Interface utilisateur animée avec Framer Motion

## Architecture

### API Endpoints

#### 1. GET `/api/notifications`
Récupère toutes les notifications de l'utilisateur actuel

**Response:**
```json
{
  "notifications": [
    {
      "id": "notif-id",
      "type": "like|comment|follow|mention",
      "user": {
        "id": "user-id",
        "username": "username",
        "fullName": "Full Name",
        "avatar": "url"
      },
      "content": "a aimé votre post",
      "time": "2024-01-15T10:30:00Z",
      "read": false
    }
  ],
  "unreadCount": 5
}
```

#### 2. PATCH `/api/notifications/[notificationId]/read`
Marque une notification spécifique comme lue

**Response:**
```json
{
  "success": true,
  "notification": { /* notification object */ },
  "unreadCount": 4
}
```

#### 3. PATCH `/api/notifications`
Marque toutes les notifications comme lues (avec body `{ all: true }`)

**Response:**
```json
{
  "success": true,
  "unreadCount": 0
}
```

## Components

### NotificationItem
Component réutilisable pour afficher une notification cliquable

**Props:**
```typescript
interface NotificationItemProps {
  id: string;
  type: string; // 'like', 'comment', 'follow', 'mention'
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  content: string;
  time: string; // ISO string
  read: boolean;
  onRead?: (notificationId: string) => void;
  actionLink?: string; // Link destination on click
}
```

**Fonctionnalités:**
- Wrappé dans un composant `Link` pour navigation cliquable
- Indicateur visuel d'état non lu (point bleu animé)
- Temps relatif formaté (À l'instant, Il y a Xm/h/j)
- Animation au survol
- Icon spécifique par type de notification

## Hooks

### useNotifications
Hook personnalisé pour gérer les notifications

```typescript
const {
  notifications,    // NotificationData[]
  unreadCount,      // number
  loading,          // boolean
  error,            // string | null
  markAsRead,       // (id: string) => Promise<void>
  markAllAsRead,    // () => Promise<void>
  fetchNotifications // () => Promise<void>
} = useNotifications();
```

**Fonctionnalités:**
- Récupération automatique au chargement
- Mise à jour automatique toutes les 30 secondes (polling)
- Marquage individuel comme lu
- Marquage global comme lu
- Gestion des erreurs

### useBadges
Hook pour les badges (amis, messages, notifications, groupes)

**Fonctionnalités:**
- Polling automatique toutes les 30 secondes
- Synchronisation entre onglets via `postMessage`
- Refetch manuel disponible

## Pages

### `/app/notifications/page.tsx`

**Fonctionnalités:**
- Affichage de la liste des notifications
- Filtrage par type (Tout, Mentions, Likes, Commentaires, Abonnements)
- Bouton "Tout marquer comme lu"
- Affichage du compteur de notifications non lues
- État de chargement et gestion des erreurs
- Message vide quand il n'y a pas de notifications

## Flux Complet

### 1. Utilisateur voit une notification non lue
```
API GET /notifications
↓
Hook useNotifications affiche la notification avec read=false
↓
Composant NotificationItem affiche un point bleu pulsant
↓
Badge sidebar montre le compteur de notifications non lues
```

### 2. Utilisateur clique sur une notification
```
NotificationItem onClick
↓
appel markAsRead(notificationId)
↓
API PATCH /api/notifications/[id]/read
↓
notification.read = true dans le state local
↓
unreadCount décrémente automatiquement
↓
Badge sidebar se met à jour dans les 30 secondes
```

### 3. Utilisateur clique "Tout marquer comme lu"
```
Bouton onClick
↓
appel markAllAsRead()
↓
API PATCH /api/notifications { all: true }
↓
Toutes les notifications.read = true
↓
unreadCount = 0
↓
Badge disparaît du sidebar

```

## Caractéristiques Avancées

### Auto-refresh
- Les notifications se mettent à jour automatiquement toutes les 30 secondes
- Les badges se mettent à jour automatiquement toutes les 30 secondes
- Les deux hooks ont un délai décalé pour optimiser les requêtes

### Types de Notifications Supportés
- `like` - Quelqu'un a aimé votre publication
- `comment` - Quelqu'un a commenté votre publication
- `follow` - Quelqu'un vous suit
- `mention` - Quelqu'un vous a mentionné

### Liens d'Action Intelligents
```typescript
const getActionLink = (notification) => {
  switch (notification.type) {
    case 'like':
    case 'comment':
      return `/posts/${notification.id}`;
    case 'follow':
    case 'mention':
      return `/users/${notification.user.id}`;
    default:
      return '/';
  }
};
```

Les notifications cliquables dirigent vers la source (post ou profil utilisateur)

## État de l'Implémentation

✅ API pour récupérer les notifications
✅ API pour marquer comme lu (individuel et global)
✅ Composant NotificationItem cliquable
✅ Hook useNotifications avec auto-refresh
✅ Page /notifications avec filtrage
✅ Indicateurs visuels (point bleu, badges)
✅ Compteurs synchronisés avec badges sidebar
✅ Animations et transitions Framer Motion

## Testing

Pour tester le système :

1. **Page de test des badges**: `/badges-test`
   - Affiche tous les badges en temps réel
   - Simule des mises à jour

2. **Page des notifications**: `/notifications`
   - Affiche toutes les notifications
   - Permet de marquer comme lues
   - Affiche le compteur non lu

3. **Sidebar**: Affiche les badges avec conteurs (mis à jour en temps réel)

## Performance

- **Polling optimisé**: 30 secondes entre chaque refresh
- **Pagination**: Support des 50 dernières notifications
- **Caching**: Les données sont cachées localement dans le component state
- **Animations performantes**: Utilisation de Framer Motion avec GPU acceleration
