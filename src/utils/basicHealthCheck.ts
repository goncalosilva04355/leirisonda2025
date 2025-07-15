/**
 * Verificação básica de saúde da aplicação
 */

console.log("🔍 Basic Health Check iniciado");

// Verificar elementos essenciais
try {
  if (!window || !document || !localStorage) {
    throw new Error("Elementos básicos não disponíveis");
  }

  if (!React) {
    throw new Error("React não disponível");
  }

  console.log("✅ Elementos básicos: OK");
  console.log("✅ React: OK");
  console.log("✅ LocalStorage: OK");
  console.log("✅ Application deve carregar normalmente");
} catch (error) {
  console.error("❌ Health Check falhou:", error);
}

export const healthCheck = () => {
  console.log("🏥 Health Check manual executado");
  console.log("- URL:", window.location.href);
  console.log("- User Agent:", navigator.userAgent);
  console.log("- Screen:", screen.width + "x" + screen.height);
  console.log("- LocalStorage disponível:", typeof Storage !== "undefined");
};

// Expor globalmente
(window as any).healthCheck = healthCheck;
