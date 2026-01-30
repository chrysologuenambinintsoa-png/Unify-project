# 📊 Documentation des APIs Badges

## Vue d'ensemble

Les APIs badges fournissent des compteurs en temps réel pour afficher les notifications non lues dans la sidebar et l'interface utilisateur.

---

## Endpoints disponibles

### 1. GET `/api/badges`
**Récupère tous les badges en une seule requête**

```bash
curl -X GET http://localhost:3000/api/badges \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "friends": 3,
    "messages": 5,
    "notifications": 2,
    "groups": 1,
    "pages": 0,
    "stats": {
      "friends": 42,
      "groups": 8
    }
  }
}
```

### 2. GET `/api/badges/friends`
**Récupère le nombre de demandes d'amis en attente**

```bash
curl -X GET http://localhost:3000/api/badges/friends
```

**Réponse:**
```json
{
  "success": true,
  "count": 3
}
```

### 3. GET `/api/badges/messages`
**Récupère le nombre de messages non lus**

```bash
curl -X GET http://localhost:3000/api/badges/messages
```

**Réponse:**
```json
{
  "success": true,
  "count": 5
}
```

### 4. GET `/api/badges/notifications`
**Récupère le nombre de notifications non lues**

```bash
curl -X GET http://localhost:3000/api/badges/notifications
```

**Réponse:**
```json
{
  "success": true,
  "count": 2
}
```

### 5. GET `/api/badges/groups`
**Récupère le nombre d'invitations de groupe en attente**

```bash
curl -X GET http://localhost:3000/api/badges/groups
```

**Réponse:**
```json
{
  "success": true,
  "count": 1
}
```

---

## Utilisation dans les composants

### Hook `useBadges`

```tsx
import { useBadges } from '@/hooks/useBadges';

export function MyComponent() {
  const { badges, loading, error, refetch } = useBadges();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <p>Messages non lus: {badges.messages}</p>
      <p>Demandes d'amis: {badges.friends}</p>
      <p>Notifications: {badges.notifications}</p>
      <p>Invitations de groupe: {badges.groups}</p>
      
      <button onClick={() => refetch()}>Rafraîchir</button>
    </div>
  );
}
```

### Composant `SidebarBadge`

Affiche un badge avec compteur animé :

```tsx
import { SidebarBadge } from '@/components/SidebarBadge';

<SidebarBadge
  count={5}
  variant="error"      // default | error | warning | success
  size="md"            // sm | md
  animate={true}       // Active l'animation pulse
/>
```

### Composant `BadgesOverview`

Affiche un aperçu visuel de tous les badges :

```tsx
import { BadgesOverview } from '@/components/BadgesOverview';

<BadgesOverview />
```

Affiche:
- 💬 Messages non lus
- 🔔 Notifications
- 👥 Demandes d'amis
- 👫 Invitations de groupe

---

## Mise à jour en temps réel

Le système utilise plusieurs stratégies :

### 1. Polling automatique
- Refresh automatique toutes les 10 secondes
- Peut être personnalisé via le hook

### 2. PostMessage API
Pour les mises à jour entre onglets/fenêtres :

```tsx
// Envoyer une mise à jour
window.postMessage({
  type: 'BADGES_UPDATED',
  badges: newBadgesData
}, '*');
```

### 3. WebSocket (future)
Peut être étendu pour un système WebSocket/Socket.io plus réactif.

---

## Structure de la Sidebar mise à jour

La sidebar affiche maintenant :

```
📌 Accueil
🔍 Explorer
🔔 Notifications    [2]
✉️  Messages          [5]
👥 Amis              [3]
👫 Groupes           [1]
🚩 Pages
⚙️  Paramètres
```

Chaque élément avec un badge affiche le compteur en rouge avec animation.

---

## Performance

- **Caching**: Les données sont mises en cache localement
- **Polling optimisé**: Requêtes groupées toutes les 30 secondes
- **Animations légères**: Utilise Framer Motion pour les transitions douces

---

## Notes de développement

- Les badges sont recalculés à chaque nouvelle session
- Les comptes sont en temps quasi-réel (délai de 30 secondes max)
- Les erreurs de fetch sont loggées en console
- AuthOptions est requis pour toutes les requêtes

---

## Prochaines améliorations

- [ ] WebSocket pour les mises à jour instantanées
- [ ] Notifications push du navigateur
- [ ] Emails pour les alertes importantes
- [ ] Configuration des préférences de notification par utilisateur
