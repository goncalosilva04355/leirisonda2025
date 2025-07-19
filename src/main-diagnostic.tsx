import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import AppDiagnostic from "./AppDiagnostic";

console.log("🧪 Inicializando versão de diagnóstico...");

// Error handler específico para diagnóstico
window.addEventListener("error", (event) => {
  console.error("❌ Erro global detectado:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    timestamp: new Date().toISOString(),
  });
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("❌ Promise rejeitada:", {
    reason: event.reason,
    timestamp: new Date().toISOString(),
  });
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("🔄 Renderizando AppDiagnostic...");

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppDiagnostic />
    </React.StrictMode>,
  );

  console.log("✅ AppDiagnostic renderizado com sucesso!");
} catch (error) {
  console.error("❌ Erro ao renderizar AppDiagnostic:", error);

  // Fallback ainda mais básico
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #ef4444; color: white; display: flex; align-items: center; justify-content: center; padding: 1rem; font-family: system-ui;">
      <div style="text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">❌ ERRO CRÍTICO</h1>
        <p style="margin-bottom: 1rem;">Nem o diagnóstico conseguiu carregar.</p>
        <p style="font-size: 0.875rem; opacity: 0.8;">Erro: ${error.message}</p>
        <button onclick="location.reload()" style="background: white; color: #ef4444; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; margin-top: 1rem; cursor: pointer;">
          Recarregar
        </button>
      </div>
    </div>
  `;
}
