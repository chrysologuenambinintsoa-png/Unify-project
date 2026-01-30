/**
 * Diagnostic Script for Friend Add Issue
 * Teste l'ajout d'ami depuis la recherche
 */

// Test 1: Vérifie que la session est disponible
console.log('🔍 Test 1: Vérification de la session NextAuth');

// Test 2: Vérifie la requête API
console.log('🔍 Test 2: Vérification de la requête API');

async function testAddFriend() {
  try {
    const response = await fetch('/api/friends/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'test-user-id' }),
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);

    if (!response.ok) {
      console.error('❌ Erreur:', data.error);
      return false;
    }

    console.log('✅ Succès:', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
    return false;
  }
}

// Test 3: Vérife que le utilisateur est authentifié
console.log('🔍 Test 3: Vérification de l\'authentification');

async function testAuth() {
  try {
    const response = await fetch('/api/auth/session');
    const session = await response.json();
    
    if (session?.user?.id) {
      console.log('✅ Session active:', session.user.id);
      return true;
    } else {
      console.error('❌ Pas de session active');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur vérification session:', error);
    return false;
  }
}

// Test 4: Vérifie que l'utilisateur cible existe
console.log('🔍 Test 4: Vérification de l\'utilisateur cible');

async function testUserExists(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (response.ok) {
      const user = await response.json();
      console.log('✅ Utilisateur trouvé:', user.username);
      return true;
    } else {
      console.error('❌ Utilisateur non trouvé');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
}

// Lancez les tests
async function runDiagnostics() {
  console.log('\n=== DIAGNOSTIQUE AJOUT D\'AMI ===\n');
  
  const authOk = await testAuth();
  if (!authOk) {
    console.error('\n❌ Vous devez être connecté!');
    return;
  }

  console.log('\nTest ajout d\'ami...');
  // Vous devez remplacer 'target-user-id' par un vrai ID d'utilisateur
  // testAddFriend();
}

// Export for browser console
if (typeof window !== 'undefined') {
  (window as any).testAddFriend = testAddFriend;
  (window as any).testAuth = testAuth;
  (window as any).runDiagnostics = runDiagnostics;
  console.log('📝 Fonctions disponibles dans la console:');
  console.log('- testAuth()');
  console.log('- testAddFriend()');
  console.log('- runDiagnostics()');
}
