import React from "react";

function TestApp() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Teste de CSS - Leirisonda
        </h1>
        <p className="text-gray-700 mb-4">
          Se você consegue ver este texto com estilo, o CSS está funcionando.
        </p>
        <div className="bg-blue-100 p-4 rounded border-l-4 border-blue-500">
          <p className="text-blue-800">✅ Tailwind CSS está ativo!</p>
        </div>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Botão de Teste
        </button>
      </div>
    </div>
  );
}

export default TestApp;
