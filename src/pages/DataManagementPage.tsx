import React from "react";
import AppInitializer from "../components/AppInitializer";
import DataManagementPanel from "../components/DataManagementPanel";
import DataCleanupManager from "../components/DataCleanupManager";

export function DataManagementPage() {
  return (
    <AppInitializer autoCleanOnStartup={false}>
      <div className="min-h-screen bg-gray-50">
        <DataManagementPanel />
      </div>
    </AppInitializer>
  );
}

export function SimpleCleanupPage() {
  return (
    <AppInitializer autoCleanOnStartup={false}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Limpeza de Dados Leirisonda
          </h1>
          <DataCleanupManager
            onCleanupComplete={() => {
              console.log("Cleanup completed!");
              // You could redirect or show a success message here
            }}
          />
        </div>
      </div>
    </AppInitializer>
  );
}

export function AutoCleanPage() {
  return (
    <AppInitializer autoCleanOnStartup={true}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Aplicação Limpa - Leirisonda
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Aplicação Inicializada
            </h2>
            <p className="text-gray-600">
              A aplicação foi limpa de todos os dados de obras, manutenções e
              piscinas. Novos utilizadores serão automaticamente sincronizados.
            </p>
          </div>
        </div>
      </div>
    </AppInitializer>
  );
}

export default DataManagementPage;
