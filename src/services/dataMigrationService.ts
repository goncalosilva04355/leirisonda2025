// Sistema de migração de dados localStorage → Firestore
import { firestoreService } from "./firestoreService";

interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: string[];
  details: string[];
}

class DataMigrationService {
  // Verificar dados no localStorage
  checkLocalStorageData(): { [key: string]: any[] } {
    const data: { [key: string]: any[] } = {};

    try {
      // Verificar piscinas
      const pools = localStorage.getItem("pools");
      data.pools = pools ? JSON.parse(pools) : [];

      // Verificar obras
      const works = localStorage.getItem("works");
      data.works = works ? JSON.parse(works) : [];

      // Verificar manutenções
      const maintenance = localStorage.getItem("maintenance");
      data.maintenance = maintenance ? JSON.parse(maintenance) : [];

      // Verificar clientes
      const clients = localStorage.getItem("clients");
      data.clients = clients ? JSON.parse(clients) : [];

      console.log("📊 Dados encontrados no localStorage:", {
        pools: data.pools.length,
        works: data.works.length,
        maintenance: data.maintenance.length,
        clients: data.clients.length,
      });
    } catch (error) {
      console.error("❌ Erro ao verificar localStorage:", error);
    }

    return data;
  }

  // Migrar dados do localStorage para Firestore
  async migrateToFirestore(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migrated: 0,
      errors: [],
      details: [],
    };

    try {
      // Verificar se Firestore está disponível
      const isAvailable = await firestoreService.testConnection();
      if (!isAvailable) {
        result.errors.push("Firestore não está disponível");
        return result;
      }

      const localData = this.checkLocalStorageData();
      let totalMigrated = 0;

      // Migrar piscinas
      for (const pool of localData.pools) {
        try {
          const docId = await firestoreService.saveFormData("pools", pool);
          if (docId) {
            totalMigrated++;
            result.details.push(`✅ Piscina migrada: ${pool.name}`);
          }
        } catch (error) {
          result.errors.push(
            `❌ Erro ao migrar piscina ${pool.name}: ${error}`,
          );
        }
      }

      // Migrar obras
      for (const work of localData.works) {
        try {
          const docId = await firestoreService.addDocument("works", work);
          if (docId) {
            totalMigrated++;
            result.details.push(`✅ Obra migrada: ${work.title}`);
          }
        } catch (error) {
          result.errors.push(`❌ Erro ao migrar obra ${work.title}: ${error}`);
        }
      }

      // Migrar manutenções
      for (const maint of localData.maintenance) {
        try {
          const docId = await firestoreService.addDocument(
            "maintenance",
            maint,
          );
          if (docId) {
            totalMigrated++;
            result.details.push(`✅ Manutenção migrada: ${maint.type}`);
          }
        } catch (error) {
          result.errors.push(
            `❌ Erro ao migrar manutenção ${maint.type}: ${error}`,
          );
        }
      }

      // Migrar clientes
      for (const client of localData.clients) {
        try {
          const docId = await firestoreService.addDocument("clients", client);
          if (docId) {
            totalMigrated++;
            result.details.push(`✅ Cliente migrado: ${client.name}`);
          }
        } catch (error) {
          result.errors.push(
            `❌ Erro ao migrar cliente ${client.name}: ${error}`,
          );
        }
      }

      result.migrated = totalMigrated;
      result.success =
        totalMigrated > 0 ||
        localData.pools.length +
          localData.works.length +
          localData.maintenance.length +
          localData.clients.length ===
          0;

      console.log("🎉 Migração concluída:", result);
    } catch (error) {
      result.errors.push(`❌ Erro geral na migração: ${error}`);
    }

    return result;
  }

  // Testar dados no Firestore
  async testFirestoreData(): Promise<{ [key: string]: any[] }> {
    const data: { [key: string]: any[] } = {};

    try {
      if (!firestoreService.isFirestoreAvailable()) {
        console.log("⚠️ Firestore não disponível para teste");
        return data;
      }

      // Testar leitura de cada coleção
      data.pools = await firestoreService.getDocuments("pools");
      data.works = await firestoreService.getDocuments("works");
      data.maintenance = await firestoreService.getDocuments("maintenance");
      data.clients = await firestoreService.getDocuments("clients");

      console.log("🧪 Teste de dados Firestore:", {
        pools: data.pools.length,
        works: data.works.length,
        maintenance: data.maintenance.length,
        clients: data.clients.length,
      });
    } catch (error) {
      console.error("❌ Erro ao testar dados Firestore:", error);
    }

    return data;
  }

  // Criar dados de teste se não existirem
  async createTestData(): Promise<void> {
    if (!firestoreService.isFirestoreAvailable()) {
      console.log("⚠️ Firestore não disponível para criar dados de teste");
      return;
    }

    try {
      console.log("🧪 Criando dados de teste...");

      // Cliente teste
      await firestoreService.addDocument("clients", {
        name: "Cliente Teste",
        email: "teste@cliente.com",
        phone: "123456789",
        address: "Rua Teste, 123",
        nif: "123456789",
      });

      // Piscina teste
      await firestoreService.addDocument("pools", {
        name: "Piscina Teste",
        location: "Localização Teste",
        client: "Cliente Teste",
        type: "Exterior",
        status: "Ativa",
        dimensions: "10x5m",
      });

      // Obra teste
      await firestoreService.addDocument("works", {
        title: "Obra Teste",
        description: "Descrição da obra teste",
        client: "Cliente Teste",
        location: "Localização Teste",
        status: "Em progresso",
        startDate: new Date().toISOString(),
        estimatedEndDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

      // Manutenção teste
      await firestoreService.addDocument("maintenance", {
        type: "Limpeza",
        poolName: "Piscina Teste",
        client: "Cliente Teste",
        scheduledDate: new Date().toISOString(),
        status: "Agendada",
        description: "Manutenção de teste",
      });

      console.log("✅ Dados de teste criados com sucesso");
    } catch (error) {
      console.error("❌ Erro ao criar dados de teste:", error);
    }
  }

  // Executar migração completa e teste
  async runFullMigrationAndTest(): Promise<void> {
    console.log("🚀 Iniciando migração completa e teste...");

    // 1. Verificar dados locais
    const localData = this.checkLocalStorageData();
    const hasLocalData = Object.values(localData).some((arr) => arr.length > 0);

    // 2. Migrar dados se existirem
    if (hasLocalData) {
      const migrationResult = await this.migrateToFirestore();
      console.log("📊 Resultado da migração:", migrationResult);
    } else {
      console.log("📭 Nenhum dado local encontrado para migrar");
      // 3. Criar dados de teste se não há dados para migrar
      await this.createTestData();
    }

    // 4. Testar dados no Firestore
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Aguardar propagação
    const firestoreData = await this.testFirestoreData();

    // 5. Resumo final
    console.log("🎯 Migração e teste concluídos!");
    console.log("📈 Status final:", {
      firestoreDisponivel: firestoreService.isFirestoreAvailable(),
      dadosFirestore: Object.keys(firestoreData).reduce((acc, key) => {
        acc[key] = firestoreData[key].length;
        return acc;
      }, {} as any),
    });
  }
}

export const dataMigrationService = new DataMigrationService();
export default dataMigrationService;
