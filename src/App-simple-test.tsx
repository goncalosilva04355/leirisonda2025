import React from "react";

function AppSimpleTest() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Teste de Aplicação
        </h1>
        <p className="text-gray-600">
          Se consegues ver isto, a aplicação está a funcionar!
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Timestamp: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default AppSimpleTest;
