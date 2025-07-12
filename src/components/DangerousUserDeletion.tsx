import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Users,
  Trash2,
  Shield,
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Zap,
} from "lucide-react";
import {
  userDeletionService,
  UserDeletionResult,
} from "../services/userDeletionService";
import {
  completeUserCleanupService,
  CompleteCleanupResult,
} from "../services/completeUserCleanup";

interface UserStats {
  firestore: number;
  localStorage: number;
  mockAuth: number;
  total: number;
}

export const DangerousUserDeletion: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    firestore: 0,
    localStorage: 0,
    mockAuth: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<UserDeletionResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [confirmationText, setConfirmationText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [nuclearCleanupResult, setNuclearCleanupResult] =
    useState<CompleteCleanupResult | null>(null);
  const [showNuclearConfirm, setShowNuclearConfirm] = useState(false);

  // Load user statistics on component mount
  useEffect(() => {
    refreshUserStats();
  }, []);

  const refreshUserStats = async () => {
    setRefreshing(true);
    try {
      const stats = await userDeletionService.getUserStatistics();
      setUserStats(stats);
      console.log("📊 User statistics:", stats);
    } catch (error) {
      console.error("❌ Failed to load user statistics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteAllUsers = async () => {
    setIsLoading(true);
    setLastResult(null);

    try {
      console.log("🚨 Starting dangerous user deletion process...");
      const result = await userDeletionService.deleteAllUsersExceptSuperAdmin();
      setLastResult(result);

      if (result.success) {
        // Refresh statistics after successful deletion
        await refreshUserStats();

        // Reset confirmation state
        setShowConfirmation(false);
        setConfirmationStep(0);
        setConfirmationText("");

        console.log("✅ User deletion completed successfully");
      } else {
        console.error("❌ User deletion failed:", result.message);
      }
    } catch (error: any) {
      console.error("💥 Critical error during user deletion:", error);
      setLastResult({
        success: false,
        message: `❌ Erro crítico: ${error.message}`,
        details: {
          firebaseUsersDeleted: 0,
          firestoreUsersDeleted: 0,
          localStorageUsersDeleted: 0,
          mockAuthUsersDeleted: 0,
          superAdminPreserved: false,
          errors: [error.message],
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNuclearCleanup = async () => {
    setIsLoading(true);
    setNuclearCleanupResult(null);

    try {
      console.log("💥 STARTING NUCLEAR USER CLEANUP...");
      const result = await completeUserCleanupService.nuclearUserCleanup();
      setNuclearCleanupResult(result);

      if (result.success) {
        // Refresh statistics after nuclear cleanup
        await refreshUserStats();

        // Reset confirmation state
        setShowNuclearConfirm(false);

        console.log("🚀 Nuclear cleanup completed successfully");

        // Force page reload to clear any remaining auth state
        setTimeout(() => {
          alert(
            "✅ Limpeza nuclear completa! A página irá recarregar para garantir que não há sessões antigas.",
          );
          window.location.reload();
        }, 2000);
      } else {
        console.error("❌ Nuclear cleanup failed:", result.message);
      }
    } catch (error: any) {
      console.error("���� Critical error during nuclear cleanup:", error);
      setNuclearCleanupResult({
        success: false,
        message: `❌ Erro crítico na limpeza nuclear: ${error.message}`,
        details: {
          localStorageKeysCleared: [] as string[],
          sessionStorageCleared: false,
          superAdminRecreated: false,
          errors: [error.message],
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startConfirmationProcess = () => {
    setShowConfirmation(true);
    setConfirmationStep(1);
    setConfirmationText("");
    setLastResult(null);
  };

  const handleConfirmationNext = () => {
    switch (confirmationStep) {
      case 1:
        if (confirmationText.toLowerCase() === "eliminar") {
          setConfirmationStep(2);
          setConfirmationText("");
        }
        break;
      case 2:
        if (confirmationText.toLowerCase() === "goncalo") {
          setConfirmationStep(3);
          setConfirmationText("");
        }
        break;
      case 3:
        if (confirmationText === "DANGER-DELETE-ALL-USERS") {
          handleDeleteAllUsers();
        }
        break;
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationStep(0);
    setConfirmationText("");
    setShowNuclearConfirm(false);
  };

  const getTotalUsersToDelete = () => {
    return Math.max(0, userStats.total - 1); // Subtract 1 for super admin
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-PT");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            💀 ZONA DE PERIGO
          </h2>
          <p className="text-red-700">
            Eliminar completamente todos os utilizadores exceto o super admin
          </p>
        </div>
        <button
          onClick={refreshUserStats}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Critical Warning */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-8 w-8 text-red-600 mt-1 mr-4 flex-shrink-0" />
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-red-900">
              ⚠️ OPERAÇÃO EXTREMAMENTE PERIGOSA ⚠️
            </h3>
            <div className="text-red-800 space-y-2">
              <p className="font-semibold">
                Esta operação irá ELIMINAR PERMANENTEMENTE todos os utilizadores
                do sistema, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Todas as contas de utilizador no Firebase</li>
                <li>Todos os perfis de utilizador no Firestore</li>
                <li>Todos os utilizadores no armazenamento local</li>
                <li>Todas as sessões ativas (exceto super admin)</li>
              </ul>
              <p className="font-semibold text-red-900">
                ✅ ÚNICO UTILIZADOR PRESERVADO: Gonçalo Fonseca
                (gongonsilva@gmail.com)
              </p>
              <p className="font-bold text-red-900 text-lg">
                🚨 ESTA AÇÃO É IRREVERSÍVEL! 🚨
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estatísticas de Utilizadores
          </h3>
          {refreshing && (
            <div className="flex items-center text-sm text-gray-500">
              <RefreshCw className="h-4 w-4 animate-spin mr-1" />A atualizar...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Firestore</p>
                <p className="text-2xl font-bold text-blue-700">
                  {userStats.firestore}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">
                  Local Storage
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {userStats.localStorage}
                </p>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900">Mock Auth</p>
                <p className="text-2xl font-bold text-purple-700">
                  {userStats.mockAuth}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">A Eliminar</p>
                <p className="text-2xl font-bold text-red-700">
                  {getTotalUsersToDelete()}
                </p>
              </div>
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Super Admin preservado: Gonçalo Fonseca (gongonsilva@gmail.com)
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Process */}
      {!showConfirmation ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Executar Eliminação
          </h3>

          {getTotalUsersToDelete() === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  Não há utilizadores adicionais para eliminar. Apenas o super
                  admin existe.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={startConfirmationProcess}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Trash2 className="h-6 w-6" />
                <span>
                  💀 ELIMINAR {getTotalUsersToDelete()} UTILIZADOR
                  {getTotalUsersToDelete() !== 1 ? "ES" : ""}
                </span>
              </button>

              <div className="border-t border-red-200 pt-4">
                <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    💥 OPÇÃO NUCLEAR
                  </h4>
                  <p className="text-red-800 text-sm mb-3">
                    Se a eliminação normal não funcionou e ainda consegue entrar
                    com utilizadores antigos, use esta opção que limpa
                    COMPLETAMENTE todos os dados de autenticação.
                  </p>
                  <p className="text-red-900 font-semibold text-sm">
                    ⚠️ Esta opção força o recarregamento da página após a
                    limpeza!
                  </p>
                </div>

                {!showNuclearConfirm ? (
                  <button
                    onClick={() => setShowNuclearConfirm(true)}
                    disabled={isLoading}
                    className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 animate-pulse"
                  >
                    <Zap className="h-5 w-5" />
                    <span>💥 LIMPEZA NUCLEAR COMPLETA</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-red-800 font-semibold text-center">
                      Digite "NUCLEAR" para confirmar a limpeza completa:
                    </p>
                    <input
                      type="text"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-center font-mono"
                      placeholder="Digite: NUCLEAR"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowNuclearConfirm(false);
                          setConfirmationText("");
                        }}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleNuclearCleanup}
                        disabled={confirmationText !== "NUCLEAR" || isLoading}
                        className="flex-1 bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />A
                            limpar...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4" />
                            EXECUTAR NUCLEAR
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Confirmation Steps
        <div className="bg-white rounded-lg border-2 border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Confirmação de Segurança - Passo {confirmationStep}/3
          </h3>

          {confirmationStep === 1 && (
            <div className="space-y-4">
              <p className="text-red-800">
                Digite <strong>"eliminar"</strong> para confirmar que compreende
                que esta ação é irreversível:
              </p>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Digite: eliminar"
                autoFocus
              />
            </div>
          )}

          {confirmationStep === 2 && (
            <div className="space-y-4">
              <p className="text-red-800">
                Digite o nome do super admin que será preservado{" "}
                <strong>"goncalo"</strong>:
              </p>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Digite: goncalo"
                autoFocus
              />
            </div>
          )}

          {confirmationStep === 3 && (
            <div className="space-y-4">
              <p className="text-red-800">
                <strong>ÚLTIMA CONFIRMAÇÃO:</strong> Digite exatamente{" "}
                <strong>"DANGER-DELETE-ALL-USERS"</strong> para executar:
              </p>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                placeholder="Digite: DANGER-DELETE-ALL-USERS"
                autoFocus
              />
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={cancelConfirmation}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirmationNext}
              disabled={
                (confirmationStep === 1 &&
                  confirmationText.toLowerCase() !== "eliminar") ||
                (confirmationStep === 2 &&
                  confirmationText.toLowerCase() !== "goncalo") ||
                (confirmationStep === 3 &&
                  confirmationText !== "DANGER-DELETE-ALL-USERS") ||
                isLoading
              }
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />A eliminar...
                </>
              ) : confirmationStep === 3 ? (
                <>
                  <Zap className="h-4 w-4" />
                  EXECUTAR ELIMINAÇÃO
                </>
              ) : (
                "Continuar"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Nuclear Cleanup Result */}
      {nuclearCleanupResult && (
        <div
          className={`rounded-lg border-2 p-6 ${
            nuclearCleanupResult.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {nuclearCleanupResult.success ? (
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="space-y-3 flex-1">
              <h4
                className={`font-semibold ${
                  nuclearCleanupResult.success
                    ? "text-green-900"
                    : "text-red-900"
                }`}
              >
                💥 Resultado da Limpeza Nuclear
              </h4>

              <p
                className={`${
                  nuclearCleanupResult.success
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {nuclearCleanupResult.message}
              </p>

              {/* Detailed Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Chaves Limpas</div>
                  <div className="font-bold text-blue-600">
                    {
                      nuclearCleanupResult.details.localStorageKeysCleared
                        .length
                    }
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Session Storage</div>
                  <div
                    className={`font-bold ${
                      nuclearCleanupResult.details.sessionStorageCleared
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {nuclearCleanupResult.details.sessionStorageCleared
                      ? "✅ Limpo"
                      : "❌ Falhou"}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Super Admin</div>
                  <div
                    className={`font-bold ${
                      nuclearCleanupResult.details.superAdminRecreated
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {nuclearCleanupResult.details.superAdminRecreated
                      ? "✅ Recriado"
                      : "❌ Falhou"}
                  </div>
                </div>
              </div>

              {/* Cleared Keys */}
              {nuclearCleanupResult.details.localStorageKeysCleared.length >
                0 && (
                <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded">
                  <h5 className="font-medium text-blue-900 mb-2">
                    Chaves localStorage Limpas:
                  </h5>
                  <div className="text-sm text-blue-800 space-y-1 max-h-32 overflow-y-auto">
                    {nuclearCleanupResult.details.localStorageKeysCleared.map(
                      (key, index) => (
                        <div key={index} className="font-mono">
                          • {key}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Errors */}
              {nuclearCleanupResult.details.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded">
                  <h5 className="font-medium text-red-900 mb-2">Erros:</h5>
                  <ul className="text-sm text-red-800 space-y-1">
                    {nuclearCleanupResult.details.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Last Result */}
      {lastResult && (
        <div
          className={`rounded-lg border-2 p-6 ${
            lastResult.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {lastResult.success ? (
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="space-y-3 flex-1">
              <h4
                className={`font-semibold ${
                  lastResult.success ? "text-green-900" : "text-red-900"
                }`}
              >
                Resultado da Eliminação
              </h4>

              <p
                className={`${
                  lastResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {lastResult.message}
              </p>

              {/* Detailed Results */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Firebase</div>
                  <div className="font-bold text-blue-600">
                    {lastResult.details.firebaseUsersDeleted}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Firestore</div>
                  <div className="font-bold text-purple-600">
                    {lastResult.details.firestoreUsersDeleted}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Local Storage</div>
                  <div className="font-bold text-green-600">
                    {lastResult.details.localStorageUsersDeleted}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Mock Auth</div>
                  <div className="font-bold text-orange-600">
                    {lastResult.details.mockAuthUsersDeleted}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Super Admin</div>
                  <div
                    className={`font-bold ${
                      lastResult.details.superAdminPreserved
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {lastResult.details.superAdminPreserved
                      ? "✅ Preservado"
                      : "❌ Perdido"}
                  </div>
                </div>
              </div>

              {/* Errors */}
              {lastResult.details.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded">
                  <h5 className="font-medium text-red-900 mb-2">Erros:</h5>
                  <ul className="text-sm text-red-800 space-y-1">
                    {lastResult.details.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Informações Importantes
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>O que esta operação faz:</strong> Remove todos os
            utilizadores de todos os sistemas (Firebase Auth, Firestore,
            localStorage, mock auth) exceto o super admin Gonçalo.
          </p>
          <p>
            <strong>Super Admin preservado:</strong> Gonçalo Fonseca
            (gongonsilva@gmail.com) será sempre mantido com todas as permissões.
          </p>
          <p>
            <strong>Sistemas afetados:</strong> Firebase Authentication,
            Firestore users collection, localStorage (app-users, mock-users),
            mock authentication service.
          </p>
          <p>
            <strong>Sessões:</strong> Todas as sessões ativas serão limpas,
            exceto se o super admin estiver atualmente logado.
          </p>
          <p className="text-red-700 font-semibold">
            <strong>⚠️ ATENÇÃO:</strong> Esta operação é completamente
            irreversível. Todos os dados de utilizador serão perdidos
            permanentemente.
          </p>
        </div>
      </div>
    </div>
  );
};
