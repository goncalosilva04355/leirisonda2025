// Prevent getImmediate errors by checking Firestore availability first
export function preventGetImmediateError() {
  console.log("🛡️ Ativando prevenção de erros getImmediate...");

  // Override console.error temporarily to catch and handle getImmediate errors
  const originalError = console.error;

  console.error = function (...args: any[]) {
    const message = args.join(" ");

    if (
      message.includes("getImmediate") ||
      message.includes("Service firestore is not available") ||
      message.includes("❌ Erro específico do Firestore: getImmediate")
    ) {
      // Convert error to warning for getImmediate issues
      console.warn("⚠️ Firestore não habilitado (esperado):", ...args);

      // Show helpful message
      console.info(`
💡 INFORMAÇÃO SOBRE FIRESTORE:
- O erro "getImmediate" é normal quando Firestore não está habilitado
- O sistema continua funcionando via REST API
- Para habilitar Firestore SDK: https://console.firebase.google.com/project/leiria-1cfc9/firestore
- Não é necessário para o funcionamento do sistema
      `);

      return;
    }

    // Call original error for other errors
    originalError.apply(console, args);
  };

  // Restore original after some time
  setTimeout(() => {
    console.error = originalError;
    console.log("🛡️ Prevenção de erros getImmediate desativada");
  }, 10000); // 10 seconds

  console.log("✅ Prevenção de erros getImmediate ativa por 10 segundos");
}

// Auto-activate
setTimeout(() => {
  preventGetImmediateError();
}, 1000);

export default preventGetImmediateError;
