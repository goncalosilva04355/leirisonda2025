import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Inicializando aplicação...");

// Builder.io optimizations - must be imported first
import "./utils/builderioOptimizations";

// Firestore error handler - must be imported early
import "./utils/firestoreErrorHandler";

// Chunk load error handler - must be imported early
import "./utils/chunkLoadErrorHandler";

// Error boundary
import ErrorBoundary from "./components/ErrorBoundary";
import AppErrorHandler from "./components/AppErrorHandler";

// Main app
import App from "./App";

// Enhanced global error handler for production stability
window.addEventListener("error", (event) => {
  // Handle webkit masked URL errors specifically
  if (event.filename && event.filename.includes("webkit-masked-url")) {
    console.warn("⚠️ WebKit masked URL error handled:", {
      message: event.message,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: new Date().toISOString(),
    });
    event.preventDefault();
    return;
  }

  // Handle other global errors
  console.error("❌ Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  // Check if it's a Firebase messaging error and prevent logging
  if (
    event.reason &&
    (event.reason.toString().includes("firebase") ||
      event.reason.toString().includes("messaging") ||
      event.reason.toString().includes("webkit-masked-url"))
  ) {
    console.warn(
      "⚠️ Firebase/WebKit error handled gracefully:",
      event.reason.message || event.reason,
    );
    event.preventDefault();
    return;
  }
  console.error("❌ Unhandled promise rejection:", event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("🔄 Tentando renderizar aplicação...");

  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <AppErrorHandler>
        <App />
      </AppErrorHandler>
    </ErrorBoundary>,
  );
  console.log("✅ Aplicação renderizada com sucesso!");
} catch (error) {
  console.error("❌ Erro ao renderizar App:", error);

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
