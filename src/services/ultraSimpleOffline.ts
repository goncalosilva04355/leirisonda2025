import { saveData } from "../utils/ultraSimpleFirestore";

class UltraSimpleOfflineService {
  async createWork(workData: any): Promise<string> {
    try {
      console.log("🔧 Criando obra...");
      const id = await saveData("works", {
        ...workData,
        createdAt: new Date().toISOString(),
      });
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
      const id = await saveData("pools", {
        ...poolData,
        createdAt: new Date().toISOString(),
      });
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
      const id = await saveData("maintenance", {
        ...maintenanceData,
        createdAt: new Date().toISOString(),
      });
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
      const id = await saveData("clients", {
        ...clientData,
        createdAt: new Date().toISOString(),
      });
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
