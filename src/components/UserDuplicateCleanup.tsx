import React, { useState, useEffect } from "react";
import {
  Users,
  Trash2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  User,
  Database,
  Shield,
} from "lucide-react";
import { UserDuplicateCleanup } from "../utils/userDuplicateCleanup";

interface CleanupResult {
  success: boolean;
  message: string;
  details: string[];
  errors: string[];
}

interface UserSummary {
  mockUsers: any[];
  appUsers: any[];
  firebaseUsers: any[];
  totalDuplicates: number;
}

export const UserDuplicateCleanupComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(
    null,
  );
  const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [needsCleanup, setNeedsCleanup] = useState(false);

  // Load user summary on component mount
  useEffect(() => {
    loadUserSummary();
  }, []);

  const loadUserSummary = async () => {
    try {
      const summary = await UserDuplicateCleanup.getUserSummary();
      setUserSummary(summary);
      const cleanup = await UserDuplicateCleanup.needsCleanup();
      setNeedsCleanup(cleanup);
    } catch (error: any) {
      console.error("Erro ao carregar resumo de utilizadores:", error);
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    setCleanupResult(null);

    try {
      const result = await UserDuplicateCleanup.cleanAllDuplicateUsers();
      setCleanupResult(result);

      // Reload summary after cleanup
      setTimeout(() => {
        loadUserSummary();
      }, 1000);
    } catch (error: any) {
      setCleanupResult({
        success: false,
        message: `Erro durante a limpeza: ${error.message}`,
        details: [],
        errors: [error.message],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserList = (
    users: any[],
    title: string,
    icon: React.ReactNode,
  ) => {
    if (!users || users.length === 0) {
      return (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center text-gray-600 text-sm">
            {icon}
            <span className="ml-2">{title}: Nenhum utilizador</span>
          </div>
        </div>
      );
    }

    const goncaloEmail = "gongonsilva@gmail.com";
    const goncaloUsers = users.filter(
      (user) => (user.email || "").toLowerCase() === goncaloEmail.toLowerCase(),
    );
    const duplicateUsers = users.filter(
      (user) => (user.email || "").toLowerCase() !== goncaloEmail.toLowerCase(),
    );

    return (
      <div className="bg-white border rounded-lg p-3">
        <div className="flex items-center text-gray-700 font-medium mb-2">
          {icon}
          <span className="ml-2">
            {title} ({users.length})
          </span>
        </div>

        {goncaloUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center text-green-600 text-sm mb-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>{user.name || user.email} - Gonçalo Superadmin ✓</span>
          </div>
        ))}

        {duplicateUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center text-red-600 text-sm mb-1"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>
              {user.name || user.email} ({user.email}) - DUPLICADO
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Users className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              Limpeza de Utilizadores Duplicados
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Remove todos os utilizadores duplicados e mantém apenas o Gonçalo
              como superadmin ativo.
            </p>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      {userSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total de Utilizadores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userSummary.mockUsers.length +
                    userSummary.appUsers.length +
                    userSummary.firebaseUsers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Utilizadores Duplicados</p>
                <p className="text-2xl font-bold text-red-600">
                  {userSummary.totalDuplicates}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="text-lg font-semibold">
                  {needsCleanup ? (
                    <span className="text-red-600">Necessita Limpeza</span>
                  ) : (
                    <span className="text-green-600">Limpo</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Users Display */}
      {userSummary && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            Utilizadores Atuais
          </h4>

          {renderUserList(
            userSummary.mockUsers,
            "Mock Auth Storage",
            <Shield className="h-4 w-4" />,
          )}

          {renderUserList(
            userSummary.appUsers,
            "App Users Storage",
            <User className="h-4 w-4" />,
          )}

          {renderUserList(
            userSummary.firebaseUsers,
            "Firebase Storage",
            <Database className="h-4 w-4" />,
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCleanup}
          disabled={isLoading || !needsCleanup}
          className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium ${
            needsCleanup && !isLoading
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />A limpar
              utilizadores...
            </>
          ) : (
            <>
              <Trash2 className="h-5 w-5 mr-2" />
              {needsCleanup
                ? "Limpar Utilizadores Duplicados"
                : "Não há duplicados para limpar"}
            </>
          )}
        </button>

        <button
          onClick={loadUserSummary}
          disabled={isLoading}
          className="flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Atualizar Estado
        </button>
      </div>

      {/* Warning Message */}
      {needsCleanup && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Atenção: Foram encontrados utilizadores duplicados
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                Esta operação irá remover TODOS os utilizadores exceto o Gonçalo
                superadmin. A operação é irreversível e afetará:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc">
                <li>Armazenamento local (localStorage)</li>
                <li>Base de dados Firebase (se disponível)</li>
                <li>Todas as sessões ativas</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {cleanupResult && (
        <div
          className={`border rounded-lg p-4 ${
            cleanupResult.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start">
            {cleanupResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            )}
            <div className="flex-1">
              <h4
                className={`text-sm font-medium ${
                  cleanupResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {cleanupResult.message}
              </h4>

              {cleanupResult.details.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={`text-sm ${
                      cleanupResult.success ? "text-green-700" : "text-red-700"
                    } hover:underline`}
                  >
                    {showDetails ? "Ocultar detalhes" : "Ver detalhes"}
                  </button>

                  {showDetails && (
                    <div className="mt-2 space-y-1">
                      {cleanupResult.details.map((detail, index) => (
                        <p
                          key={index}
                          className={`text-xs ${
                            cleanupResult.success
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {cleanupResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-800">Erros:</p>
                  {cleanupResult.errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-700">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Como funciona:
        </h4>
        <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
          <li>
            Analisa todos os sistemas de armazenamento (localStorage, Firebase)
          </li>
          <li>
            Identifica utilizadores duplicados (todos exceto
            gongonsilva@gmail.com)
          </li>
          <li>Remove utilizadores duplicados de todos os locais</li>
          <li>Mantém apenas o Gonçalo Fonseca como superadmin ativo</li>
          <li>Limpa todas as sessões ativas para força novo login</li>
          <li>Verifica que a limpeza foi bem-sucedida</li>
        </ol>
      </div>
    </div>
  );
};

export default UserDuplicateCleanupComponent;
