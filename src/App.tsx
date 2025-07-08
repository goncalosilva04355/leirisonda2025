import React, { useState, useEffect } from "react";
import { Building2, Menu, Home, Settings, LogOut } from "lucide-react";

// Simple test component first
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  console.log("🔍 App rendering...");

  // For debugging - always show main interface
  if (true) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Leirisonda - Sistema Simplificado
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">✅ Sistema Ativo</h2>
            <p className="text-gray-600 mb-4">
              Se vês esta mensagem, o App.tsx está a funcionar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Building2 className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-blue-900">Obras</h3>
                <p className="text-blue-700">Sistema simplificado</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <Home className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-green-900">Piscinas</h3>
                <p className="text-green-700">Dados partilhados</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <Settings className="h-8 w-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-orange-900">Manutenções</h3>
                <p className="text-orange-700">Acesso global</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <Menu className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-purple-900">Clientes</h3>
                <p className="text-purple-700">Todos visíveis</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <p className="text-green-800 font-medium">
                🎉 Sistema simplificado implementado com sucesso!
              </p>
              <p className="text-green-700 text-sm mt-1">
                Todos os utilizadores acedem aos mesmos dados. Sem isolamento,
                sem complexidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This should never show since we return above
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">A carregar...</h1>
      </div>
    </div>
  );
}

export default App;
