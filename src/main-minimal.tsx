import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Aplicação iniciada");

// Simple App component
const App = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0891b2",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <h1>🔧 Leirisonda</h1>
        <p>Sistema de Gestão de Piscinas</p>
        <p>Aplicação a carregar...</p>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("✅ Renderizando aplicação...");
  ReactDOM.createRoot(rootElement).render(<App />);
  console.log("✅ Aplicação renderizada com sucesso!");
} catch (error) {
  console.error("❌ Erro ao renderizar:", error);
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #f3f4f6; display: flex; align-items: center; justify-content: center; padding: 1rem; font-family: system-ui;">
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 500px;">
        <h1 style="color: #dc2626; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Leirisonda - Erro</h1>
        <p style="margin-bottom: 1rem; color: #6b7280;">Erro ao carregar aplicação:</p>
        <pre style="color: #dc2626; font-size: 0.875rem; white-space: pre-wrap;">${error.message}</pre>
        <button onclick="location.reload()" style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">
          Recarregar
        </button>
      </div>
    </div>
  `;
}
