// Serviço offline-first - funciona sem Firebase
// ATUALIZADO: Agora usa ForceFirestore como principal

import { forceFirestoreService } from "./forceFirestoreService";

class OfflineFirstService {
  private useFirebase = false;
  private firebaseAvailable = false;

  constructor() {
    // Firebase é opcional - aplicação funciona sem ele
    this.checkFirebaseAvailability();
  }

  private async checkFirebaseAvailability() {
    try {
      // Usar configuração Leiria
      const { getFirebaseFirestore, isFirestoreReady } = await import(
        "../firebase/leiriaConfig"
      );

      // Verificar se Firestore está disponível
      const db = getFirebaseFirestore();
      if (db && isFirestoreReady()) {
        this.firebaseAvailable = true;
        console.log("✅ Firebase Leiria disponível");
      } else {
        this.firebaseAvailable = false;
        console.log("📱 Firebase Leiria não disponível - modo offline ativo");
      }
    } catch (error) {
      this.firebaseAvailable = false;
      console.log("📱 Firebase não disponível - modo offline ativo");
    }
  }

  // Método principal para criar obra - AGORA USA FIRESTORE
  async createWork(workData: any): Promise<string> {
    const id = Date.now().toString();
    const work = {
      ...workData,
      id,
      createdAt: new Date().toISOString(),
      source: "firestore",
    };

    try {
      console.log("🔥 OfflineFirst: Guardando obra no Firestore...");

      // 1. PRINCIPAL: Guardar no Firestore
      const firestoreId = await forceFirestoreService.saveWork(work);
      console.log("✅ Obra guardada no Firestore:", firestoreId);

      // 2. BACKUP: localStorage apenas como cache temporário
      const existingWorks = JSON.parse(localStorage.getItem("works") || "[]");
      existingWorks.push(work);
      localStorage.setItem("works", JSON.stringify(existingWorks));
      console.log("💾 Cache local atualizado");

      // 2. Tentar Firebase se disponível (opcional)
      if (this.firebaseAvailable) {
        this.tryFirebaseSave("obras", work);
      }

      return id;
    } catch (error) {
      console.error("❌ Erro ao criar obra:", error);
      // Mesmo com erro, retornar ID pois pode ter salvado no localStorage
      return id;
    }
  }

  async createPool(poolData: any): Promise<string> {
    const id = Date.now().toString();
    const pool = {
      ...poolData,
      id,
      createdAt: new Date().toISOString(),
      source: "firestore",
    };

    try {
      console.log("🔥 OfflineFirst: Guardando piscina no Firestore...");

      // 1. PRINCIPAL: Guardar no Firestore
      const firestoreId = await forceFirestoreService.savePool(pool);
      console.log("✅ Piscina guardada no Firestore:", firestoreId);

      // 2. BACKUP: localStorage apenas como cache temporário
      const existingPools = JSON.parse(localStorage.getItem("pools") || "[]");
      existingPools.push(pool);
      localStorage.setItem("pools", JSON.stringify(existingPools));
      console.log("💾 Cache local atualizado");

      return firestoreId;
    } catch (error) {
      console.error("❌ Erro ao criar piscina:", error);
      // Fallback para localStorage se Firestore falhar
      const existingPools = JSON.parse(localStorage.getItem("pools") || "[]");
      existingPools.push({ ...pool, source: "localStorage-fallback" });
      localStorage.setItem("pools", JSON.stringify(existingPools));
      return id;
    }
  }

  async createMaintenance(maintenanceData: any): Promise<string> {
    const id = Date.now().toString();
    const maintenance = {
      ...maintenanceData,
      id,
      createdAt: new Date().toISOString(),
      source: "firestore",
    };

    try {
      console.log("🔥 OfflineFirst: Guardando manutenção no Firestore...");

      // 1. PRINCIPAL: Guardar no Firestore
      const firestoreId =
        await forceFirestoreService.saveMaintenanceItem(maintenance);
      console.log("✅ Manutenção guardada no Firestore:", firestoreId);

      // 2. BACKUP: localStorage apenas como cache temporário
      const existing = JSON.parse(localStorage.getItem("maintenance") || "[]");
      existing.push(maintenance);
      localStorage.setItem("maintenance", JSON.stringify(existing));
      console.log("💾 Cache local atualizado");

      return firestoreId;
    } catch (error) {
      console.error("❌ Erro ao criar manutenção:", error);
      // Fallback para localStorage se Firestore falhar
      const existing = JSON.parse(localStorage.getItem("maintenance") || "[]");
      existing.push({ ...maintenance, source: "localStorage-fallback" });
      localStorage.setItem("maintenance", JSON.stringify(existing));
      return id;
    }
  }

  async createClient(clientData: any): Promise<string> {
    const id = Date.now().toString();
    const client = {
      ...clientData,
      id,
      createdAt: new Date().toISOString(),
      source: "localStorage",
    };

    try {
      const existing = JSON.parse(localStorage.getItem("clients") || "[]");
      existing.push(client);
      localStorage.setItem("clients", JSON.stringify(existing));
      console.log("✅ Cliente salvo no localStorage:", id);

      if (this.firebaseAvailable) {
        this.tryFirebaseSave("clientes", client);
      }

      return id;
    } catch (error) {
      console.error("❌ Erro ao criar cliente:", error);
      return id;
    }
  }

  // Método para tentar salvar no Firebase (não crítico)
  private async tryFirebaseSave(collection: string, data: any) {
    try {
      const { getFirebaseFirestore } = await import("../firebase/leiriaConfig");
      const { collection: fbCollection, addDoc } = await import(
        "firebase/firestore"
      );

      const db = getFirebaseFirestore();
      if (db) {
        await addDoc(fbCollection(db, collection), data);
        console.log(`✅ ${collection} salvo no Firebase Leiria`);
      } else {
        console.log(`📱 Firebase Leiria não disponível para ${collection}`);
      }
    } catch (error) {
      console.warn(`⚠️ Firebase sync falhou para ${collection}:`, error);
      // Não é crítico - dados já estão no localStorage
    }
  }

  // Status da aplicação
  getStatus() {
    return {
      offline: true, // Sempre funciona offline
      firebase: this.firebaseAvailable,
      storage: "localStorage",
      message: this.firebaseAvailable
        ? "Aplicação online com backup Firebase"
        : "Aplicação offline - dados em localStorage",
    };
  }
}

export const offlineFirstService = new OfflineFirstService();
export default offlineFirstService;
