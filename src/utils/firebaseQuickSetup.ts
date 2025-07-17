// Quick Firebase Setup Helper
// Provides immediate steps to fix 403 errors

export function showQuickSetupInstructions(): void {
  console.log("\n🚀 SETUP RÁPIDO FIREBASE - RESOLVER 403 AGORA:");
  console.log("================================================");

  console.log("\n📝 PASSO 1 - Criar ficheiro .env:");
  console.log("Na raiz do projeto, criar ficheiro .env com:");
  console.log("");
  console.log("VITE_FIREBASE_PROJECT_ID=leiria-1cfc9");
  console.log("VITE_FIREBASE_API_KEY=AIzaSy_SUA_CHAVE_AQUI");

  console.log("\n🔑 PASSO 2 - Obter API Key:");
  console.log(
    "1. Ir para: https://console.firebase.google.com/project/leiria-1cfc9",
  );
  console.log("2. Clicar em ⚙️ Settings > Project settings");
  console.log('3. Descer até "Your apps"');
  console.log("4. Copiar a API key (começa com AIzaSy...)");

  console.log("\n🔒 PASSO 3 - Regras Firestore (TEMPORÁRIO):");
  console.log(
    "1. Ir para: https://console.firebase.google.com/project/leiria-1cfc9/firestore",
  );
  console.log('2. Clicar em "Rules"');
  console.log("3. Substituir por:");
  console.log("   allow read, write: if true;");
  console.log('4. Clicar "Publish"');

  console.log("\n🔄 PASSO 4 - Reiniciar:");
  console.log("Parar o servidor (Ctrl+C) e executar: npm run dev");

  console.log("\n⚡ ALTERNATIVA RÁPIDA - Testar sem configuração:");
  console.log("Se não conseguir configurar agora, pode testar com dados mock");
  console.log("(sem Firebase real)");

  console.log("\n================================================");
}

// Check if setup is needed
export function isSetupNeeded(): boolean {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  return (
    !apiKey ||
    !projectId ||
    apiKey === "demo-value-set-for-production" ||
    projectId === "demo-value-set-for-production" ||
    apiKey.includes("sua_chave") ||
    apiKey.includes("your_")
  );
}

// Auto-show setup instructions in development
if (import.meta.env.DEV && isSetupNeeded()) {
  showQuickSetupInstructions();
}

export default {
  showQuickSetupInstructions,
  isSetupNeeded,
};
