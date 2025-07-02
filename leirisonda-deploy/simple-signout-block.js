// SIMPLE SIGNOUT BLOCK - Apenas bloqueia signOut, nada mais

console.log("🛡️ SIMPLE BLOCK: Bloqueando apenas signOut...");

// Função simples para bloquear signOut automático
function blockSignOutOnly() {
  if (window.firebase) {
    try {
      const auth = window.firebase.auth();

      // Guardar método original
      if (!window.originalSignOut) {
        window.originalSignOut = auth.signOut.bind(auth);
      }

      // Substituir signOut
      auth.signOut = function () {
        console.warn("🛡️ SIGNOUT BLOQUEADO - Operação cancelada");
        return Promise.resolve();
      };

      console.log("✅ signOut bloqueado com sucesso");
    } catch (e) {
      console.log("Firebase não disponível ainda");
    }
  }
}

// Tentar bloquear imediatamente
blockSignOutOnly();

// Tentar novamente a cada 500ms até conseguir
const blocker = setInterval(() => {
  if (window.firebase) {
    blockSignOutOnly();
    clearInterval(blocker);
  }
}, 500);

// Parar tentativas após 10 segundos
setTimeout(() => {
  clearInterval(blocker);
}, 10000);

console.log("✅ SIMPLE BLOCK: Sistema ativo");
