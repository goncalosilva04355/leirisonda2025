import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseConfig } from "../config/firebaseEnv";

// Estado global
let firestoreInstance: Firestore | null = null;
let isFirestoreEnabled = false;
let hasCheckedAvailability = false;

export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  console.log("🔥 Verificando disponibilidade do Firestore...");

  // Se já verificamos e Firestore não está disponível, retornar null imediatamente
  if (hasCheckedAvailability && !isFirestoreEnabled) {
    console.log("�� Firestore não disponível - usando localStorage");
    return null;
  }

  // Se já temos instância, retornar
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    // 1. Obter ou criar Firebase App
    let app;
    const existingApps = getApps();

    if (existingApps.length > 0) {
      app = getApp();
    } else {
      const config = getFirebaseConfig();
      app = initializeApp(config, `app-${Date.now()}`);
    }

    console.log(`✅ Firebase App: ${app.options.projectId}`);

    // 2. Verificar se Firestore está disponível antes de tentar inicializar
    const isAvailable = await checkFirestoreAvailability(app);

    if (!isAvailable) {
      hasCheckedAvailability = true;
      isFirestoreEnabled = false;
      console.log(
        "💾 Firestore não habilitado - aplicação funcionará com localStorage",
      );
      return null;
    }

    // 3. Se disponível, inicializar
    console.log("🔥 Firestore disponível, inicializando...");
    firestoreInstance = getFirestore(app);
    isFirestoreEnabled = true;
    hasCheckedAvailability = true;

    console.log("✅ Firestore inicializado com sucesso!");
    return firestoreInstance;
  } catch (error: any) {
    hasCheckedAvailability = true;
    isFirestoreEnabled = false;

    console.warn("⚠️ Erro ao verificar Firestore:", error.message);
    console.log("💾 Aplicação continuará funcionando com localStorage");

    return null;
  }
}

async function checkFirestoreAvailability(app: any): Promise<boolean> {
  try {
    console.log("🔍 Verificando se Firestore está habilitado...");

    // Tentar criar uma referência simples para verificar se o serviço existe
    // Usar uma abordagem menos invasiva
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${app.options.projectId}/databases/(default)`,
      {
        method: "HEAD",
        headers: {
          Authorization: `Bearer ${app.options.apiKey}`,
        },
      },
    );

    // Se a resposta não for 404, o Firestore provavelmente está habilitado
    if (response.status !== 404) {
      console.log("✅ Firestore está habilitado no projeto");
      return true;
    } else {
      console.log("🚫 Firestore não está habilitado no projeto");
      return false;
    }
  } catch (error: any) {
    console.log(
      "🔍 Verificação por API falhou, tentando inicialização direta...",
    );

    try {
      // Fallback: tentar inicializar diretamente e capturar erro específico
      getFirestore(app);
      console.log("✅ Firestore está disponível");
      return true;
    } catch (firestoreError: any) {
      if (
        firestoreError.message.includes("Service firestore is not available") ||
        firestoreError.message.includes("firestore/unavailable")
      ) {
        console.log("🚫 Confirmado: Firestore não está habilitado");
        return false;
      }
      // Outros erros podem indicar que está habilitado mas há outros problemas
      console.log(
        "⚠️ Firestore pode estar habilitado mas há problemas de configuração",
      );
      return false;
    }
  }
}

export function isFirestoreReady(): boolean {
  return isFirestoreEnabled && firestoreInstance !== null;
}

export function getFirebaseFirestore(): Firestore | null {
  return firestoreInstance;
}

export function getFirestoreStatus() {
  return {
    enabled: isFirestoreEnabled,
    checked: hasCheckedAvailability,
    instance: !!firestoreInstance,
  };
}

// Função para mostrar instruções de como habilitar Firestore
export function showFirestoreEnableInstructions() {
  const projectId = "leiria-1cfc9";

  console.log("");
  console.log("🔥 ═══════════════════════════════════════════════════════");
  console.log("📋 COMO HABILITAR FIRESTORE NO SEU PROJETO FIREBASE:");
  console.log("🔥 ═══════════════════════════════════════════════════════");
  console.log("");
  console.log("1. Acesse o Firebase Console:");
  console.log(`   🔗 https://console.firebase.google.com/project/${projectId}`);
  console.log("");
  console.log("2. No menu lateral, clique em 'Firestore Database'");
  console.log("");
  console.log("3. Clique em 'Criar banco de dados'");
  console.log("");
  console.log("4. Escolha 'Modo de produção' ou 'Modo de teste'");
  console.log("   (Recomendado: Modo de teste para desenvolvimento)");
  console.log("");
  console.log("5. Escolha a localização do banco");
  console.log("   (Recomendado: europe-west3 para Europa)");
  console.log("");
  console.log("6. Clique em 'Concluído'");
  console.log("");
  console.log("7. Após criado, recarregue esta aplicação");
  console.log("");
  console.log("🔥 ═══════════════════════════════════════════════════════");
  console.log(
    "💡 ENQUANTO ISSO, SEUS DADOS ESTÃO SENDO SALVOS NO LOCALSTORAGE",
  );
  console.log("��� ═══════════════════════════════════════════════════════");
  console.log("");
}

// Mostrar instruções automaticamente se Firestore não estiver habilitado
export async function checkAndShowInstructions() {
  const db = await getFirebaseFirestoreAsync();

  if (!db && hasCheckedAvailability && !isFirestoreEnabled) {
    showFirestoreEnableInstructions();
  }

  return db;
}
