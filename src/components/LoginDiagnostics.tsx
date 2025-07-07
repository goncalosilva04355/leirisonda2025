import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  Lock,
  Mail,
  Settings,
} from "lucide-react";
import UserSyncManager from "../utils/userSyncManager";

interface LoginDiagnosticsProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  password?: string;
}

export const LoginDiagnostics: React.FC<LoginDiagnosticsProps> = ({
  isOpen,
  onClose,
  email = "",
  password = "",
}) => {
  const [testEmail, setTestEmail] = useState(email);
  const [testPassword, setTestPassword] = useState(password);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = () => {
    if (!testEmail) {
      alert("Por favor, insira um email para testar");
      return;
    }

    setIsRunning(true);

    // Get user diagnostics
    const result = UserSyncManager.getLoginDiagnostics(testEmail, testPassword);
    setDiagnostics(result);

    // Perform sync and get results
    const sync = UserSyncManager.performFullSync();
    setSyncResult(sync);

    setIsRunning(false);
  };

  const StatusIcon = ({ condition }: { condition: boolean }) => {
    return condition ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="h-6 w-6 mr-2 text-blue-600" />
                Diagnóstico de Login
              </h2>
              <p className="text-gray-600">
                Ferramenta para diagnosticar problemas de autenticação
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Test Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Testar Credenciais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="password"
                />
              </div>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              {isRunning ? "A executar..." : "Executar Diagnóstico"}
            </button>
          </div>

          {/* Diagnostics Results */}
          {diagnostics && (
            <div className="space-y-6">
              {/* Authentication Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Estado da Autenticação
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Utilizador existe no sistema:
                    </span>
                    <div className="flex items-center space-x-2">
                      <StatusIcon condition={diagnostics.userExists} />
                      <span
                        className={
                          diagnostics.userExists
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {diagnostics.userExists ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Email registado:
                    </span>
                    <div className="flex items-center space-x-2">
                      <StatusIcon condition={diagnostics.emailExists} />
                      <span
                        className={
                          diagnostics.emailExists
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {diagnostics.emailExists ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Password correta:
                    </span>
                    <div className="flex items-center space-x-2">
                      <StatusIcon condition={diagnostics.passwordMatches} />
                      <span
                        className={
                          diagnostics.passwordMatches
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {diagnostics.passwordMatches ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Conta ativa:</span>
                    <div className="flex items-center space-x-2">
                      <StatusIcon condition={diagnostics.isActive} />
                      <span
                        className={
                          diagnostics.isActive
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {diagnostics.isActive ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {diagnostics.suggestions &&
                diagnostics.suggestions.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-yellow-800">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Sugestões para Resolver o Problema
                    </h3>
                    <ul className="space-y-2">
                      {diagnostics.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-yellow-700 flex items-start"
                          >
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {suggestion}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {/* Sync Results */}
              {syncResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Resultado da Sincronização
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">
                        Utilizadores locais:
                      </span>
                      <span className="text-sm font-semibold text-blue-800">
                        {syncResult.localUsers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">
                        Utilizadores mock auth:
                      </span>
                      <span className="text-sm font-semibold text-blue-800">
                        {syncResult.mockUsers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">
                        Sincronização bem-sucedida:
                      </span>
                      <div className="flex items-center space-x-2">
                        <StatusIcon condition={syncResult.synced} />
                        <span
                          className={
                            syncResult.synced
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {syncResult.synced ? "Sim" : "Não"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Overall Status */}
              <div
                className={`border rounded-lg p-4 ${
                  diagnostics.userExists &&
                  diagnostics.passwordMatches &&
                  diagnostics.isActive
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 flex items-center ${
                    diagnostics.userExists &&
                    diagnostics.passwordMatches &&
                    diagnostics.isActive
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {diagnostics.userExists &&
                  diagnostics.passwordMatches &&
                  diagnostics.isActive ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Login Deve Funcionar
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 mr-2" />
                      Problema Identificado
                    </>
                  )}
                </h3>
                <p
                  className={`text-sm ${
                    diagnostics.userExists &&
                    diagnostics.passwordMatches &&
                    diagnostics.isActive
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {diagnostics.userExists &&
                  diagnostics.passwordMatches &&
                  diagnostics.isActive
                    ? "Todas as verificações passaram. O login deve funcionar normalmente."
                    : "Foi identificado um problema que impede o login. Siga as sugestões acima para resolver."}
                </p>
              </div>
            </div>
          )}

          {/* Close button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDiagnostics;
