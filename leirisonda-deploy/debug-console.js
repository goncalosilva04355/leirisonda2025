// SCRIPT DE DEBUG - Cole no console do browser

console.log("🔍 DEBUG: Iniciando análise...");

// 1. Verificar se Firebase está carregado
if (window.firebase) {
  console.log("✅ Firebase carregado:", typeof window.firebase);

  if (window.firebase.auth) {
    const auth = window.firebase.auth();
    console.log("✅ Firebase Auth:", typeof auth);

    // Verificar se o signOut foi interceptado
    if (auth.signOut) {
      console.log(
        "🔍 signOut function:",
        auth.signOut.toString().substring(0, 200),
      );
    }

    // Verificar utilizador atual
    console.log("👤 Current user:", auth.currentUser);

    // Interceptar signOut para debug
    const originalSignOut = auth.signOut.bind(auth);
    auth.signOut = function () {
      console.error("🚨 SIGNOUT CHAMADO! Stack trace:");
      console.trace();
      return Promise.resolve();
    };

    console.log("✅ signOut interceptado para debug");
  }
} else {
  console.warn("❌ Firebase não encontrado");
}

// 2. Verificar se as proteções estão ativas
if (window.LEIRISONDA_PROTECTION) {
  console.log(
    "✅ Proteção Leirisonda ativa:",
    window.LEIRISONDA_PROTECTION.active,
  );
} else {
  console.warn("❌ Proteção Leirisonda não encontrada");
}

if (window.ULTIMATE_PROTECTION) {
  console.log(
    "✅ Proteção Ultimate ativa:",
    window.ULTIMATE_PROTECTION.enabled,
  );
} else {
  console.warn("❌ Proteção Ultimate não encontrada");
}

// 3. Interceptar erros
window.addEventListener("error", (event) => {
  if (event.error && event.error.code) {
    console.error("🚨 ERRO DETECTADO:", event.error.code, event.error.message);
    console.trace();
  }
});

// 4. Interceptar console.error
const originalConsoleError = console.error;
console.error = function (...args) {
  if (
    args.some(
      (arg) =>
        typeof arg === "string" &&
        (arg.includes("auth/") || arg.includes("token")),
    )
  ) {
    console.warn("🚨 ERRO DE AUTH DETECTADO:", ...args);
    console.trace();
  }
  return originalConsoleError.apply(this, args);
};

console.log("🔍 DEBUG: Configuração completa. Tente criar uma obra agora.");
