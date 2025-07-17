// FIRESTORE VIA REST API - BYPASS SDK ISSUES
// Using REST API as confirmed working by user

import { getRestApiConfig } from "./firebaseConfigHelper";
import { queuedRestApiCall } from "./requestQueue";
import {
  validateFirebaseProject,
  validateFirestoreAccess,
} from "./firebaseProjectValidator";
import { diagnose403Error } from "./firebase403Diagnostic";

const config = getRestApiConfig();
const PROJECT_ID = config.projectId;
const API_KEY = config.apiKey;

// Base URL da REST API do Firestore
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Função para converter dados para formato Firestore
const convertToFirestoreFormat = (data: any): any => {
  const converted: any = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (typeof value === "string") {
      converted[key] = { stringValue: value };
    } else if (typeof value === "number") {
      converted[key] = { doubleValue: value };
    } else if (typeof value === "boolean") {
      converted[key] = { booleanValue: value };
    } else if (value instanceof Date) {
      converted[key] = { timestampValue: value.toISOString() };
    } else if (typeof value === "object" && value !== null) {
      converted[key] = { stringValue: JSON.stringify(value) };
    } else {
      converted[key] = { stringValue: String(value) };
    }
  });

  return { fields: converted };
};

// Função para converter dados do formato Firestore
const convertFromFirestoreFormat = (firestoreData: any): any => {
  if (!firestoreData.fields) return {};

  const converted: any = {};

  Object.keys(firestoreData.fields).forEach((key) => {
    const field = firestoreData.fields[key];

    if (field.stringValue !== undefined) {
      // Tentar fazer parse se parecer JSON
      try {
        if (
          field.stringValue.startsWith("{") ||
          field.stringValue.startsWith("[")
        ) {
          converted[key] = JSON.parse(field.stringValue);
        } else {
          converted[key] = field.stringValue;
        }
      } catch {
        converted[key] = field.stringValue;
      }
    } else if (field.doubleValue !== undefined) {
      converted[key] = field.doubleValue;
    } else if (field.booleanValue !== undefined) {
      converted[key] = field.booleanValue;
    } else if (field.timestampValue !== undefined) {
      converted[key] = field.timestampValue;
    } else {
      converted[key] = field.stringValue || "";
    }
  });

  return converted;
};

// Função para guardar dados via REST API
export const saveToFirestoreRest = async (
  collection: string,
  documentId: string,
  data: any,
): Promise<boolean> => {
  try {
    console.log(`🌐 REST API: Guardando ${collection}/${documentId}...`);

    const firestoreData = convertToFirestoreFormat({
      ...data,
      id: documentId,
      updatedAt: new Date().toISOString(),
    });

    const url = `${FIRESTORE_BASE_URL}/${collection}/${documentId}?key=${API_KEY}`;

    let response: Response;
    try {
      console.log(`🚀 Salvando: ${url.replace(API_KEY, "[API_KEY]")}`);

      response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(firestoreData),
        signal: AbortSignal.timeout(15000), // 15 second timeout for writes
      });

      console.log(
        `📝 Save response status: ${response.status} para ${collection}/${documentId}`,
      );
    } catch (fetchError: any) {
      console.error(
        `❌ REST API: Erro ao fazer requisição para ${collection}/${documentId}:`,
        fetchError,
      );

      if (fetchError.name === "AbortError") {
        console.error("⏰ Timeout: Escrita demorou mais de 15 segundos");
      } else if (fetchError.message === "Load failed") {
        console.error("🌐 Erro de rede ao salvar - verificar conectividade");
      }

      return false;
    }

    if (response.ok) {
      console.log(
        `✅ REST API: ${collection}/${documentId} guardado com sucesso`,
      );
      return true;
    } else {
      // Clone response to avoid "Body is disturbed or locked" error
      const responseClone = response.clone();
      try {
        const errorText = await responseClone.text();
        console.error(`❌ REST API: Erro ${response.status}:`, errorText);
      } catch (readError) {
        console.error(
          `❌ REST API: Erro ${response.status} (não foi possível ler detalhes)`,
        );
      }
      return false;
    }
  } catch (error: any) {
    console.error(
      `❌ REST API: Erro ao guardar ${collection}/${documentId}:`,
      error?.message,
    );
    return false;
  }
};

// Função para ler dados via REST API
export const readFromFirestoreRest = async (
  collection: string,
): Promise<any[]> => {
  // Validate Firebase configuration first
  if (!PROJECT_ID || PROJECT_ID === "demo-value-set-for-production") {
    console.warn(
      `⚠️ REST API: Firebase PROJECT_ID não configurado. Definir variáveis VITE_FIREBASE_*`,
    );
    console.warn("🛠️ SOLUÇÃO RÁPIDA:");
    console.warn("1. Criar ficheiro .env na raiz do projeto");
    console.warn("2. Adicionar: VITE_FIREBASE_PROJECT_ID=leiria-1cfc9");
    console.warn("3. Adicionar: VITE_FIREBASE_API_KEY=sua_chave_real");
    console.warn("4. Reiniciar: npm run dev");
    return [];
  }

  if (!API_KEY || API_KEY === "demo-value-set-for-production") {
    console.warn(
      `⚠️ REST API: Firebase API_KEY não configurado. Definir variáveis VITE_FIREBASE_*`,
    );
    console.warn("🛠️ SOLUÇÃO RÁPIDA:");
    console.warn("1. Obter API key do Firebase Console");
    console.warn("2. Adicionar ao .env: VITE_FIREBASE_API_KEY=AIzaSy...");
    console.warn("3. Reiniciar servidor");
    return [];
  }

  // Validate project exists (only for first call per session)
  if (!window.firebaseValidated) {
    try {
      const validation = await validateFirebaseProject(PROJECT_ID, API_KEY);
      if (!validation.valid) {
        console.error(
          `❌ Firebase Project Validation Failed: ${validation.error}`,
        );
        if (validation.details) {
          console.error("🔍 Details:", validation.details);
        }
        // Don't return empty array, continue with request to get specific error
      } else {
        console.log("✅ Firebase project validated successfully");
        window.firebaseValidated = true;
      }
    } catch (validationError) {
      console.warn("⚠️ Could not validate Firebase project:", validationError);
      // Continue with request anyway
    }
  }

  // Add small delay to prevent race conditions in concurrent calls
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

  try {
    console.log(`🌐 REST API: Lendo ${collection}...`);

    // Debug configuration
    if (!PROJECT_ID || PROJECT_ID === "demo-value-set-for-production") {
      console.warn(
        "⚠️ REST API: PROJECT_ID não configurado corretamente:",
        PROJECT_ID,
      );
    }
    if (!API_KEY || API_KEY === "demo-value-set-for-production") {
      console.warn("⚠️ REST API: API_KEY não configurado corretamente");
    }

    const url = `${FIRESTORE_BASE_URL}/${collection}?key=${API_KEY}`;
    console.log(`🔗 REST API URL: ${url.replace(API_KEY, "[API_KEY_HIDDEN]")}`);

    let response: Response;
    try {
      console.log(
        `🚀 Fazendo requisição para: ${url.replace(API_KEY, "[API_KEY]")}`,
      );

      response = await fetch(url, {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log(`📝 Response status: ${response.status} para ${collection}`);
    } catch (fetchError: any) {
      console.error(
        `❌ REST API: Erro na requisição para ${collection}:`,
        fetchError,
      );

      // Provide specific error messages based on error type
      if (fetchError.name === "AbortError") {
        console.error("⏰ Timeout: Requisição demorou mais de 10 segundos");
      } else if (fetchError.message === "Load failed") {
        console.error("🌐 Erro de rede: Verificar conectividade ou CORS");
        console.error("🔍 Verificar se o projeto Firebase existe e está ativo");
        console.error("🔑 Verificar se a API key é válida");
      } else if (fetchError.message.includes("CORS")) {
        console.error("🚫 CORS: Problema de política de origem cruzada");
      } else {
        console.error("❌ Erro desconhecido:", fetchError.message);
      }

      return [];
    }

    // Validate response object
    if (!response || typeof response.text !== "function") {
      console.error(
        `❌ REST API: Resposta inválida para ${collection}:`,
        response,
      );
      return [];
    }

    // Handle 403 errors specifically with detailed guidance
    if (response.status === 403) {
      console.error(
        `❌ REST API: Acesso negado (403) para ${collection}:`,
        "Verificar API key e regras de segurança do Firestore",
      );

      // Provide specific guidance for 403 errors
      console.error("🔑 SOLUÇÃO PARA 403:");
      console.error("1. 🔄 Definir variáveis de ambiente reais:");
      console.error("   VITE_FIREBASE_API_KEY=sua_chave_real_aqui");
      console.error("   VITE_FIREBASE_PROJECT_ID=leiria-1cfc9");
      console.error("2. 🔒 Atualizar regras Firestore (Firebase Console):");
      console.error("   allow read, write: if true; // Para desenvolvimento");
      console.error("3. 🚪 Habilitar Firestore Database no projeto");
      console.error(
        "🔗 Firebase Console: https://console.firebase.google.com/",
      );

      // Check if using placeholder values
      if (PROJECT_ID === "demo-value-set-for-production") {
        console.error(
          "⚠️ PROBLEMA: Usando valores placeholder em vez de configuração real!",
        );
        console.error(
          "🛠️ SOLUÇÃO: Definir VITE_FIREBASE_PROJECT_ID com o ID real do projeto",
        );
      }

      if (API_KEY === "demo-value-set-for-production") {
        console.error(
          "⚠️ PROBLEMA: Usando API key placeholder em vez da chave real!",
        );
        console.error(
          "🛠️ SOLUÇÃO: Definir VITE_FIREBASE_API_KEY com a chave real",
        );
      }

      // Run full diagnostic on first 403 error
      if (!window.firebase403DiagnosticRun) {
        window.firebase403DiagnosticRun = true;
        setTimeout(() => diagnose403Error(), 100); // Slight delay for cleaner output
      }

      return [];
    }

    // Read response body only once with enhanced error handling
    let responseText: string;
    try {
      // Try to read the response text with timeout
      const textPromise = response.text();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout reading response")), 5000),
      );

      responseText = await Promise.race([textPromise, timeoutPromise]);
    } catch (readError) {
      // Provide more specific error information
      const errorDetails = {
        status: response?.status,
        statusText: response?.statusText,
        url: response?.url,
        ok: response?.ok,
        type: response?.type,
        redirected: response?.redirected,
      };

      console.error(
        `❌ REST API: Erro ao ler resposta para ${collection}:`,
        readError,
        "Response details:",
        errorDetails,
      );

      // For 403 errors, provide helpful message
      if (response?.status === 403) {
        console.error(
          "🔒 Acesso negado - verificar configuração Firebase e regras de segurança",
        );
      }

      return [];
    }

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);

        if (data.documents) {
          const converted = data.documents.map((doc: any) => {
            const id = doc.name.split("/").pop();
            const docData = convertFromFirestoreFormat(doc);
            return { id, ...docData };
          });

          console.log(
            `✅ REST API: ${collection} lido (${converted.length} documentos)`,
          );
          return converted;
        } else {
          console.log(`📄 REST API: ${collection} vazio`);
          return [];
        }
      } catch (jsonError) {
        console.error(
          `❌ REST API: Erro ao processar JSON para ${collection}:`,
          jsonError,
        );
        console.error(`❌ Response text:`, responseText.substring(0, 200));
        return [];
      }
    } else {
      console.error(
        `❌ REST API: Erro ${response.status} ao ler ${collection}:`,
        responseText,
      );
      return [];
    }
  } catch (error: any) {
    console.error(`❌ REST API: Erro ao ler ${collection}:`, error?.message);
    return [];
  }
};

// Função para eliminar dados via REST API
export const deleteFromFirestoreRest = async (
  collection: string,
  documentId: string,
): Promise<boolean> => {
  try {
    console.log(`🌐 REST API: Eliminando ${collection}/${documentId}...`);

    const url = `${FIRESTORE_BASE_URL}/${collection}/${documentId}?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log(
        `✅ REST API: ${collection}/${documentId} eliminado com sucesso`,
      );
      return true;
    } else {
      // Clone response to avoid "Body is disturbed or locked" error
      const responseClone = response.clone();
      try {
        const errorText = await responseClone.text();
        console.error(`❌ REST API: Erro ${response.status}:`, errorText);
      } catch (readError) {
        console.error(
          `❌ REST API: Erro ${response.status} (não foi possível ler detalhes)`,
        );
      }
      return false;
    }
  } catch (error: any) {
    console.error(
      `❌ REST API: Erro ao eliminar ${collection}/${documentId}:`,
      error?.message,
    );
    return false;
  }
};

// Teste automático da REST API
const testRestApi = async () => {
  console.log("🧪 REST API: Iniciando teste automático...");

  try {
    // Teste de escrita
    const testData = {
      message: "REST API funcionando!",
      timestamp: new Date().toISOString(),
      test: true,
    };

    const saved = await saveToFirestoreRest("test", "rest-api-test", testData);

    if (saved) {
      console.log("✅ REST API: Teste de escrita PASSOU");

      // Teste de leitura
      const data = await readFromFirestoreRest("test");

      if (data.length > 0) {
        console.log("✅ REST API: Teste de leitura PASSOU");
        console.log(
          "🎉 REST API: TODOS OS TESTES PASSARAM - FIRESTORE 100% FUNCIONAL VIA REST!",
        );

        return true;
      } else {
        console.warn("⚠️ REST API: Teste de leitura falhou - sem dados");
        return false;
      }
    } else {
      console.error("❌ REST API: Teste de escrita falhou");
      return false;
    }
  } catch (error: any) {
    console.error("❌ REST API: Teste falhou:", error?.message);
    return false;
  }
};

// Auto-executar teste IMEDIATAMENTE no desenvolvimento
setTimeout(async () => {
  console.log(
    "🚀 REST API: Auto-teste iniciando (desenvolvimento = produção)...",
  );
  const success = await testRestApi();

  if (success) {
    console.log("🎉 REST API: AUTO-TESTE SUCESSO - FIRESTORE FUNCIONAL!");
    console.log("🔥 REST API: DESENVOLVIMENTO AGORA IGUAL À PRODUÇÃO!");

    // Disponibilizar globalmente
    (window as any).firestoreRestApi = {
      save: saveToFirestoreRest,
      read: readFromFirestoreRest,
      delete: deleteFromFirestoreRest,
      test: testRestApi,
    };
  } else {
    console.error("❌ REST API: AUTO-TESTE FALHOU");
  }
}, 500); // Reduzir tempo para 500ms

export default {
  save: saveToFirestoreRest,
  read: readFromFirestoreRest,
  delete: deleteFromFirestoreRest,
  test: testRestApi,
};
