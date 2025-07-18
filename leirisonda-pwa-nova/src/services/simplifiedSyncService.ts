// Serviço simplificado de sincronização de dados
import { getFirebaseFirestore } from "../firebase/leiriaConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

class SimplifiedSyncService {
  private isActive = false;

  // Verificar se Firebase está disponível
  private isFirebaseAvailable(): boolean {
    const db = getFirebaseFirestore();
    return db !== null;
  }

  // Inicializar serviço
  async initialize(): Promise<boolean> {
    if (!this.isFirebaseAvailable()) {
      console.log("📱 Firebase não disponível - modo offline ativo");
      return false;
    }

    try {
      this.isActive = true;
      console.log("✅ Serviço de sincronização inicializado");

      // Fazer sincronização inicial
      await this.syncAllFromLocal();

      return true;
    } catch (error) {
      console.error("❌ Erro ao inicializar sincronização:", error);
      return false;
    }
  }

  // Sincronizar todos os dados do localStorage para Firebase
  async syncAllFromLocal(): Promise<void> {
    if (!this.isActive || !this.isFirebaseAvailable()) {
      console.log("⏸️ Sincronização não disponível");
      return;
    }

    console.log("🔄 Iniciando sincronização de dados locais para Firebase...");

    try {
      await Promise.all([
        this.syncCollectionFromLocal("works", "obras"),
        this.syncCollectionFromLocal("pools", "piscinas"),
        this.syncCollectionFromLocal("maintenance", "manutencoes"),
        this.syncCollectionFromLocal("clients", "clientes"),
        this.syncCollectionFromLocal("app-users", "utilizadores"),
      ]);

      console.log("✅ Sincronização completa concluída");

      // Disparar evento para notificar outros componentes
      window.dispatchEvent(
        new CustomEvent("syncCompleted", {
          detail: { timestamp: new Date() },
        }),
      );
    } catch (error) {
      console.error("❌ Erro na sincronização:", error);
    }
  }

  // Sincronizar uma coleção específica do localStorage para Firebase
  private async syncCollectionFromLocal(
    localKey: string,
    firebaseCollection: string,
  ): Promise<void> {
    try {
      const localData = localStorage.getItem(localKey);
      if (!localData) {
        console.log(`📭 Sem dados locais para ${localKey}`);
        return;
      }

      const data = JSON.parse(localData);
      if (!Array.isArray(data) || data.length === 0) {
        console.log(`📭 Sem itens em ${localKey}`);
        return;
      }

      const db = getFirebaseFirestore();
      if (!db) return;

      console.log(`🔄 Sincronizando ${data.length} itens de ${localKey}...`);

      // Sincronizar cada item
      for (const item of data) {
        try {
          const itemData = {
            ...item,
            syncedAt: serverTimestamp(),
            lastModified: serverTimestamp(),
          };

          if (item.id) {
            // Usar ID existente
            await setDoc(
              doc(db, firebaseCollection, String(item.id)),
              itemData,
            );
          } else {
            // Criar novo documento
            const docRef = await addDoc(
              collection(db, firebaseCollection),
              itemData,
            );

            // Atualizar ID local com o ID do Firebase
            item.id = docRef.id;
          }
        } catch (itemError) {
          console.warn(
            `⚠️ Erro ao sincronizar item de ${localKey}:`,
            itemError,
          );
        }
      }

      // Atualizar localStorage com IDs atualizados
      localStorage.setItem(localKey, JSON.stringify(data));

      console.log(`✅ ${localKey} sincronizado para Firebase`);
    } catch (error) {
      console.error(`❌ Erro ao sincronizar ${localKey}:`, error);
    }
  }

  // Sincronizar dados do Firebase para localStorage
  async syncAllFromFirebase(): Promise<void> {
    if (!this.isActive || !this.isFirebaseAvailable()) {
      console.log("⏸️ Sincronização do Firebase não disponível");
      return;
    }

    console.log("🔄 Sincronizando dados do Firebase para localStorage...");

    try {
      await Promise.all([
        this.syncCollectionFromFirebase("obras", "works"),
        this.syncCollectionFromFirebase("piscinas", "pools"),
        this.syncCollectionFromFirebase("manutencoes", "maintenance"),
        this.syncCollectionFromFirebase("clientes", "clients"),
        this.syncCollectionFromFirebase("utilizadores", "app-users"),
      ]);

      console.log("✅ Sincronização do Firebase concluída");

      // Disparar evento para notificar outros componentes
      window.dispatchEvent(
        new CustomEvent("dataUpdated", {
          detail: { source: "firebase", timestamp: new Date() },
        }),
      );
    } catch (error) {
      console.error("❌ Erro na sincronização do Firebase:", error);
    }
  }

  // Sincronizar uma coleção específica do Firebase para localStorage
  private async syncCollectionFromFirebase(
    firebaseCollection: string,
    localKey: string,
  ): Promise<void> {
    try {
      const db = getFirebaseFirestore();
      if (!db) return;

      const querySnapshot = await getDocs(collection(db, firebaseCollection));
      const data: any[] = [];

      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Atualizar localStorage
      localStorage.setItem(localKey, JSON.stringify(data));

      console.log(
        `✅ ${firebaseCollection} sincronizado do Firebase (${data.length} itens)`,
      );
    } catch (error) {
      console.error(
        `❌ Erro ao sincronizar ${firebaseCollection} do Firebase:`,
        error,
      );
    }
  }

  // Adicionar item e sincronizar
  async addItem(
    localKey: string,
    firebaseCollection: string,
    itemData: any,
  ): Promise<string | null> {
    try {
      let itemId = null;

      // Guardar localmente primeiro
      const localData = JSON.parse(localStorage.getItem(localKey) || "[]");
      const newItem = {
        ...itemData,
        id: itemData.id || Date.now().toString(),
        createdAt: itemData.createdAt || new Date().toISOString(),
        localOnly: !this.isFirebaseAvailable(),
      };

      localData.push(newItem);
      localStorage.setItem(localKey, JSON.stringify(localData));
      itemId = newItem.id;

      console.log(`💾 Item adicionado localmente a ${localKey}:`, itemId);

      // Tentar sincronizar com Firebase se disponível
      if (this.isFirebaseAvailable()) {
        try {
          const db = getFirebaseFirestore();
          if (db) {
            const syncData = {
              ...newItem,
              syncedAt: serverTimestamp(),
            };

            const docRef = await addDoc(
              collection(db, firebaseCollection),
              syncData,
            );

            // Atualizar item local com ID do Firebase
            newItem.id = docRef.id;
            newItem.localOnly = false;
            localStorage.setItem(localKey, JSON.stringify(localData));

            console.log(`🔥 Item sincronizado com Firebase:`, docRef.id);
            itemId = docRef.id;
          }
        } catch (syncError) {
          console.warn(
            `⚠️ Erro ao sincronizar com Firebase (item guardado localmente):`,
            syncError,
          );
        }
      }

      // Disparar evento de atualização
      window.dispatchEvent(
        new CustomEvent("dataChanged", {
          detail: { collection: localKey, action: "add", itemId },
        }),
      );

      return itemId;
    } catch (error) {
      console.error(`❌ Erro ao adicionar item a ${localKey}:`, error);
      return null;
    }
  }

  // Obter status da sincronização
  getStatus(): { active: boolean; firebase: boolean; lastSync: Date | null } {
    return {
      active: this.isActive,
      firebase: this.isFirebaseAvailable(),
      lastSync: new Date(), // Placeholder - poderia guardar timestamp real
    };
  }

  // Forçar sincronização completa
  async forceSyncAll(): Promise<void> {
    console.log("🚀 Forçando sincronização completa...");

    await Promise.all([this.syncAllFromLocal(), this.syncAllFromFirebase()]);

    console.log("✅ Sincronização forçada concluída");
  }
}

// Exportar instância singleton
export const simplifiedSyncService = new SimplifiedSyncService();
export default simplifiedSyncService;
