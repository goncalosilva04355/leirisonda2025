import React, { useState, useEffect } from "react";
import {
  Users,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Database,
} from "lucide-react";
import { userRestoreService } from "../services/userRestoreService";

export const UserDiagnostic: React.FC = () => {
  const [stats, setStats] = useState({
    appUsers: 0,
    mockUsers: 0,
    totalUnique: 0,
  });
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastRestore, setLastRestore] = useState<string | null>(null);

  const updateStats = () => {
    const newStats = userRestoreService.getUserStats();
    setStats(newStats);
  };

  useEffect(() => {
    updateStats();

    // Listener para atualizações automáticas
    const handleUserRestore = () => {
      updateStats();
      setLastRestore(new Date().toLocaleTimeString());
    };

    window.addEventListener("usersRestored", handleUserRestore);
    return () => window.removeEventListener("usersRestored", handleUserRestore);
  }, []);

  const handleManualRestore = async () => {
    setIsRestoring(true);
    try {
      const result = await userRestoreService.restoreDefaultUsers();
      if (result.success) {
        updateStats();
        setLastRestore(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Erro na restauração manual:", error);
    } finally {
      setIsRestoring(false);
    }
  };

  const isHealthy = stats.appUsers > 0 && stats.mockUsers > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Database className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">
            Estado dos Utilizadores
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {isHealthy ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <button
            onClick={updateStats}
            className="text-gray-400 hover:text-gray-600"
            title="Atualizar"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="text-center">
          <div
            className={`text-lg font-bold ${stats.appUsers > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {stats.appUsers}
          </div>
          <div className="text-xs text-gray-500">App Users</div>
        </div>
        <div className="text-center">
          <div
            className={`text-lg font-bold ${stats.mockUsers > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {stats.mockUsers}
          </div>
          <div className="text-xs text-gray-500">Mock Users</div>
        </div>
        <div className="text-center">
          <div
            className={`text-lg font-bold ${stats.totalUnique > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {stats.totalUnique}
          </div>
          <div className="text-xs text-gray-500">Total Únicos</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${isHealthy ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-gray-600">
            {isHealthy ? "Sistema funcionando" : "Utilizadores em falta"}
          </span>
        </div>

        {lastRestore && (
          <span className="text-gray-500">Último restore: {lastRestore}</span>
        )}
      </div>

      {!isHealthy && (
        <button
          onClick={handleManualRestore}
          disabled={isRestoring}
          className="mt-3 w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isRestoring ? (
            <div className="flex items-center justify-center">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Restaurando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Users className="h-4 w-4 mr-2" />
              Restaurar Utilizadores
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default UserDiagnostic;
