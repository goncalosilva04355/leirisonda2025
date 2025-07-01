import {
  detectDuplicateMaintenances,
  cleanAllMaintenanceStorages,
} from "./cleanDuplicates";

/**
 * LIMPEZA NUCLEAR - Apaga ABSOLUTAMENTE TUDO relacionado a piscinas de TODOS os locais
 */
function executeNuclearCleanup() {
  console.log(
    "☢️ LIMPEZA NUCLEAR: Apagando TUDO relacionado a piscinas de TODOS os locais...",
  );

  try {
    // 1. LISTA MASSIVA de TODAS as possíveis chaves
    const massivePoolKeysList = [
      "pool_maintenances",
      "maintenances",
      "leirisonda_maintenances",
      "backup_maintenances",
      "temp_maintenances",
      "emergency_maintenances",
      "session_maintenances",
      "temp_pool_maintenances",
      "pools",
      "piscinas",
      "maintenance_data",
      "pool_data",
      "sync_maintenances",
      "firebase_maintenances",
      "cached_maintenances",
      "local_maintenances",
      "stored_pools",
      "poolMaintenances",
      "maintenance",
      "pool",
      "piscina",
      "manutencao",
      "manutencoes",
      "interventions",
      "intervencoes",
      "poolList",
      "maintenanceList",
      "sync_data",
      "firebase_data",
      "leirisonda_data",
      "app_data",
      "pool_cache",
      "maintenance_cache",
      "sync_cache",
      "firebase_cache",
    ];

    let totalNuked = 0;

    // 2. LIMPEZA COMPLETA DO LOCALSTORAGE
    console.log("🧨 Fase 1: Limpeza completa localStorage...");
    massivePoolKeysList.forEach((key) => {
      try {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          totalNuked++;
          console.log(`☢️ NUKED: ${key}`);
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao nukar ${key}:`, error);
      }
    });

    // 3. VARREDURA TOTAL - Remover QUALQUER chave que contenha palavras suspeitas
    console.log("🧨 Fase 2: Varredura nuclear localStorage...");
    const allKeys = Object.keys(localStorage);
    const suspiciousKeys = allKeys.filter((key) => {
      const lowerKey = key.toLowerCase();
      const suspiciousWords = [
        "pool",
        "piscina",
        "maintenance",
        "manutenc",
        "intervention",
        "interven",
        "sync",
        "firebase",
        "cache",
        "data",
        "list",
        "temp",
        "backup",
        "emergency",
        "session",
        "local",
        "stored",
        "app",
      ];
      return suspiciousWords.some((word) => lowerKey.includes(word));
    });

    suspiciousKeys.forEach((key) => {
      // Preservar apenas keys essenciais do sistema
      const essentialKeys = ["leirisonda_user", "auth_token", "user_session"];
      if (!essentialKeys.includes(key)) {
        try {
          localStorage.removeItem(key);
          totalNuked++;
          console.log(`☢️ SUSPEITA NUKADA: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Erro ao nukar suspeita ${key}:`, error);
        }
      }
    });

    // 4. LIMPEZA TOTAL DO SESSIONSTORAGE
    console.log("🧨 Fase 3: Aniquilação sessionStorage...");
    try {
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach((key) => {
        sessionStorage.removeItem(key);
        console.log(`☢️ SESSION NUKADA: ${key}`);
      });
    } catch (error) {
      console.warn("⚠️ Erro ao limpar sessionStorage:", error);
    }

    // 5. DESTRUIÇÃO TOTAL DO CACHE
    console.log("🧨 Fase 4: Destruição do cache...");
    if ("caches" in window) {
      caches
        .keys()
        .then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
            console.log(`☢️ CACHE DESTRUÍDO: ${cacheName}`);
          });
        })
        .catch((error) => {
          console.warn("⚠️ Erro ao destruir cache:", error);
        });
    }

    // 6. RESET DO INDEXEDDB SE EXISTIR
    console.log("🧨 Fase 5: Reset IndexedDB...");
    if ("indexedDB" in window) {
      try {
        const deleteReq = indexedDB.deleteDatabase("leirisonda");
        deleteReq.onsuccess = () => console.log("☢️ IndexedDB NUKADO");
        deleteReq.onerror = () => console.warn("⚠️ Erro ao nukar IndexedDB");
      } catch (error) {
        console.warn("⚠️ IndexedDB não disponível ou erro:", error);
      }
    }

    // 7. LIMPEZA DE VARIÁVEIS GLOBAIS
    console.log("🧨 Fase 6: Limpeza variáveis globais...");
    const globalVars = ["maintenances", "pools", "poolData", "maintenanceData"];
    globalVars.forEach((varName) => {
      try {
        if ((window as any)[varName]) {
          delete (window as any)[varName];
          console.log(`☢️ GLOBAL NUKADA: ${varName}`);
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao nukar global ${varName}:`, error);
      }
    });

    console.log(`☢️ LIMPEZA NUCLEAR CONCLUÍDA:`);
    console.log(`   • TOTAL NUKADO: ${totalNuked} itens`);
    console.log(`   • localStorage DESTRUÍDO`);
    console.log(`   • sessionStorage ANIQUILADO`);
    console.log(`   • Cache ELIMINADO`);
    console.log(`   • IndexedDB RESETADO`);
    console.log(`   • Variáveis globais APAGADAS`);

    // Marcar que foi nukado
    localStorage.setItem("nuclear_cleanup_done", new Date().toISOString());
    localStorage.setItem(
      "nuclear_stats",
      JSON.stringify({
        totalNuked,
        timestamp: new Date().toISOString(),
        phases: 6,
        type: "nuclear_annihilation",
      }),
    );

    console.log("☢️ RECARREGANDO EM 3 SEGUNDOS - SISTEMA TOTALMENTE LIMPO...");
    setTimeout(() => {
      window.location.href = window.location.href; // Hard reload
    }, 3000);

    return true;
  } catch (error) {
    console.error("💥 FALHA CRÍTICA NA LIMPEZA NUCLEAR:", error);
    // Último recurso: reload forçado
    setTimeout(() => window.location.reload(true), 1000);
    return false;
  }
}

// Executar imediatamente quando o script carrega
if (typeof window !== "undefined") {
  // Verificar se a limpeza nuclear já foi executada (últimos 30 minutos)
  const lastNuked = localStorage.getItem("nuclear_cleanup_done");
  const now = new Date().getTime();
  const thirtyMinutesAgo = now - 30 * 60 * 1000;

  let shouldNuke = true;

  if (lastNuked) {
    const lastNukedTime = new Date(lastNuked).getTime();
    if (lastNukedTime > thirtyMinutesAgo) {
      console.log("☢️ Sistema já foi nukado recentemente. Está limpo.");
      shouldNuke = false;
    }
  }

  if (shouldNuke) {
    // LANÇAR NUKE IMEDIATAMENTE
    console.log("☢️ LANÇANDO NUKE NUCLEAR - DESTRUINDO TODAS AS PISCINAS...");
    setTimeout(executeNuclearCleanup, 100);
  }
}

export { executeNuclearCleanup };
