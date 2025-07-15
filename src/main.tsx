import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Simple test component
function TestApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🔧 Teste de Depuração
        </h1>
        <p className="text-gray-600 mb-4">
          Se conseguir ver esta mensagem, o problema não está na estrutura
          básica da aplicação.
        </p>
        <div className="space-y-2">
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => alert("Interação funcionando!")}
          >
            Testar interação
          </button>
          <button
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </button>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>Timestamp: {new Date().toLocaleString()}</p>
          <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
        </div>
      </div>
    </div>
  );
}

// Ensure single root creation
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

console.log("🚀 Inicializando aplicação de teste...");

// Check if root is already rendered
if (!rootElement.hasAttribute("data-react-root")) {
  rootElement.setAttribute("data-react-root", "true");
  ReactDOM.createRoot(rootElement).render(<TestApp />);
  console.log("✅ Aplicação de teste renderizada com sucesso!");
}
