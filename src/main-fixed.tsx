import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Inicializando aplicação Leirisonda...");

// Error boundary
import ErrorBoundary from "./components/ErrorBoundary";

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

// Lazy load do App principal para evitar problemas de inicialização
const LazyApp = React.lazy(() =>
  import("./App").catch((error) => {
    console.error("❌ Erro ao carregar App principal:", error);
    // Fallback para versão simplificada se o App principal falhar
    return import("./AppSimple");
  }),
);

const AppWithSuspense: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui",
            color: "white",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid rgba(255, 255, 255, 0.3)",
                borderTop: "3px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem",
              }}
            />
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>🏊 Leirisonda</h2>
            <p style={{ margin: "0.5rem 0 0", opacity: 0.8 }}>A carregar...</p>
          </div>
          <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </div>
      }
    >
      <LazyApp />
    </React.Suspense>
  );
};

try {
  console.log("🔄 Tentando renderizar aplicação...");

  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <AppWithSuspense />
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
        <button onclick="console.clear(); localStorage.clear(); sessionStorage.clear(); location.reload()" style="background: #dc2626; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">
          Limpar Cache e Recarregar
        </button>
      </div>
    </div>
  `;
}
