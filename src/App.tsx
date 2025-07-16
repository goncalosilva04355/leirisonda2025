import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Leirisonda</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sistema de Gestão de Piscinas
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <p className="text-gray-700">
            A aplicação está a funcionar corretamente!
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => alert("Botão funciona!")}
          >
            Testar Funcionalidade
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
