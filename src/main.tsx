import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Inicializando aplicação...");

// Production safety - prevent crashes
import "./utils/productionSafety";

// Clear any flags that might force simple app
import "./utils/clearAppFlags";

// Adicionar error boundary e tratamento global de erros
window.addEventListener("error", (event) => {
  console.error("❌ Global error:", event.error);
  console.error("❌ Error details:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  // Check if it's a Firebase messaging error and prevent logging
  if (
    event.reason &&
    (event.reason.toString().includes("firebase") ||
      event.reason.toString().includes("messaging") ||
      event.reason.toString().includes("_FirebaseError"))
  ) {
    console.warn(
      "⚠️ Firebase messaging error handled gracefully:",
      event.reason.message || event.reason,
    );
    event.preventDefault(); // Prevent the error from being logged as unhandled
    return;
  }

  console.error("❌ Unhandled promise rejection:", event.reason);
  console.error("❌ Promise:", event.promise);
});

// App original reparado
import App from "./App";
// App simplificado funcional
import AppSimpleFixed from "./AppSimpleFixed";
// App mínimo para teste
import AppMinimal from "./AppMinimal";
// App diagnóstico
import AppDiagnostic from "./AppDiagnostic";
// App debug para diagnóstico de tela branca
import AppDebug from "./AppDebug";
// App simples e robusto
import AppSimple from "./AppSimple";
// App com sistema de fallback inteligente
import AppWithFallback from "./AppWithFallback";
// App funcional garantido
import AppWorking from "./AppWorking";
// App simplificado para produção
import AppProduction from "./AppProduction";
// App corrigido sem loops
import AppFixed from "./AppFixed";
// App de teste para diagnosticar
import AppTest from "./AppTest";
// App minimal para teste
import AppMinimalTest from "./AppMinimalTest";
// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary";
// App Loader
import AppLoader from "./components/AppLoader";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("🔄 Tentando renderizar aplicação...");
  console.log("🔍 Root element:", rootElement);
  console.log(
    "🔍 CSS imported:",
    !!document.querySelector('style, link[rel="stylesheet"]'),
  );

  console.log("🚀 Loading application...");
  console.log("🔍 Environment:", import.meta.env.MODE, import.meta.env.PROD);
  console.log("🔍 Base URL:", import.meta.env.BASE_URL);

  // TEMPORÁRIO: Use AppMinimalTest para diagnóstico
  const AppComponent = AppMinimalTest;
  console.log(
    "📱 Using app:",
    "AppMinimalTest (minimal test version for debugging)",
  );

  ReactDOM.createRoot(rootElement).render(
    // <React.StrictMode> // Temporarily disabled to fix duplicate key warnings
    <ErrorBoundary>
      <AppComponent />
    </ErrorBoundary>,
    // </React.StrictMode>
  );
  console.log("✅ Aplicação renderizada com sucesso!");
} catch (error) {
  console.error("❌ Erro ao renderizar App:", error);
  console.error("❌ Stack trace:", error.stack);

  // Fallback: Simple error display
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #f3f4f6; display: flex; align-items: center; justify-content: center; padding: 1rem; font-family: system-ui;">
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 500px;">
        <h1 style="color: #dc2626; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Leirisonda - Erro de Carregamento</h1>
        <p style="margin-bottom: 1rem; color: #6b7280;">A aplicação encontrou um erro durante o carregamento:</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.375rem; padding: 1rem; margin-bottom: 1rem;">
          <pre style="color: #dc2626; font-size: 0.875rem; white-space: pre-wrap;">${error.message}</pre>
        </div>
        <button onclick="location.reload()" style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer; margin-right: 0.5rem;">
          Recarregar Página
        </button>
        <button onclick="console.clear(); localStorage.clear(); location.reload()" style="background: #dc2626; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">
          Limpar Cache e Recarregar
        </button>
      </div>
    </div>
  `;
}
