import { saveToFirestore } from "../utils/ultraSimpleFirestore";

class UltraSimpleOfflineService {
  async createWork(workData: any): Promise<string> {
    try {
      console.log("🔧 Criando obra...");
      const workId = `work-${Date.now()}`;
      await saveToFirestore("works", workId, {
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
      await saveToFirestore("pools", poolId, {
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
      await saveToFirestore("maintenance", maintenanceId, {
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
      await saveToFirestore("clients", clientId, {
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
