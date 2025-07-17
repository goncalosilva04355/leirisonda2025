// Script para limpar flags de quota do Firebase
// Execute este script no console do navegador ou salve como arquivo .js

console.log("🧹 Iniciando limpeza de quota Firebase...");

// Lista de todas as flags que podem bloquear o Firebase
const flagsToRemove = [
  "firebase-quota-exceeded",
  "firebase-quota-check-time",
  "firebase-emergency-shutdown",
  "firebase-emergency-time",
  "firebase-circuit-breaker",
  "firebase-quota-cooldown",
  "firebase-usage-history",
];

// Verificar flags atuais
console.group("📋 Flags encontradas:");
let foundFlags = 0;
flagsToRemove.forEach((flag) => {
  const value = localStorage.getItem(flag);
  if (value) {
    console.log(`🚨 ${flag}: ${value}`);
    foundFlags++;
  }
});

if (foundFlags === 0) {
  console.log("✅ Nenhuma flag de quota encontrada");
} else {
  console.log(`⚠️ ${foundFlags} flags encontradas`);
}
console.groupEnd();

// Limpar todas as flags
console.group("🧹 Limpando flags:");
flagsToRemove.forEach((flag) => {
  const hadValue = localStorage.getItem(flag) !== null;
  localStorage.removeItem(flag);
  if (hadValue) {
    console.log(`✅ Removida: ${flag}`);
  }
});
console.groupEnd();

// Verificar ambiente
console.group("🌍 Ambiente:");
console.log(
  "Netlify:",
  typeof window !== "undefined" &&
    (window.location.hostname.includes("netlify") ||
      window.location.hostname.includes("app")),
);
console.log("Desenvolvimento:", window.location.hostname === "localhost");
console.log("URL:", window.location.href);
console.groupEnd();

// Mostrar status final
console.log("✅ Limpeza concluída!");
console.log("🔄 Para aplicar mudanças, refresh a página");

// Auto-refresh se estiver numa página do app
if (window.location.pathname === "/" || window.location.hash) {
  console.log("🔄 Auto-refresh em 2 segundos...");
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Adicionar função global para uso futuro
if (typeof window !== "undefined") {
  window.clearFirebaseQuota = () => {
    flagsToRemove.forEach((flag) => localStorage.removeItem(flag));
    console.log("✅ Firebase quota flags cleared");
    window.location.reload();
  };

  window.checkFirebaseQuota = () => {
    console.group("🔍 Firebase Quota Status");
    flagsToRemove.forEach((flag) => {
      const value = localStorage.getItem(flag);
      console.log(`${flag}: ${value || "not set"}`);
    });
    console.groupEnd();
  };

  console.log("💡 Funções disponíveis:");
  console.log("  - clearFirebaseQuota() - limpar todas as flags");
  console.log("  - checkFirebaseQuota() - verificar status atual");
}
