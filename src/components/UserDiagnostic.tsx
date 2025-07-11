import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Users,
  Database,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import UserSyncTest from "./UserSyncTest";

export const UserDiagnostic: React.FC = () => {
  const [diagnosticData, setDiagnosticData] = useState({
    authorizedUsers: [] as any[],
    appUsers: [] as any[],
    localStorageKeys: [] as string[],
    timestamp: new Date().toISOString(),
  });

  const runDiagnostic = () => {
    try {
      // Verificar localStorage - authorizedUsers
      const authorizedUsers = JSON.parse(
        localStorage.getItem("authorizedUsers") || "[]",
      );

      // Verificar localStorage - app-users
      const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");

      // Verificar todas as chaves do localStorage
      const allKeys = Object.keys(localStorage);

      setDiagnosticData({
        authorizedUsers,
        appUsers,
        localStorageKeys: allKeys,
        timestamp: new Date().toISOString(),
      });

      console.log("=== DIAGNÓSTICO DE UTILIZADORES ===");
      console.log("📝 authorizedUsers:", authorizedUsers);
      console.log("👥 app-users:", appUsers);
      console.log("🔑 localStorage keys:", allKeys);
    } catch (error) {
      console.error("❌ Erro no diagnóstico:", error);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Diagnóstico de Utilizadores
          </h2>
        </div>
        <button
          onClick={runDiagnostic}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      <div className="space-y-6">
        {/* Utilizadores Autorizados */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Database className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium">
              Utilizadores Autorizados ({diagnosticData.authorizedUsers.length})
            </h3>
            {diagnosticData.authorizedUsers.length > 0 ? (
              <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 ml-2" />
            )}
          </div>
          {diagnosticData.authorizedUsers.length > 0 ? (
            <div className="space-y-2">
              {diagnosticData.authorizedUsers.map((user, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded border flex justify-between"
                >
                  <div>
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-600 ml-2">({user.email})</span>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600">
              Nenhum utilizador autorizado encontrado!
            </p>
          )}
        </div>

        {/* App Users */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Users className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium">
              App Users ({diagnosticData.appUsers.length})
            </h3>
            {diagnosticData.appUsers.length > 0 ? (
              <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 ml-2" />
            )}
          </div>
          {diagnosticData.appUsers.length > 0 ? (
            <div className="space-y-2">
              {diagnosticData.appUsers.map((user, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded border flex justify-between"
                >
                  <div>
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-600 ml-2">({user.email})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {user.role}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600">Nenhum app user encontrado!</p>
          )}
        </div>

        {/* LocalStorage Keys */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Database className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium">
              LocalStorage Keys ({diagnosticData.localStorageKeys.length})
            </h3>
          </div>
          <div className="max-h-40 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {diagnosticData.localStorageKeys.map((key, index) => (
                <span
                  key={index}
                  className="text-sm bg-white px-2 py-1 rounded border"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-sm text-gray-500 text-center">
          Última atualização:{" "}
          {new Date(diagnosticData.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
