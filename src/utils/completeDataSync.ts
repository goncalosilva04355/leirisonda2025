/**
 * Diagnóstico completo de sincronização Firebase para TODAS as entidades
 */

interface DataEntity {
  name: string;
  firestoreCollection: string;
  localStorageKey: string;
  method: string;
}

const DATA_ENTITIES: DataEntity[] = [
  {
    name: "Utilizadores",
    firestoreCollection: "utilizadores",
    localStorageKey: "app-users",
    method: "getUtilizadores",
  },
  {
    name: "Obras",
    firestoreCollection: "obras",
    localStorageKey: "works",
    method: "getObras",
  },
  {
    name: "Piscinas",
    firestoreCollection: "piscinas",
    localStorageKey: "pools",
    method: "getPiscinas",
  },
  {
    name: "Manutenções",
    firestoreCollection: "manutencoes",
    localStorageKey: "maintenance",
    method: "getManutencoes",
  },
  {
    name: "Clientes",
    firestoreCollection: "clientes",
    localStorageKey: "clients",
    method: "getClientes",
  },
  {
    name: "Localizações",
    firestoreCollection: "localizacoes",
    localStorageKey: "locations",
    method: "getLocalizacoes",
  },
];

export async function diagnoseCompleteDataSync(): Promise<void> {
  console.log("🔍 === DIAGNÓSTICO COMPLETO FIREBASE SYNC ===");

  try {
    const { firestoreService } = await import("../services/firestoreService");
    console.log("🔥 FirestoreService carregado com sucesso");

    for (const entity of DATA_ENTITIES) {
      console.log(`\n📊 === ${entity.name.toUpperCase()} ===`);

      try {
        // 1. Verificar localStorage
        const localData = localStorage.getItem(entity.localStorageKey);
        const localCount = localData ? JSON.parse(localData).length : 0;
        console.log(
          `📱 localStorage (${entity.localStorageKey}): ${localCount} itens`,
        );

        // 2. Sincronizar com Firestore
        const method = entity.method as keyof typeof firestoreService;
        if (typeof firestoreService[method] === "function") {
          const firestoreData = await (firestoreService[method] as Function)();
          console.log(
            `☁️ Firestore (${entity.firestoreCollection}): ${firestoreData.length} itens`,
          );

          // 3. Status da sincronização
          if (firestoreData.length > 0) {
            console.log(`✅ ${entity.name}: Sincronização ativa`);
          } else if (localCount > 0) {
            console.log(
              `🔄 ${entity.name}: Dados locais encontrados, sincronizando...`,
            );
          } else {
            console.log(`📝 ${entity.name}: Sem dados (normal)`);
          }
        } else {
          console.warn(`⚠️ Método ${entity.method} não encontrado`);
        }
      } catch (error) {
        console.error(`❌ Erro em ${entity.name}:`, error);
      }
    }
  } catch (error) {
    console.error("❌ Erro no diagnóstico completo:", error);
  }

  console.log("\n🔍 === FIM DIAGNÓSTICO COMPLETO ===");
}

export async function initializeCompleteDataSync(): Promise<void> {
  console.log("🚀 Inicializando sincronização completa de dados...");

  try {
    // Aguardar um pouco para Firebase estar pronto
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Executar diagnóstico
    await diagnoseCompleteDataSync();
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
  }
}

// Auto-executar em desenvolvimento
if (process.env.NODE_ENV === "development") {
  setTimeout(() => {
    initializeCompleteDataSync();
  }, 5000);
}
