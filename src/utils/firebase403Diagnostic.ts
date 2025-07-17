// Firebase 403 Error Diagnostic Tool
// Quick diagnosis and solutions for 403 "Access Denied" errors

import { getRestApiConfig } from "./firebaseConfigHelper";

export function diagnose403Error(): void {
  console.log("\n🔍 DIAGNÓSTICO DE ERRO 403 FIREBASE:");
  console.log("=====================================");

  try {
    const config = getRestApiConfig();

    // Check PROJECT_ID
    console.log("\n📁 PROJECT_ID:");
    if (!config.projectId) {
      console.error("❌ PROJECT_ID está vazio");
    } else if (config.projectId === "demo-value-set-for-production") {
      console.error("❌ PROJECT_ID está usando valor placeholder");
      console.error(
        "🔧 SOLUÇÃO: Definir VITE_FIREBASE_PROJECT_ID=leiria-1cfc9",
      );
    } else {
      console.log(`✅ PROJECT_ID configurado: ${config.projectId}`);
    }

    // Check API_KEY
    console.log("\n🔑 API_KEY:");
    if (!config.apiKey) {
      console.error("❌ API_KEY está vazio");
    } else if (config.apiKey === "demo-value-set-for-production") {
      console.error("❌ API_KEY está usando valor placeholder");
      console.error("🔧 SOLUÇÃO: Definir VITE_FIREBASE_API_KEY=sua_chave_real");
    } else if (config.apiKey.startsWith("AIza")) {
      console.log("✅ API_KEY parece válida (começa com AIza)");
    } else {
      console.warn(
        "⚠️ API_KEY não parece ter formato válido (deve começar com AIza)",
      );
    }

    // Environment check
    console.log("\n🌍 AMBIENTE:");
    const isDev = import.meta.env.DEV;
    const isNetlify = import.meta.env.NETLIFY === "true";

    console.log(`Environment: ${isDev ? "Desenvolvimento" : "Produção"}`);
    console.log(`Netlify Build: ${isNetlify ? "Sim" : "Não"}`);

    // Solutions
    console.log("\n🛠️ SOLUÇÕES PARA 403:");
    console.log("1. 📝 Criar ficheiro .env na raiz do projeto:");
    console.log("   VITE_FIREBASE_API_KEY=AIzaSy...sua_chave_real");
    console.log("   VITE_FIREBASE_PROJECT_ID=leiria-1cfc9");
    console.log("");
    console.log(
      "2. 🔒 Atualizar regras Firestore (temporário para desenvolvimento):",
    );
    console.log("   Ir para Firebase Console > Firestore > Rules");
    console.log("   Alterar para: allow read, write: if true;");
    console.log("");
    console.log("3. 🔗 Links úteis:");
    console.log("   Firebase Console: https://console.firebase.google.com/");
    console.log(
      "   Projeto leiria-1cfc9: https://console.firebase.google.com/project/leiria-1cfc9",
    );
  } catch (error) {
    console.error("❌ Erro ao obter configuração Firebase:", error);
    console.error(
      "🔧 SOLUÇÃO: Verificar se as variáveis VITE_FIREBASE_* estão definidas",
    );
  }

  console.log("\n=====================================");
}

// Auto-run diagnostic on import in development
if (import.meta.env.DEV) {
  diagnose403Error();
}

export default diagnose403Error;
