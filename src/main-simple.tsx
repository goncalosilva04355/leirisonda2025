import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Componente simples para testar se o React está funcionando
function SimpleApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#0891b2" }}>✅ Leirisonda - Aplicação Carregada</h1>
      <p>
        Se está a ver esta mensagem, o React está a funcionar correctamente.
      </p>
      <p>A aplicação está a ser carregada...</p>
      <button
        onClick={() => (location.href = location.href)}
        style={{
          padding: "10px 20px",
          background: "#0891b2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Recarregar
      </button>
    </div>
  );
}

console.log("🔧 Main-simple.tsx carregado - inicializando React...");

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Elemento root não encontrado");
  }

  ReactDOM.createRoot(root).render(<SimpleApp />);
  console.log("✅ React inicializado com sucesso");
} catch (error) {
  console.error("❌ Erro ao inicializar React:", error);

  // Fallback sem React
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; background: #f8f9fa; color: #333;">
        <h1 style="color: #dc3545;">❌ Erro ao carregar React</h1>
        <p>Erro: ${error.message}</p>
        <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Tentar Novamente
        </button>
      </div>
    `;
  }
}
