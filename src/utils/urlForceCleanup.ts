import {
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "./firestoreRestApi";

const DUPLICATE_IDS = [
  "1752578821484",
  "1752513775718",
  "1752582282132",
  "1752574634617",
  "1752517424794",
  "1752582282133",
  "1752604451507",
  "1752602368414",
];

const forceCleanupFromUrl = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const forceClean = urlParams.get("force-clean") === "true";

  if (forceClean || window.location.hash.includes("cleanup")) {
    console.log("🔗 URL FORCE CLEANUP DETECTADO");
    await executeForceCleanup();
    return;
  }

  // Verificar se ainda existem duplicados
  setTimeout(async () => {
    try {
      const obras = await readFromFirestoreRest("obras");
      const foundDuplicates = DUPLICATE_IDS.filter(
        (id) => obras.filter((obra) => obra.id === id).length > 1,
      );

      if (foundDuplicates.length > 0) {
        console.log("🚨 DUPLICADOS DETECTADOS - Forçando limpeza automática");
        await executeForceCleanup();
      }
    } catch (error) {
      console.error("❌ Erro na verificação automática:", error);
    }
  }, 3000);
};

const executeForceCleanup = async () => {
  console.log("🔥 EXECUTANDO FORÇA LIMPEZA TOTAL");

  for (const id of DUPLICATE_IDS) {
    console.log(`🗑️ Eliminando todas as instâncias de: ${id}`);

    // Tentar eliminar múltiplas vezes
    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        const success = await deleteFromFirestoreRest("obras", id);
        if (success) {
          console.log(`✅ Eliminado tentativa ${attempt}: ${id}`);
        }
        await new Promise((r) => setTimeout(r, 100));
      } catch (error) {
        console.error(`❌ Erro tentativa ${attempt}:`, error);
      }
    }
  }

  console.log("🔄 Limpeza concluída - Recarregando...");
  setTimeout(() => {
    // Limpar parâmetros da URL e recarregar
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.reload();
  }, 2000);
};

// Executar verificação na inicialização
forceCleanupFromUrl();

// Disponibilizar globalmente
(window as any).forceCleanupFromUrl = executeForceCleanup;

console.log(
  "🔗 URL CLEANUP: Adicione '?force-clean=true' ou '#cleanup' na URL para força limpeza",
);

export default forceCleanupFromUrl;
