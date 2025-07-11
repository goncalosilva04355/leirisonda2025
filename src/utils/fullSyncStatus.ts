/**
 * Diagnóstico completo do estado de sincronização Firebase
 */

import { autoSyncService } from "../services/autoSyncService";
import { firestoreService } from "../services/firestoreService";
import { isFirestoreReady } from "../firebase/firestoreConfig";

interface SyncStatus {
  entity: string;
  localStorage: number;
  firestore: number;
  autoSync: boolean;
  status: "synced" | "local-only" | "firestore-only" | "empty" | "error";
}

export async function checkFullSyncStatus(): Promise<SyncStatus[]> {
  console.log("🔍 === VERIFICAÇÃO COMPLETA DE SINCRONIZAÇÃO ===");

  const entities = [
    { name: "Utilizadores", localKey: "app-users", method: "getUtilizadores" },
    { name: "Obras", localKey: "works", method: "getObras" },
    { name: "Piscinas", localKey: "pools", method: "getPiscinas" },
    { name: "Manutenções", localKey: "maintenance", method: "getManutencoes" },
    { name: "Clientes", localKey: "clients", method: "getClientes" },
    { name: "Localizações", localKey: "locations", method: "getLocalizacoes" },
  ];

  const results: SyncStatus[] = [];

  // 1. Verificar estado geral
  const firebaseReady = isFirestoreReady();
  const autoSyncActive = autoSyncService.isAutoSyncActive();
  const observersStatus = autoSyncService.getObserversStatus();

  console.log("🔥 Firebase Ready:", firebaseReady);
  console.log("🔄 AutoSync Active:", autoSyncActive);
  console.log("👁️ Observers:", Object.keys(observersStatus).length);

  // 2. Verificar cada entidade
  for (const entity of entities) {
    try {
      // LocalStorage count
      const localData = localStorage.getItem(entity.localKey);
      const localCount = localData ? JSON.parse(localData).length : 0;

      // Firestore count via service
      let firestoreCount = 0;
      try {
        const method = entity.method as keyof typeof firestoreService;
        if (typeof firestoreService[method] === "function") {
          const firestoreData = await (firestoreService[method] as Function)();
          firestoreCount = firestoreData.length;
        }
      } catch (error) {
        console.warn(
          `⚠️ Erro ao obter dados Firestore para ${entity.name}:`,
          error,
        );
      }

      // Determinar status
      let status: SyncStatus["status"];
      if (localCount > 0 && firestoreCount > 0) {
        status = "synced";
      } else if (localCount > 0 && firestoreCount === 0) {
        status = "local-only";
      } else if (localCount === 0 && firestoreCount > 0) {
        status = "firestore-only";
      } else {
        status = "empty";
      }

      const result: SyncStatus = {
        entity: entity.name,
        localStorage: localCount,
        firestore: firestoreCount,
        autoSync: observersStatus[entity.localKey] || false,
        status,
      };

      results.push(result);

      // Log individual
      const statusIcon = {
        synced: "✅",
        "local-only": "📱",
        "firestore-only": "☁️",
        empty: "📝",
        error: "❌",
      }[status];

      console.log(
        `${statusIcon} ${entity.name}: Local=${localCount}, Firestore=${firestoreCount}, AutoSync=${result.autoSync}`,
      );
    } catch (error) {
      console.error(`❌ Erro ao verificar ${entity.name}:`, error);
      results.push({
        entity: entity.name,
        localStorage: 0,
        firestore: 0,
        autoSync: false,
        status: "error",
      });
    }
  }

  console.log("\n📊 RESUMO:");
  const synced = results.filter((r) => r.status === "synced").length;
  const localOnly = results.filter((r) => r.status === "local-only").length;
  const firestoreOnly = results.filter(
    (r) => r.status === "firestore-only",
  ).length;
  const empty = results.filter((r) => r.status === "empty").length;

  console.log(`✅ Sincronizados: ${synced}`);
  console.log(`📱 Apenas Local: ${localOnly}`);
  console.log(`☁️ Apenas Firestore: ${firestoreOnly}`);
  console.log(`📝 Vazios: ${empty}`);

  console.log("🔍 === FIM VERIFICAÇÃO ===");

  return results;
}

// Função para forçar sincronização completa
export async function forceSyncAll(): Promise<void> {
  console.log("🚀 Forçando sincronização completa...");

  try {
    if (!autoSyncService.isAutoSyncActive()) {
      await autoSyncService.startAutoSync();
      console.log("✅ AutoSync iniciado");
    }

    // Aguardar um pouco para observadores configurarem
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verificar novamente
    await checkFullSyncStatus();
  } catch (error) {
    console.error("❌ Erro ao forçar sincronização:", error);
  }
}

// Auto-executar em desenvolvimento
if (process.env.NODE_ENV === "development") {
  setTimeout(async () => {
    await checkFullSyncStatus();

    // Se houver problemas, tentar forçar sincronização
    setTimeout(async () => {
      console.log("\n🔄 === SEGUNDA VERIFICAÇÃO ===");
      await forceSyncAll();
    }, 10000); // 10 segundos depois
  }, 8000); // 8 segundos após carregamento
}
