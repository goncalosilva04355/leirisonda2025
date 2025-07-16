import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import { debugDuplicateStatus } from "../utils/debugDuplicates";
import { executeManualCleanup } from "../utils/manualDuplicateCleanup";

interface DuplicateStatus {
  total: number;
  unique: number;
  duplicates: string[];
  duplicateCount: number;
  hasDuplicates: boolean;
  error?: string;
}

export const DuplicateCleanupStatus: React.FC = () => {
  const [status, setStatus] = useState<DuplicateStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const checkDuplicates = async () => {
    setIsLoading(true);
    try {
      const result = await debugDuplicateStatus();
      setStatus(result as DuplicateStatus);
    } catch (error) {
      console.error("Erro ao verificar duplicados:", error);
      setStatus({ error: error.message } as DuplicateStatus);
    } finally {
      setIsLoading(false);
    }
  };

  const runCleanup = async () => {
    setIsCleaning(true);
    try {
      await executeManualCleanup();
      // After cleanup, check again
      setTimeout(() => {
        checkDuplicates();
        setIsCleaning(false);
      }, 1000);
    } catch (error) {
      console.error("Erro na limpeza:", error);
      setIsCleaning(false);
    }
  };

  useEffect(() => {
    // Check duplicates on component mount
    checkDuplicates();
  }, []);

  if (isLoading && !status) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm text-gray-600">
            Verificando duplicados...
          </span>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const getStatusColor = () => {
    if (status.error) return "red";
    if (status.hasDuplicates) return "orange";
    return "green";
  };

  const getStatusIcon = () => {
    if (status.error) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (status.hasDuplicates)
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="font-medium text-gray-900">Status de Duplicados</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={checkDuplicates}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Verificar</span>
          </button>
          {status.hasDuplicates && (
            <button
              onClick={runCleanup}
              disabled={isCleaning}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isCleaning ? "Limpando..." : "Limpar"}</span>
            </button>
          )}
        </div>
      </div>

      {status.error ? (
        <div className="text-sm text-red-600">
          <p>
            <strong>Erro:</strong> {status.error}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total:</span>
              <span className="ml-1 font-medium">{status.total}</span>
            </div>
            <div>
              <span className="text-gray-500">Únicos:</span>
              <span className="ml-1 font-medium text-green-600">
                {status.unique}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Duplicados:</span>
              <span
                className={`ml-1 font-medium ${status.duplicateCount > 0 ? "text-red-600" : "text-green-600"}`}
              >
                {status.duplicateCount}
              </span>
            </div>
          </div>

          {status.hasDuplicates && status.duplicates.length > 0 && (
            <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
              <p className="text-sm font-medium text-orange-800 mb-1">
                IDs Duplicados:
              </p>
              <div className="text-xs text-orange-700 space-y-1">
                {status.duplicates.slice(0, 5).map((id, index) => (
                  <div key={index} className="font-mono">
                    {id}
                  </div>
                ))}
                {status.duplicates.length > 5 && (
                  <div className="text-orange-600">
                    ... e mais {status.duplicates.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}

          {!status.hasDuplicates && (
            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-700">
                ✅ Nenhum duplicado encontrado!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Emergency Cleanup Button */}
      <div className="mt-4">
        <EmergencyCleanupButton />
      </div>
    </div>
  );
};

export default DuplicateCleanupStatus;
