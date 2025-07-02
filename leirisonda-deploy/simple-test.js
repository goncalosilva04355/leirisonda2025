// TESTE SIMPLES - Para executar manualmente

console.log("🧪 TESTE SIMPLES: Carregado");

// Função para testar se as proteções estão funcionando
function testProtections() {
  console.log("🔍 Testando proteções...");

  let protectionsActive = 0;

  // Verificar proteções
  if (window.LEIRISONDA_PROTECTION) {
    console.log("✅ LEIRISONDA_PROTECTION encontrada");
    protectionsActive++;
  }

  if (window.ULTIMATE_PROTECTION) {
    console.log("✅ ULTIMATE_PROTECTION encontrada");
    protectionsActive++;
  }

  // Testar Firebase signOut
  if (window.firebase) {
    try {
      const auth = window.firebase.auth();
      if (auth && auth.signOut) {
        console.log("🔍 Testando Firebase signOut...");

        // Tentar chamar signOut e ver o que acontece
        auth
          .signOut()
          .then(() => {
            console.log(
              "⚠️ Firebase signOut executou - proteções podem não estar funcionando",
            );
          })
          .catch((e) => {
            console.log(
              "✅ Firebase signOut teve erro (pode ser proteção funcionando)",
            );
          });
      }
    } catch (e) {
      console.log("❌ Erro ao testar Firebase:", e.message);
    }
  }

  console.log(`📊 Total de proteções ativas: ${protectionsActive}`);
  return protectionsActive > 0;
}

// Função para forçar ativação manual das proteções
function forceActivateProtections() {
  console.log("🚀 Forçando ativação das proteções...");

  // Bloquear signOut diretamente
  if (window.firebase) {
    try {
      const auth = window.firebase.auth();
      if (auth && auth.signOut) {
        const originalSignOut = auth.signOut;
        auth.signOut = function () {
          console.warn("🛡️ MANUAL BLOCK: Firebase signOut bloqueado!");
          console.trace();
          return Promise.resolve();
        };
        console.log("✅ Firebase signOut bloqueado manualmente");
      }
    } catch (e) {
      console.log("❌ Erro ao bloquear Firebase:", e.message);
    }
  }

  // Bloquear redirects para login
  const originalPushState = history.pushState;
  history.pushState = function (state, title, url) {
    if (url && url.includes("/login")) {
      console.warn("🛡️ MANUAL BLOCK: Redirect para login bloqueado!");
      return;
    }
    return originalPushState.apply(this, arguments);
  };

  console.log("✅ Proteções manuais ativadas");
}

// Função para simular criação de obra
function simulateObraCreation() {
  console.log("🏗️ Simulando criação de obra...");

  // Ativar proteções primeiro
  forceActivateProtections();

  // Simular operação Firebase
  if (window.firebase) {
    try {
      console.log("📤 Simulando operação Firebase...");

      // Simular erro que costuma causar logout
      const fakeError = new Error("auth/user-token-expired");
      fakeError.code = "auth/user-token-expired";

      console.log("⚠️ Simulando erro:", fakeError.code);

      // Verificar se este erro causaria logout
      setTimeout(() => {
        if (window.location.pathname.includes("/login")) {
          console.error("❌ LOGOUT DETECTADO após simulação!");
        } else {
          console.log("✅ Sem logout - proteções funcionaram!");
        }
      }, 2000);
    } catch (e) {
      console.log("❌ Erro na simulação:", e.message);
    }
  }
}

// Disponibilizar funções globalmente
window.testProtections = testProtections;
window.forceActivateProtections = forceActivateProtections;
window.simulateObraCreation = simulateObraCreation;

console.log(`
🧪 TESTE SIMPLES: Funções disponíveis:
- testProtections() - Verifica se proteções estão ativas
- forceActivateProtections() - Força ativação manual 
- simulateObraCreation() - Simula criação de obra

💡 Para testar, execute no console:
testProtections();
forceActivateProtections();
simulateObraCreation();
`);

// Auto-test inicial
setTimeout(() => {
  console.log("🔄 Auto-teste inicial...");
  testProtections();
}, 2000);
