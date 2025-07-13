// Serviço Firestore para desenvolvimento - sem regras de autenticação
import {
  getFirebaseFirestore,
  initializeFirebaseRobust,
} from "../firebase/robustFirebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

export class DevFirestoreService {
  private db: any = null;

  constructor() {
    this.initializeFirestore();
  }

  private initializeFirestore() {
    console.log("🔧 DevFirestoreService: Inicializando Firebase...");

    // Forçar inicialização
    initializeFirebaseRobust();

    // Tentar obter Firestore
    this.db = getFirebaseFirestore();

    if (this.db) {
      console.log("✅ DevFirestoreService: Firestore pronto");
    } else {
      console.warn("⚠️ DevFirestoreService: Firestore não disponível");
    }
  }

  async createWork(workData: any): Promise<string | null> {
    // Verificação robusta
    if (!this.db) {
      console.log("🔄 Tentando re-inicializar Firestore...");
      this.initializeFirestore();

      if (!this.db) {
        console.error("❌ Firestore não está disponível");
        return null;
      }
    }

    try {
      console.log("📝 Tentando criar obra no Firestore (modo dev)...");

      // Tentar com coleção "obras"
      const docRef = await addDoc(collection(this.db, "obras"), {
        ...workData,
        createdAt: new Date().toISOString(),
        devMode: true,
      });

      console.log("✅ Obra criada no Firestore:", docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error("❌ Erro ao criar obra:", error);

      // Tentar com coleção alternativa
      try {
        console.log("🔄 Tentando coleção alternativa...");
        const altDocRef = await addDoc(collection(this.db, "test_obras"), {
          ...workData,
          createdAt: new Date().toISOString(),
          devMode: true,
        });

        console.log("✅ Obra criada em coleção alternativa:", altDocRef.id);
        return altDocRef.id;
      } catch (altError: any) {
        console.error("❌ Erro também na coleção alternativa:", altError);
        return null;
      }
    }
  }

  async createPool(poolData: any): Promise<string | null> {
    if (!this.db) {
      this.initializeFirestore();
      if (!this.db) return null;
    }

    try {
      const docRef = await addDoc(collection(this.db, "piscinas"), {
        ...poolData,
        createdAt: new Date().toISOString(),
        devMode: true,
      });

      console.log("✅ Piscina criada no Firestore:", docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error("❌ Erro ao criar piscina:", error);
      return null;
    }
  }

  async createMaintenance(maintenanceData: any): Promise<string | null> {
    if (!this.db) {
      this.initializeFirestore();
      if (!this.db) return null;
    }

    try {
      const docRef = await addDoc(collection(this.db, "manutencoes"), {
        ...maintenanceData,
        createdAt: new Date().toISOString(),
        devMode: true,
      });

      console.log("✅ Manutenção criada no Firestore:", docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error("❌ Erro ao criar manutenção:", error);
      return null;
    }
  }

  async createClient(clientData: any): Promise<string | null> {
    if (!this.db) return null;

    try {
      const docRef = await addDoc(collection(this.db, "clientes"), {
        ...clientData,
        createdAt: new Date().toISOString(),
        devMode: true,
      });

      console.log("✅ Cliente criado no Firestore:", docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error("❌ Erro ao criar cliente:", error);
      return null;
    }
  }
}

export const devFirestoreService = new DevFirestoreService();
