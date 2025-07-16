import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Inicializando aplicação...");

// Simple test component first
function TestApp() {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-blue-600">
          Teste de Carregamento - Leirisonda
        </h1>
        <p className="mt-4 text-gray-700">
          Se vê esta mensagem, o React está a funcionar!
        </p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">�� Sistema operacional</p>
          <p className="text-sm text-green-600 mt-1">
            Data: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  ReactDOM.createRoot(rootElement).render(<TestApp />);
  console.log("✅ Aplicação de teste renderizada!");
} catch (error) {
  console.error("❌ Erro ao renderizar:", error);
  // Fallback direto no DOM
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #f3f4f6; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #dc2626; font-size: 1.5rem; font-weight: bold;">Erro de Carregamento</h1>
        <p style="margin-top: 1rem; color: #6b7280;">Erro: ${error.message}</p>
        <button onclick="location.reload()" style="margin-top: 1rem; background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer;">
          Recarregar
        </button>
      </div>
    </div>
  `;
}
