// PRODUÇÃO: Fix crítico para app branca - desabilitar Firebase bloqueante
console.log("🔥 PRODUÇÃO: Aplicando fix para Firebase bloqueante");

// Limpar flags de quota que podem estar bloqueando
const clearFirebaseFlags = () => {
  try {
    localStorage.removeItem("firebase-quota-exceeded");
    localStorage.removeItem("firebase-quota-check-time");
    localStorage.removeItem("firebase-emergency-shutdown");
    localStorage.removeItem("firebase-quota-warning");
    localStorage.removeItem("firebase-cooldown-active");
    console.log("✅ Flags de quota Firebase limpas");
  } catch (error) {
    console.warn("⚠️ Erro ao limpar flags:", error);
  }
};

// Executar limpeza imediatamente
clearFirebaseFlags();

// Forçar Firebase como não-bloqueante
window.__FIREBASE_NON_BLOCKING__ = true;

// Evitar que erros Firebase quebrem a app
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    (event.reason.toString().includes("firebase") ||
      event.reason.toString().includes("firestore") ||
      event.reason.toString().includes("quota") ||
      event.reason.toString().includes("PERMISSION_DENIED"))
  ) {
    console.warn(
      "⚠️ Firebase error handled in production:",
      event.reason.message,
    );
    event.preventDefault();
    return;
  }
});

export { clearFirebaseFlags };
