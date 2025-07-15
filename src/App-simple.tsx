import React from "react";

function SimpleApp() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          🎉 Leirisonda - Depuração
        </h1>
        <p className="text-gray-600 mb-6">
          A estrutura básica da aplicação está a funcionar. O problema estava
          provavelmente nas importações complexas do Firebase/utils.
        </p>
        <div className="space-y-3">
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => alert("Funciona perfeitamente!")}
          >
            ✓ Testar React
          </button>
          <button
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={() => console.log("Console log funcionando")}
          >
            ✓ Testar Console
          </button>
          <button
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            onClick={() => {
              try {
                localStorage.setItem("test", "funciona");
                alert(`LocalStorage: ${localStorage.getItem("test")}`);
                localStorage.removeItem("test");
              } catch (e) {
                alert("Erro no localStorage: " + e);
              }
            }}
          >
            ✓ Testar localStorage
          </button>
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
          <p>
            <strong>Status:</strong> ✅ Aplicação básica funcional
          </p>
          <p>
            <strong>Próximo passo:</strong> Identificar importação problemática
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;
