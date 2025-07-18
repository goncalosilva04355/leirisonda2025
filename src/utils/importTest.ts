/**
 * Teste de imports críticos para identificar falhas de Load
 */

console.log("🧪 Testando imports críticos...");

// Testar imports principais
Promise.all([
  // React
  import("react")
    .then(() => console.log("✅ React OK"))
    .catch((e) => console.error("❌ React failed:", e)),

  // Lucide React
  import("lucide-react")
    .then(() => console.log("✅ Lucide React OK"))
    .catch((e) => console.error("❌ Lucide React failed:", e)),

  // jsPDF
  import("jspdf")
    .then(() => console.log("✅ jsPDF OK"))
    .catch((e) => console.error("❌ jsPDF failed:", e)),

  // Hooks críticos
  import("../hooks/usePullToRefresh")
    .then(() => console.log("✅ usePullToRefresh OK"))
    .catch((e) => console.error("❌ usePullToRefresh failed:", e)),

  // Componentes críticos
  import("../components/RefreshIndicator")
    .then(() => console.log("✅ RefreshIndicator OK"))
    .catch((e) => console.error("❌ RefreshIndicator failed:", e)),

  // Firebase quota recovery
  import("../utils/firebaseQuotaRecovery")
    .then(() => console.log("✅ firebaseQuotaRecovery OK"))
    .catch((e) => console.error("❌ firebaseQuotaRecovery failed:", e)),

  // Serviços críticos
  import("../services/simplifiedSyncService")
    .then(() => console.log("✅ simplifiedSyncService OK"))
    .catch((e) => console.error("❌ simplifiedSyncService failed:", e)),
])
  .then(() => {
    console.log("✅ Todos os imports críticos testados");
  })
  .catch((error) => {
    console.error("❌ Erro geral nos imports:", error);
  });
