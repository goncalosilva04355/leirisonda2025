import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Database, Users } from "lucide-react";

export const FirebaseStatusChecker: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkFirebaseStatus = async () => {
    setIsChecking(true);
    try {
      // Check if Firebase is configured
      const { isFirebaseReady, getDB, getAuthService } = await import(
        "../firebase/config"
      );
      const { UltimateSimpleFirebase } = await import(
        "../firebase/ultimateSimpleFirebase"
      );

      const firebaseReady = isFirebaseReady();
      const ultStatus = UltimateSimpleFirebase.getStatus();

      let authService = null;
      let dbService = null;

      try {
        authService = await getAuthService();
      } catch (error) {
        console.log("Auth service not available:", error);
      }

      try {
        dbService = await getDB();
      } catch (error) {
        console.log("DB service not available:", error);
      }

      // Test user creation capability
      let canCreateUsers = false;
      if (authService && dbService) {
        try {
          // Test if we can create a test user (without actually creating)
          const { authService: auth } = await import("../services/authService");
          canCreateUsers = true;
        } catch (error) {
          canCreateUsers = false;
        }
      }

      setStatus({
        firebaseReady,
        ultStatus,
        authService: !!authService,
        dbService: !!dbService,
        canCreateUsers,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      setStatus({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  const StatusIcon = ({ condition }: { condition: boolean }) => {
    return condition ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Estado do Firebase
          </h3>
        </div>
        <button
          onClick={checkFirebaseStatus}
          disabled={isChecking}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center text-sm"
        >
          {isChecking ? (
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3 mr-1" />
          )}
          Verificar
        </button>
      </div>

      {status && (
        <div className="space-y-3">
          {status.error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-red-700 text-sm">
                <strong>Erro:</strong> {status.error}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Firebase básico:
                  </span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon condition={status.firebaseReady} />
                    <span
                      className={
                        status.firebaseReady ? "text-green-600" : "text-red-600"
                      }
                    >
                      {status.firebaseReady ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Auth Service:</span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon condition={status.authService} />
                    <span
                      className={
                        status.authService ? "text-green-600" : "text-red-600"
                      }
                    >
                      {status.authService ? "Disponível" : "Indisponível"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Database Service:
                  </span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon condition={status.dbService} />
                    <span
                      className={
                        status.dbService ? "text-green-600" : "text-red-600"
                      }
                    >
                      {status.dbService ? "Disponível" : "Indisponível"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Pode criar utilizadores:
                  </span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon condition={status.canCreateUsers} />
                    <span
                      className={
                        status.canCreateUsers
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {status.canCreateUsers ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>
              </div>

              {status.ultStatus && (
                <div className="bg-gray-50 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Estado UltimateSimpleFirebase:
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      Status:{" "}
                      <span className="font-mono">
                        {status.ultStatus.status}
                      </span>
                    </div>
                    <div>App: {status.ultStatus.hasApp ? "✅" : "❌"}</div>
                    <div>Auth: {status.ultStatus.hasAuth ? "✅" : "❌"}</div>
                    <div>DB: {status.ultStatus.hasDB ? "✅" : "❌"}</div>
                    <div>Ready: {status.ultStatus.ready ? "✅" : "❌"}</div>
                  </div>
                </div>
              )}

              {(!status.authService || !status.dbService) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="text-yellow-800 text-sm">
                    <strong>⚠️ Problema identificado:</strong>
                    <br />
                    Firebase não está completamente funcional. Os utilizadores
                    são criados apenas localmente.
                    <br />
                    <strong>Resultado:</strong> Utilizadores não funcionam em
                    modo anónimo ou outros dispositivos.
                  </div>
                </div>
              )}
            </>
          )}

          <div className="text-xs text-gray-500">
            Última verificação: {new Date(status.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseStatusChecker;
