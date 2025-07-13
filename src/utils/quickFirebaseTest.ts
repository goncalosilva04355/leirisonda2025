// Teste rápido do Firebase
import { diagnoseFirabaseIssues } from "./firebaseDiagnostic";

// Executar diagnóstico automaticamente
export async function runQuickFirebaseTest() {
  console.log("🚀 Iniciando teste rápido do Firebase...");

  const result = await diagnoseFirabaseIssues();

  if (result.success) {
    console.log("🎉 Firebase está funcionando corretamente!");
  } else {
    console.error("❌ Problema detectado no Firebase:", result.error);

    // Mostrar instruções de correção
    console.log("🔧 Para corrigir:");
    console.log("1. Verifique as variáveis de ambiente VITE_FIREBASE_*");
    console.log("2. Verifique as regras de segurança do Firestore");
    console.log("3. Verifique se o projeto Firebase existe e está ativo");
  }

  return result;
}

// Auto-executar após 2 segundos
setTimeout(() => {
  runQuickFirebaseTest();
}, 2000);
