#!/bin/bash

# Script de vérification complète du système de notifications
# Exécution: bash verify-notifications-complete.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Vérification Complète du Système de Notifications         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs pour l'output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

echo -e "${BLUE}1. Vérification des fichiers...${NC}"
echo ""

all_files_exist=true

check_file "app/notifications/page.tsx" || all_files_exist=false
check_file "components/NotificationItem.tsx" || all_files_exist=false
check_file "hooks/useNotifications.ts" || all_files_exist=false
check_file "hooks/useBadges.ts" || all_files_exist=false
check_file "app/api/notifications/route.ts" || all_files_exist=false
check_file "app/api/notifications/[notificationId]/read/route.ts" || all_files_exist=false
check_file "components/layout/Sidebar.tsx" || all_files_exist=false

echo ""
echo -e "${BLUE}2. Vérification de la compilation TypeScript...${NC}"
echo ""

# Vérifie s'il y a des erreurs TypeScript
if npx tsc --noEmit 2>/dev/null; then
  echo -e "${GREEN}✓${NC} Aucune erreur TypeScript"
else
  echo -e "${YELLOW}⚠${NC} Erreurs TypeScript détectées (voir détails ci-dessous)"
  npx tsc --noEmit
fi

echo ""
echo -e "${BLUE}3. Vérification des imports...${NC}"
echo ""

# Vérifier que les imports sont corrects
if grep -r "from '@/components/NotificationItem'" app/notifications/page.tsx > /dev/null; then
  echo -e "${GREEN}✓${NC} Import NotificationItem est correct"
else
  echo -e "${RED}✗${NC} Import NotificationItem introuvable"
fi

if grep -r "from '@/hooks/useNotifications'" app/notifications/page.tsx > /dev/null; then
  echo -e "${GREEN}✓${NC} Import useNotifications est correct"
else
  echo -e "${RED}✗${NC} Import useNotifications introuvable"
fi

if grep -r "from '@/hooks/useBadges'" components/layout/Sidebar.tsx > /dev/null; then
  echo -e "${GREEN}✓${NC} Import useBadges est correct"
else
  echo -e "${RED}✗${NC} Import useBadges introuvable"
fi

echo ""
echo -e "${BLUE}4. Vérification des API endpoints...${NC}"
echo ""

if grep -q "GET" app/api/notifications/route.ts; then
  echo -e "${GREEN}✓${NC} Endpoint GET /api/notifications existe"
else
  echo -e "${RED}✗${NC} Endpoint GET /api/notifications manquant"
fi

if grep -q "PATCH" app/api/notifications/route.ts; then
  echo -e "${GREEN}✓${NC} Endpoint PATCH /api/notifications existe"
else
  echo -e "${RED}✗${NC} Endpoint PATCH /api/notifications manquant"
fi

if grep -q "PATCH" app/api/notifications/[notificationId]/read/route.ts; then
  echo -e "${GREEN}✓${NC} Endpoint PATCH /api/notifications/[id]/read existe"
else
  echo -e "${RED}✗${NC} Endpoint PATCH /api/notifications/[id]/read manquant"
fi

echo ""
echo -e "${BLUE}5. Vérification des fonctionnalités...${NC}"
echo ""

# Vérifier les fonctionnalités dans useNotifications
if grep -q "markAsRead" hooks/useNotifications.ts; then
  echo -e "${GREEN}✓${NC} Fonction markAsRead implémentée"
else
  echo -e "${RED}✗${NC} Fonction markAsRead manquante"
fi

if grep -q "markAllAsRead" hooks/useNotifications.ts; then
  echo -e "${GREEN}✓${NC} Fonction markAllAsRead implémentée"
else
  echo -e "${RED}✗${NC} Fonction markAllAsRead manquante"
fi

if grep -q "auto-refresh" hooks/useNotifications.ts || grep -q "setInterval" hooks/useNotifications.ts; then
  echo -e "${GREEN}✓${NC} Auto-refresh implémenté"
else
  echo -e "${YELLOW}⚠${NC} Auto-refresh non trouvé"
fi

# Vérifier le filtrage
if grep -q "activeFilter" app/notifications/page.tsx; then
  echo -e "${GREEN}✓${NC} Filtrage par type implémenté"
else
  echo -e "${RED}✗${NC} Filtrage manquant"
fi

# Vérifier les animations
if grep -q "motion" app/notifications/page.tsx; then
  echo -e "${GREEN}✓${NC} Animations Framer Motion intégrées"
else
  echo -e "${RED}✗${NC} Animations manquantes"
fi

echo ""
echo -e "${BLUE}6. Résumé des modifications...${NC}"
echo ""

echo "Fichiers créés:"
echo "  • app/notifications/page.tsx (mise à jour)"
echo "  • components/NotificationItem.tsx"
echo "  • hooks/useNotifications.ts"
echo "  • app/api/notifications/[notificationId]/read/route.ts"
echo ""

echo "Fichiers modifiés:"
echo "  • app/api/notifications/route.ts (ajout PATCH avec unreadCount)"
echo "  • components/layout/Sidebar.tsx (badges intégrés)"
echo ""

echo "Documentation créée:"
echo "  • NOTIFICATION_SYSTEM.md"
echo "  • NOTIFICATION_TROUBLESHOOTING.md"
echo "  • NOTIFICATION_FLOW_TEST.js"
echo ""

echo -e "${BLUE}7. Guide de test...${NC}"
echo ""

echo "Pour tester le système:"
echo ""
echo "  1. Démarrer le serveur:"
echo "     npm run dev"
echo ""
echo "  2. Aller à la page des notifications:"
echo "     http://localhost:3000/notifications"
echo ""
echo "  3. Tester les fonctionnalités:"
echo "     a) Vérifier que les notifications s'affichent"
echo "     b) Cliquer sur une notification non lue"
echo "        → Le point bleu devrait disparaître"
echo "        → Le compteur devrait diminuer"
echo "     c) Cliquer sur un filtre (ex: Likes)"
echo "        → Seules les notifications de type 'like' s'affichent"
echo "     d) Cliquer 'Tout marquer comme lu'"
echo "        → Tous les points bleus disparaissent"
echo "        → Le compteur devient 0"
echo ""
echo "  4. Vérifier le sidebar:"
echo "     a) Le badge 'Notifications' s'affiche"
echo "     b) Il montre le nombre de notifications non lues"
echo "     c) Il se met à jour dans max 30 secondes"
echo ""
echo "  5. Cliquer sur une notification:"
echo "     a) La notification est lue"
echo "     b) Le compteur diminue"
echo "     c) Le badge sidebar se met à jour"
echo ""

echo -e "${BLUE}8. Statut final...${NC}"
echo ""

if [ "$all_files_exist" = true ]; then
  echo -e "${GREEN}✓${NC} Tous les fichiers existent"
  echo -e "${GREEN}✓${NC} Système de notifications prêt pour le test"
else
  echo -e "${RED}✗${NC} Certains fichiers sont manquants"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           Vérification Complète Terminée                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
