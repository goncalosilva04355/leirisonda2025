import React from "react";

function AppTest() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Teste - A app está a funcionar!
        </h1>
        <p className="text-gray-600">
          Se vês esta mensagem, o React está a funcionar.
        </p>
        <button
          onClick={() => alert("Botão funciona!")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Testar Clique
        </button>
      </div>
    </div>
  );
}

export default AppTest;
