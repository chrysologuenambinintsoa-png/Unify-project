#!/bin/bash

# Quick verification of badges error fix

echo "🔍 Vérification rapide de la correction Badges..."
echo ""

# 1. Check files exist
echo "✓ Fichiers modifiés:"
ls -la app/api/badges/route.ts hooks/useBadges.ts 2>/dev/null && echo "  OK" || echo "  ERREUR"

# 2. Check files created
echo "✓ Fichiers créés:"
ls -la app/api/test/badges/route.ts app/badges-debug/page.tsx 2>/dev/null && echo "  OK" || echo "  ERREUR"

# 3. Check TypeScript
echo "✓ Vérification TypeScript:"
npx tsc --noEmit > /dev/null 2>&1 && echo "  OK" || echo "  ERREUR"

echo ""
echo "✨ Tout est prêt! Redémarrez le serveur:"
echo "   npm run dev"
echo ""
echo "Puis testez:"
echo "   http://localhost:3000/badges-debug"
