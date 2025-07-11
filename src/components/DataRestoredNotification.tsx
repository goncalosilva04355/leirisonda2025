import React from "react";
import { useDataProtection } from "../hooks/useDataProtection";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

export const DataRestoredNotification: React.FC = () => {
  const { dataRestored, lastBackup, isProtected } = useDataProtection();

  if (!dataRestored) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <Shield className="h-6 w-6 text-green-600 mr-3 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-green-800 font-semibold mb-1">
              🛡️ Dados Restaurados Automaticamente
            </h4>
            <p className="text-green-700 text-sm mb-2">
              O sistema detectou perda de dados e restaurou automaticamente a
              partir do backup mais recente.
            </p>
            {lastBackup && (
              <p className="text-green-600 text-xs">
                Backup: {new Date(lastBackup).toLocaleString()}
              </p>
            )}
            <div className="flex items-center mt-2 text-green-600 text-xs">
              <CheckCircle className="h-4 w-4 mr-1" />
              Todos os seus dados estão seguros
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de status de proteção (sempre visível no rodapé)
export const DataProtectionStatus: React.FC = () => {
  const { isProtected, lastBackup, checkIntegrity } = useDataProtection();
  const integrity = checkIntegrity();

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div
        className={`flex items-center px-3 py-2 rounded-lg text-xs ${
          isProtected && integrity.hasData
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
        }`}
      >
        <Shield className="h-4 w-4 mr-2" />
        <span className="font-medium">
          {isProtected && integrity.hasData
            ? "🛡️ Dados Protegidos"
            : "⚠️ Verificando Proteção"}
        </span>
        {lastBackup && (
          <span className="ml-2 opacity-75">
            | Backup: {new Date(lastBackup).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};
