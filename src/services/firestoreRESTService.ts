// Serviço Firestore via REST API - substitui o SDK problemático
const PROJECT_ID = "leiria-1cfc9";
const API_KEY = "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export class FirestoreRESTService {
  // Criar documento
  async createDocument(
    collection: string,
    docId: string,
    data: any,
  ): Promise<any> {
    try {
      const url = `${BASE_URL}/${collection}/${docId}?key=${API_KEY}`;
      const firestoreData = this.convertToFirestoreFormat(data);

      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: firestoreData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      return this.convertFromFirestoreFormat(result.fields || {});
    } catch (error) {
      console.error("❌ Erro ao criar documento:", error);
      throw error;
    }
  }

  // Ler documento
  async getDocument(collection: string, docId: string): Promise<any> {
    try {
      const url = `${BASE_URL}/${collection}/${docId}?key=${API_KEY}`;

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
      return {
        id: docId,
        ...this.convertFromFirestoreFormat(doc.fields || {}),
      };
    } catch (error) {
      console.error("❌ Erro ao ler documento:", error);
      throw error;
    }
  }

  // Atualizar documento
  async updateDocument(
    collection: string,
    docId: string,
    data: any,
  ): Promise<any> {
    return this.createDocument(collection, docId, data); // PATCH atualiza ou cria
  }

  // Deletar documento
  async deleteDocument(collection: string, docId: string): Promise<void> {
    try {
      const url = `${BASE_URL}/${collection}/${docId}?key=${API_KEY}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    } catch (error) {
      console.error("❌ Erro ao deletar documento:", error);
      throw error;
    }
  }

  // Listar documentos de uma coleção
  async listDocuments(collection: string, limit?: number): Promise<any[]> {
    try {
      let url = `${BASE_URL}/${collection}?key=${API_KEY}`;
      if (limit) {
        url += `&pageSize=${limit}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      const documents = result.documents || [];

      return documents.map((doc: any) => {
        const pathParts = doc.name.split("/");
        const id = pathParts[pathParts.length - 1];
        return {
          id,
          ...this.convertFromFirestoreFormat(doc.fields || {}),
        };
      });
    } catch (error) {
      console.error("❌ Erro ao listar documentos:", error);
      return [];
    }
  }

  // Converter dados para formato Firestore
  private convertToFirestoreFormat(data: any): any {
    const result: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        result[key] = { nullValue: null };
      } else if (typeof value === "string") {
        result[key] = { stringValue: value };
      } else if (typeof value === "number") {
        result[key] = { doubleValue: value };
      } else if (typeof value === "boolean") {
        result[key] = { booleanValue: value };
      } else if (value instanceof Date) {
        result[key] = { timestampValue: value.toISOString() };
      } else if (Array.isArray(value)) {
        result[key] = {
          arrayValue: {
            values: value.map(
              (v) => this.convertToFirestoreFormat({ temp: v }).temp,
            ),
          },
        };
      } else if (typeof value === "object") {
        result[key] = {
          mapValue: { fields: this.convertToFirestoreFormat(value) },
        };
      } else {
        result[key] = { stringValue: String(value) };
      }
    }

    return result;
  }

  // Converter dados do formato Firestore
  private convertFromFirestoreFormat(fields: any): any {
    const result: any = {};

    for (const [key, value] of Object.entries(fields as any)) {
      if (value.nullValue !== undefined) {
        result[key] = null;
      } else if (value.stringValue !== undefined) {
        result[key] = value.stringValue;
      } else if (value.doubleValue !== undefined) {
        result[key] = value.doubleValue;
      } else if (value.integerValue !== undefined) {
        result[key] = parseInt(value.integerValue);
      } else if (value.booleanValue !== undefined) {
        result[key] = value.booleanValue;
      } else if (value.timestampValue !== undefined) {
        result[key] = new Date(value.timestampValue);
      } else if (value.arrayValue !== undefined) {
        result[key] =
          value.arrayValue.values?.map(
            (v: any) => this.convertFromFirestoreFormat({ temp: v }).temp,
          ) || [];
      } else if (value.mapValue !== undefined) {
        result[key] = this.convertFromFirestoreFormat(
          value.mapValue.fields || {},
        );
      }
    }

    return result;
  }

  // Adicionar timestamp automático
  private addTimestamp(data: any): any {
    return {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Métodos específicos para as coleções da aplicação
  async createObra(data: any): Promise<any> {
    const id = this.generateId();
    const obraData = this.addTimestamp(data);
    await this.createDocument("obras", id, obraData);
    return { id, ...obraData };
  }

  async createPiscina(data: any): Promise<any> {
    const id = this.generateId();
    const piscinaData = this.addTimestamp(data);
    await this.createDocument("piscinas", id, piscinaData);
    return { id, ...piscinaData };
  }

  async createManutencao(data: any): Promise<any> {
    const id = this.generateId();
    const manutencaoData = this.addTimestamp(data);
    await this.createDocument("manutencoes", id, manutencaoData);
    return { id, ...manutencaoData };
  }

  async createCliente(data: any): Promise<any> {
    const id = this.generateId();
    const clienteData = this.addTimestamp(data);
    await this.createDocument("clientes", id, clienteData);
    return { id, ...clienteData };
  }

  // Obter todas as obras
  async getObras(): Promise<any[]> {
    return this.listDocuments("obras");
  }

  // Obter todas as piscinas
  async getPiscinas(): Promise<any[]> {
    return this.listDocuments("piscinas");
  }

  // Obter todas as manutenções
  async getManutencoes(): Promise<any[]> {
    return this.listDocuments("manutencoes");
  }

  // Obter todos os clientes
  async getClientes(): Promise<any[]> {
    return this.listDocuments("clientes");
  }

  // Gerar ID único
  private generateId(): string {
    return (
      Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }
}

// Instância singleton
export const firestoreREST = new FirestoreRESTService();

// Função de teste para verificar funcionamento
export async function testFirestoreRESTService(): Promise<boolean> {
  try {
    console.log("🧪 Testando serviço Firestore REST...");

    // Criar documento de teste
    const testData = {
      message: "Serviço REST funcionando",
      timestamp: new Date(),
      test: true,
    };

    const created = await firestoreREST.createDocument(
      "test-service",
      "test-doc",
      testData,
    );
    console.log("✅ Documento criado:", created);

    // Ler documento de teste
    const read = await firestoreREST.getDocument("test-service", "test-doc");
    console.log("✅ Documento lido:", read);

    console.log("🎉 Serviço Firestore REST funcionando perfeitamente!");
    return true;
  } catch (error) {
    console.error("❌ Erro no teste do serviço:", error);
    return false;
  }
}
