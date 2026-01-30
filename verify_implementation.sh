#!/bin/bash
# Script de vérification - Routes et API Recherche Avancée
# Vérifie que tous les fichiers ont été créés correctement

echo "🔍 Vérification de l'implémentation..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
TOTAL=0
FOUND=0

# Fonction pour vérifier un fichier
check_file() {
    local file=$1
    local description=$2
    
    TOTAL=$((TOTAL + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $description"
        FOUND=$((FOUND + 1))
    else
        echo -e "${RED}❌${NC} $description"
        echo "   Fichier attendu: $file"
    fi
}

echo "📁 Routes API"
check_file "app/api/messages/send/route.ts" "POST /api/messages/send"
check_file "app/api/friends/add/route.ts" "POST /api/friends/add (NOUVEAU)"
check_file "app/api/pages/follow/route.ts" "POST/DELETE /api/pages/follow (NOUVEAU)"
check_file "app/api/groups/join/route.ts" "POST/DELETE /api/groups/join (NOUVEAU)"
check_file "app/api/search/route.ts" "GET /api/search (AMÉLIORÉ)"

echo ""
echo "🎨 Composants React"
check_file "components/SearchBarEnhanced.tsx" "SearchBarEnhanced (NOUVEAU)"

echo ""
echo "🎣 Hooks TypeScript"
check_file "hooks/useSearchActions.ts" "useSearchActions (NOUVEAU)"

echo ""
echo "📝 Types TypeScript"
check_file "types/search-actions.ts" "search-actions types (NOUVEAU)"

echo ""
echo "⚙️ Configuration"
check_file "lib/search-actions-config.ts" "search-actions-config (NOUVEAU)"

echo ""
echo "🧪 Tests"
check_file "__tests__/api/search-actions.test.ts" "search-actions.test.ts (NOUVEAU)"

echo ""
echo "📚 Documentation"
check_file "API_ACTIONS_SEARCH_DOCUMENTATION.md" "API Documentation"
check_file "INTEGRATION_GUIDE_SEARCH_ACTIONS.md" "Integration Guide"
check_file "IMPLEMENTATION_SUMMARY_SEARCH_ACTIONS.md" "Implementation Summary"
check_file "SEARCH_ACTIONS_README.md" "Search Actions README"
check_file "QUICK_START_SEARCH_ACTIONS.md" "Quick Start Guide"
check_file "FILES_MANIFEST_SEARCH_ACTIONS.md" "Files Manifest"
check_file "INDEX_SEARCH_ACTIONS.md" "Documentation Index"
check_file "COMPLETE_SUMMARY.md" "Complete Summary"

echo ""
echo "================================"
echo "📊 Résultats: $FOUND/$TOTAL fichiers trouvés"
echo "================================"

if [ $FOUND -eq $TOTAL ]; then
    echo -e "${GREEN}✅ Tous les fichiers sont présents!${NC}"
    echo ""
    echo "🚀 Prochaines étapes:"
    echo "1. Lire QUICK_START_SEARCH_ACTIONS.md (5 minutes)"
    echo "2. Importer SearchBarEnhanced dans /search/page.tsx"
    echo "3. Tester avec: npm test -- __tests__/api/search-actions.test.ts"
    echo "4. Consulter API_ACTIONS_SEARCH_DOCUMENTATION.md pour les détails"
    exit 0
else
    echo -e "${RED}❌ Certains fichiers manquent!${NC}"
    exit 1
fi
