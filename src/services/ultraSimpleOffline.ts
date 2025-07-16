import { saveToFirestoreRest } from "../utils/firestoreRestApi";

// Função para gerar IDs únicos evitando colisões
let serviceIdCounter = 0;
const generateServiceId = (prefix: string): string => {
  const timestamp = Date.now();
  const counter = ++serviceIdCounter;
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${counter}-${random}`;
};

class UltraSimpleOfflineService {
  async createWork(workData: any): Promise<string> {
    try {
      console.log("🔧 Criando obra...");
      const workId = `work-${Date.now()}`;
      await saveToFirestoreRest("works", workId, {
        ...workData,
        id: workId,
        createdAt: new Date().toISOString(),
      });
      const id = workId;
      console.log("✅ Obra criada:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao criar obra:", error);
      throw error;
    }
  }

  async createPool(poolData: any): Promise<string> {
    try {
      console.log("🏊 Criando piscina...");
      const poolId = `pool-${Date.now()}`;
      await saveToFirestoreRest("pools", poolId, {
        ...poolData,
        id: poolId,
        createdAt: new Date().toISOString(),
      });
      const id = poolId;
      console.log("✅ Piscina criada:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao criar piscina:", error);
      throw error;
    }
  }

  async createMaintenance(maintenanceData: any): Promise<string> {
    try {
      console.log("🔧 Criando manutenção...");
      const maintenanceId = `maintenance-${Date.now()}`;
      await saveToFirestoreRest("maintenance", maintenanceId, {
        ...maintenanceData,
        id: maintenanceId,
        createdAt: new Date().toISOString(),
      });
      const id = maintenanceId;
      console.log("✅ Manutenção criada:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao criar manutenção:", error);
      throw error;
    }
  }

  async createClient(clientData: any): Promise<string> {
    try {
      console.log("👤 Criando cliente...");
      const clientId = `client-${Date.now()}`;
      await saveToFirestoreRest("clients", clientId, {
        ...clientData,
        id: clientId,
        createdAt: new Date().toISOString(),
      });
      const id = clientId;
      console.log("✅ Cliente criado:", id);
      return id;
    } catch (error) {
      console.error("❌ Erro ao criar cliente:", error);
      throw error;
    }
  }
}

export const ultraSimpleOfflineService = new UltraSimpleOfflineService();
export default ultraSimpleOfflineService;
