// Use Firestore REST API directly - bypasses SDK issues
import { getRestApiConfig } from "./firebaseConfigHelper";

const config = getRestApiConfig();
const PROJECT_ID = config.projectId;
const API_KEY = config.apiKey;

export async function testFirestoreAPI(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    console.log("🚀 Testando Firestore via REST API direta...");

    // URL da REST API do Firestore
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

    // 1. Tentar escrever um documento
    const writeUrl = `${baseUrl}/test-api/direct-test?key=${API_KEY}`;

    const writeData = {
      fields: {
        message: { stringValue: "Teste via REST API funcionou!" },
        timestamp: { timestampValue: new Date().toISOString() },
        method: { stringValue: "REST API direta" },
        project: { stringValue: PROJECT_ID },
        success: { booleanValue: true },
      },
    };

    console.log("📝 Escrevendo via REST API...");
    const writeResponse = await fetch(writeUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(writeData),
    });

    if (!writeResponse.ok) {
      // Clone response to avoid "Body is disturbed or locked" error
      const responseClone = writeResponse.clone();
      let errorData = "Não foi possível ler detalhes do erro";

      try {
        errorData = await responseClone.text();
      } catch (readError) {
        console.warn("⚠️ Não foi possível ler corpo da resposta de erro");
      }

      console.error("❌ Erro na escrita:", writeResponse.status, errorData);

      if (writeResponse.status === 404) {
        return {
          success: false,
          message:
            "Firestore não encontrado - verifique se está habilitado no projeto",
        };
      }

      return {
        success: false,
        message: `Erro HTTP ${writeResponse.status}: ${errorData}`,
      };
    }

    let writeResult;
    try {
      writeResult = await writeResponse.json();
    } catch (jsonError) {
      console.error(
        "❌ Erro ao processar resposta JSON da escrita:",
        jsonError,
      );
      return {
        success: false,
        message: "Erro ao processar resposta da escrita",
      };
    }
    console.log("✅ Escrita bem-sucedida:", writeResult);

    // 2. Tentar ler o documento
    console.log("📖 Lendo via REST API...");
    const readUrl = `${baseUrl}/test-api/direct-test?key=${API_KEY}`;

    const readResponse = await fetch(readUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!readResponse.ok) {
      return {
        success: false,
        message: `Documento foi escrito mas não pode ser lido: HTTP ${readResponse.status}`,
      };
    }

    let readResult;
    try {
      readResult = await readResponse.json();
    } catch (jsonError) {
      console.error(
        "❌ Erro ao processar resposta JSON da leitura:",
        jsonError,
      );
      return {
        success: false,
        message:
          "Documento foi escrito mas erro ao processar resposta da leitura",
      };
    }
    console.log("✅ Leitura bem-sucedida:", readResult);

    // Sucesso total!
    return {
      success: true,
      message: "🎉 FIRESTORE FUNCIONANDO PERFEITAMENTE via REST API!",
      data: {
        method: "REST API direta",
        project: PROJECT_ID,
        writeSuccess: true,
        readSuccess: true,
        documentWritten: writeResult,
        documentRead: readResult,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    console.error("❌ Erro no teste REST API:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Problema de conectividade - verifique internet",
      };
    }

    return {
      success: false,
      message: `Erro inesperado: ${error.message}`,
      data: { error: error.message },
    };
  }
}

// Função para usar Firestore via REST API para operações reais
export class FirestoreRESTService {
  private baseUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

  async createDocument(
    collection: string,
    docId: string,
    data: any,
  ): Promise<any> {
    try {
      const url = `${this.baseUrl}/${collection}/${docId}?key=${API_KEY}`;

      // Converter dados para formato Firestore
      const firestoreData = this.convertToFirestoreFormat(data);

      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: firestoreData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Erro ao criar documento:", error);
      throw error;
    }
  }

  async getDocument(collection: string, docId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/${collection}/${docId}?key=${API_KEY}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Documento não existe
        }
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const doc = await response.json();
      return this.convertFromFirestoreFormat(doc.fields || {});
    } catch (error) {
      console.error("❌ Erro ao ler documento:", error);
      throw error;
    }
  }

  private convertToFirestoreFormat(data: any): any {
    const result: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        result[key] = { stringValue: value };
      } else if (typeof value === "number") {
        result[key] = { doubleValue: value };
      } else if (typeof value === "boolean") {
        result[key] = { booleanValue: value };
      } else if (value instanceof Date) {
        result[key] = { timestampValue: value.toISOString() };
      } else {
        result[key] = { stringValue: JSON.stringify(value) };
      }
    }

    return result;
  }

  private convertFromFirestoreFormat(fields: any): any {
    const result: any = {};

    for (const [key, value] of Object.entries(fields as any)) {
      if (value.stringValue !== undefined) {
        result[key] = value.stringValue;
      } else if (value.doubleValue !== undefined) {
        result[key] = value.doubleValue;
      } else if (value.booleanValue !== undefined) {
        result[key] = value.booleanValue;
      } else if (value.timestampValue !== undefined) {
        result[key] = new Date(value.timestampValue);
      }
    }

    return result;
  }
}

export const firestoreREST = new FirestoreRESTService();
