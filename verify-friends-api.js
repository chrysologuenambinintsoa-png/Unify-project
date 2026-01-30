#!/usr/bin/env node

/**
 * Script de vérification des APIs d'amis
 * Utilisation: node verify-friends-api.js
 * ou: npx ts-node verify-friends-api.ts
 */

const baseUrl = process.env.API_URL || 'http://localhost:3000';

/**
 * @typedef {Object} BadgeResponse
 * @property {number} pendingRequests
 * @property {number} suggestions
 * @property {number} friends
 * @property {number} total
 */

/**
 * @typedef {Object} RequestsResponse
 * @property {Array} requests
 * @property {number} total
 * @property {number} limit
 * @property {number} offset
 */

/**
 * @typedef {Object} SuggestionsResponse
 * @property {Array} suggestions
 * @property {number} total
 * @property {number} limit
 * @property {number} offset
 */

/**
 * @typedef {Object} ListResponse
 * @property {Array} friends
 * @property {number} total
 * @property {number} limit
 * @property {number} offset
 */

/**
 * @param {string} name
 * @param {string} url
 * @returns {Promise<boolean>}
 */
async function testAPI(name, url) {
  try {
    console.log(`\n📡 Test: ${name}`);
    console.log(`   URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      console.log('   ❌ ERREUR: Non authentifié (401)');
      console.log('   💡 Conseil: Assurez-vous que vous êtes connecté');
      return false;
    }

    if (!response.ok) {
      console.log(`   ❌ ERREUR: Status ${response.status}`);
      const error = await response.json();
      console.log(`   Message: ${error.error}`);
      return false;
    }

    const data = await response.json();
    console.log(`   ✅ Succès (${response.status})`);
    console.log(`   Données reçues:`, JSON.stringify(data, null, 2));

    return true;
  } catch (error) {
    console.log(`   ❌ ERREUR: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    console.log(
      '   💡 Conseil: Vérifiez que le serveur est en cours d\'exécution sur',
      baseUrl
    );
    return false;
  }
}

async function validateResponseStructure(
  name,
  data,
  expectedKeys
) {
  console.log(`\n🔍 Validation: ${name}`);

  let valid = true;
  for (const key of expectedKeys) {
    if (key in data) {
      console.log(`   ✅ Clé présente: ${key}`);
    } else {
      console.log(`   ❌ Clé manquante: ${key}`);
      valid = false;
    }
  }

  return valid;
}

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Vérification des APIs Amis - Unify                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nURL de base: ${baseUrl}`);
  console.log('Date:', new Date().toISOString());

  const results = {};

  // Test 1: Badges
  console.log('\n' + '═'.repeat(60));
  console.log('1. API Badges (/api/friends/badges)');
  console.log('─'.repeat(60));

  const badgesUrl = `${baseUrl}/api/friends/badges`;
  results['badges'] = await testAPI('Récupérer les compteurs', badgesUrl);

  // Test 2: Requests
  console.log('\n' + '═'.repeat(60));
  console.log('2. API Demandes (/api/friends/requests)');
  console.log('─'.repeat(60));

  const requestsUrl = `${baseUrl}/api/friends/requests?limit=5&offset=0`;
  results['requests'] = await testAPI('Récupérer les demandes', requestsUrl);

  // Test 3: Suggestions
  console.log('\n' + '═'.repeat(60));
  console.log('3. API Suggestions (/api/friends/suggestions)');
  console.log('─'.repeat(60));

  const suggestionsUrl = `${baseUrl}/api/friends/suggestions?limit=5&offset=0`;
  results['suggestions'] = await testAPI('Récupérer les suggestions', suggestionsUrl);

  // Test 4: List
  console.log('\n' + '═'.repeat(60));
  console.log('4. API Liste d\'amis (/api/friends/list)');
  console.log('─'.repeat(60));

  const listUrl = `${baseUrl}/api/friends/list?limit=5&offset=0`;
  results['list'] = await testAPI('Récupérer la liste d\'amis', listUrl);

  // Test 5: Generic endpoint
  console.log('\n' + '═'.repeat(60));
  console.log('5. API Générique (/api/friends)');
  console.log('─'.repeat(60));

  const genericUrl = `${baseUrl}/api/friends?type=accepted&limit=5`;
  results['generic'] = await testAPI('Récupérer les amis acceptés', genericUrl);

  // Résumé
  console.log('\n' + '═'.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('─'.repeat(60));

  let passedCount = 0;
  let failedCount = 0;

  for (const [name, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASSÉ' : '❌ ÉCHOUÉ';
    console.log(`${status}: ${name}`);

    if (passed) passedCount++;
    else failedCount++;
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`Résultat: ${passedCount} passé, ${failedCount} échoué`);

  if (failedCount === 0) {
    console.log('🎉 Tous les tests sont passés!');
  } else {
    console.log('\n💡 Conseils de dépannage:');
    console.log('   1. Vérifiez que le serveur NextJS est en cours d\'exécution');
    console.log('   2. Vérifiez que vous êtes connecté (authentification NextAuth)');
    console.log('   3. Vérifiez les logs du serveur pour les détails d\'erreur');
    console.log('   4. Vérifiez que la base de données est accessible');
    console.log('   5. Exécutez: npm run dev');
  }

  console.log('\n' + '═'.repeat(60));
  console.log('Documentation complète: FRIENDS_API_DOCUMENTATION.md');
  console.log('Guide rapide: FRIENDS_API_QUICK_START.md');
  console.log('═'.repeat(60) + '\n');

  // Retourner le code de sortie approprié
  process.exit(failedCount === 0 ? 0 : 1);
}

// Exécuter les tests
runTests().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
