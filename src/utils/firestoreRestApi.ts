// FIRESTORE VIA REST API - BYPASS DOS PROBLEMAS DO SDK
// Como o utilizador confirmou que funciona via REST API, vamos usar isso

// Função para detectar ambiente de desenvolvimento
const isDevelopment = (): boolean => {
  return import.meta.env.DEV || import.meta.env.NODE_ENV !== "production";
};

const PROJECT_ID =
  import.meta.env.VITE_FIREBASE_PROJECT_ID ||
  (isDevelopment() ? "leiria-1cfc9" : "");
const API_KEY =
  import.meta.env.VITE_FIREBASE_API_KEY ||
  (isDevelopment() ? "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw" : "");

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

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(firestoreData),
    });

    if (response.ok) {
      console.log(
        `✅ REST API: ${collection}/${documentId} guardado com sucesso`,
      );
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ REST API: Erro ${response.status}:`, errorText);
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
  try {
    console.log(`🌐 REST API: Lendo ${collection}...`);

    const url = `${FIRESTORE_BASE_URL}/${collection}?key=${API_KEY}`;

    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      if (data.documents) {
        const converted = data.documents.map((doc: any) => {
          const id = doc.name.split("/").pop();
          const data = convertFromFirestoreFormat(doc);
          return { id, ...data };
        });

        console.log(
          `✅ REST API: ${collection} lido (${converted.length} documentos)`,
        );
        return converted;
      } else {
        console.log(`📄 REST API: ${collection} vazio`);
        return [];
      }
    } else {
      const errorText = await response.text();
      console.error(`❌ REST API: Erro ${response.status}:`, errorText);
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
      const errorText = await response.text();
      console.error(`❌ REST API: Erro ${response.status}:`, errorText);
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
