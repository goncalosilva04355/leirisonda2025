import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Teste de Funcionamento
        </h1>
        <p className="text-gray-600">
          Se conseguir ver esta mensagem, a aplicação está a funcionar.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert("Botão funciona!")}
        >
          Testar interação
        </button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(<SimpleApp />);
