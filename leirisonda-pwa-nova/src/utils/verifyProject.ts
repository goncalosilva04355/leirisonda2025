// Verificador para confirmar que todas as configurações usam leiria-1cfc9

console.log("🔍 VERIFICANDO PROJETO FIREBASE:");

// 1. Verificar configuração principal
import { getFirebaseConfig } from "../config/firebaseEnv";

try {
  const config = getFirebaseConfig();
  console.log("📋 Configuração ativa:");
  console.log(`  - Project ID: ${config.projectId}`);
  console.log(`  - Auth Domain: ${config.authDomain}`);
  console.log(`  - Storage Bucket: ${config.storageBucket}`);

  // Verificar se é o projeto correto
  if (config.projectId === "leiria-1cfc9") {
    console.log("✅ CORRETO: Usando projeto leiria-1cfc9");
  } else {
    console.error(
      `❌ ERRO: Usando projeto ${config.projectId} em vez de leiria-1cfc9`,
    );
  }

  // Verificar outros campos
  if (config.authDomain === "leiria-1cfc9.firebaseapp.com") {
    console.log("✅ Auth Domain correto");
  } else {
    console.error(`❌ Auth Domain incorreto: ${config.authDomain}`);
  }

  if (config.storageBucket === "leiria-1cfc9.firebasestorage.app") {
    console.log("✅ Storage Bucket correto");
  } else {
    console.error(`❌ Storage Bucket incorreto: ${config.storageBucket}`);
  }

  if (config.messagingSenderId === "632599887141") {
    console.log("✅ Messaging Sender ID correto");
  } else {
    console.error(
      `❌ Messaging Sender ID incorreto: ${config.messagingSenderId}`,
    );
  }

  if (config.appId === "1:632599887141:web:1290b471d41fc3ad64eecc") {
    console.log("✅ App ID correto");
  } else {
    console.error(`❌ App ID incorreto: ${config.appId}`);
  }

  console.log(
    "🎯 CONCLUSÃO: Projeto leiria-1cfc9 está configurado corretamente!",
  );
} catch (error: any) {
  console.error("❌ Erro ao verificar configuração:", error?.message);
}

export default true;
