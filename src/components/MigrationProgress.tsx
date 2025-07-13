/**
 * Componente para mostrar progresso da migração para Firebase-Only
 */

import React, { useState, useEffect } from "react";
import { MigrateToFirebaseOnly } from "../utils/migrateToFirebaseOnly";

export function MigrationProgress() {
  const [showMigration, setShowMigration] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Verificar se migração é necessária
    const needsMigration = !MigrateToFirebaseOnly.isMigrationCompleted();
    setShowMigration(needsMigration);

    // Escutar evento de migração completa
    const handleMigrationCompleted = (event: any) => {
      setMigrationStatus(event.detail);
      setIsRunning(false);
      setShowMigration(false);
    };

    window.addEventListener("migrationCompleted", handleMigrationCompleted);

    return () => {
      window.removeEventListener(
        "migrationCompleted",
        handleMigrationCompleted,
      );
    };
  }, []);

  const handleManualMigration = async () => {
    setIsRunning(true);
    try {
      const result = await MigrateToFirebaseOnly.runMigration();
      setMigrationStatus(result);
      if (result.success) {
        setShowMigration(false);
      }
    } catch (error) {
      console.error("Erro na migração manual:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // Não mostrar se migração já foi feita
  if (!showMigration && !migrationStatus) {
    return null;
  }

  // Mostrar resultado da migração
  if (migrationStatus) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-green-500 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 z-50">
        <div className="text-center">
          <div className="text-2xl mb-4">
            {migrationStatus.success ? "🎉" : "⚠️"}
          </div>

          <h3 className="text-lg font-semibold mb-4">
            {migrationStatus.success
              ? "Migração Concluída!"
              : "Migração Finalizada"}
          </h3>

          <div className="text-sm space-y-2 mb-4">
            <div>Utilizadores: {migrationStatus.migrated.users}</div>
            <div>Piscinas: {migrationStatus.migrated.pools}</div>
            <div>Obras: {migrationStatus.migrated.works}</div>
            <div>Manutenções: {migrationStatus.migrated.maintenance}</div>
            <div>Clientes: {migrationStatus.migrated.clients}</div>
            {migrationStatus.errors.length > 0 && (
              <div className="text-red-600">
                Erros: {migrationStatus.errors.length}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-600 mb-4">
            O sistema agora usa apenas Firebase. Os dados foram migrados do
            localStorage.
          </div>

          <button
            onClick={() => setMigrationStatus(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  // Mostrar progresso da migração
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-yellow-500 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 z-50">
      <div className="text-center">
        <div className="text-2xl mb-4">🚀</div>

        <h3 className="text-lg font-semibold mb-4">Migração para Firebase</h3>

        {isRunning ? (
          <div>
            <div className="animate-spin text-2xl mb-4">⏳</div>
            <div className="text-sm text-gray-600 mb-4">
              Migrando dados do localStorage para Firebase...
              <br />
              Por favor aguarde.
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm text-gray-600 mb-4">
              O sistema está a migrar para usar apenas Firebase.
              <br />
              Isto vai sincronizar os dados entre dispositivos.
            </div>

            <div className="space-y-2">
              <button
                onClick={handleManualMigration}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Iniciar Migração
              </button>

              <button
                onClick={() => setShowMigration(false)}
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
              >
                Migrar Depois
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
