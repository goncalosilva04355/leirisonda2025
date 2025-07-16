import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Inicializando aplicação...");

// Testar primeiro com App mínimo
import App from "./App-minimal";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  ReactDOM.createRoot(rootElement).render(<App />);
  console.log("✅ Aplicação renderizada!");
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
