import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  User,
  Settings,
  HelpCircle,
  ArrowRight,
  XCircle,
} from "lucide-react";

import UserSyncManager from "../utils/userSyncManager";

interface AuthTroubleshootingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthTroubleshootingGuide: React.FC<
  AuthTroubleshootingGuideProps
> = ({ isOpen, onClose }) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [isRunningSync, setIsRunningSync] = useState(false);

  const runQuickSync = async () => {
    setIsRunningSync(true);
    try {
      const result = UserSyncManager.performFullSync();
      setSyncResult(result);
    } catch (error) {
      setSyncResult({ synced: false, error: "Erro na sincronização" });
    }
    setIsRunningSync(false);
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
                <HelpCircle className="h-6 w-6 mr-2 text-orange-600" />
                Guia de Resolução de Problemas de Login
              </h2>
              <p className="text-gray-600">
                Soluções para quando utilizadores existem mas não conseguem
                fazer login
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Problem Description */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Problema Comum Identificado
                </h3>
                <p className="text-orange-700 text-sm leading-relaxed">
                  <strong>Sintoma:</strong> Aparece a mensagem "Este email já
                  está registado no sistema" ao criar um utilizador, mas quando
                  tenta fazer login com essas credenciais, não funciona.
                </p>
                <p className="text-orange-700 text-sm leading-relaxed mt-2">
                  <strong>Causa:</strong> O sistema utiliza múltiplos
                  armazenamentos de utilizadores que podem ficar
                  dessincronizados (localStorage local vs sistema de
                  autenticação).
                </p>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Soluções Rápidas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      1. Sincronização Automática
                    </h4>
                    <p className="text-sm text-gray-600">
                      Sincroniza todos os utilizadores entre os diferentes
                      sistemas de autenticação
                    </p>
                  </div>
                  <button
                    onClick={runQuickSync}
                    disabled={isRunningSync}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center"
                  >
                    {isRunningSync ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    {isRunningSync ? "A sincronizar..." : "Sincronizar"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      2. Diagnóstico Avançado
                    </h4>
                    <p className="text-sm text-gray-600">
                      Analisa credenciais específicas e identifica problemas
                      exactos
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDiagnostics(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Diagnóstico
                  </button>
                </div>
              </div>
            </div>

            {/* Sync Results */}
            {syncResult && (
              <div
                className={`border rounded-lg p-4 ${
                  syncResult.synced
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 flex items-center ${
                    syncResult.synced ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {syncResult.synced ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2" />
                  )}
                  Resultado da Sincronização
                </h3>
                {syncResult.synced ? (
                  <div className="text-green-700 text-sm space-y-1">
                    <p>✅ Sincronização concluída com sucesso!</p>
                    <p>
                      📊 Utilizadores sincronizados: {syncResult.localUsers}{" "}
                      local, {syncResult.mockUsers} autenticação
                    </p>
                    <p>
                      🎉 Os utilizadores devem agora conseguir fazer login
                      normalmente.
                    </p>
                  </div>
                ) : (
                  <div className="text-red-700 text-sm">
                    <p>
                      ❌ Erro na sincronização:{" "}
                      {syncResult.error || "Erro desconhecido"}
                    </p>
                    <p>
                      💡 Tente usar o diagnóstico avançado para identificar o
                      problema específico.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step by Step Guide */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Guia Passo-a-Passo para Resolver Problemas de Login
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Verificar se o utilizador existe
                    </h4>
                    <p className="text-sm text-gray-600">
                      Na gestão de utilizadores, confirme se o utilizador
                      aparece na lista com estado "Ativo"
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Executar sincronização
                    </h4>
                    <p className="text-sm text-gray-600">
                      Clique no botão "Sincronizar" (verde) na gestão de
                      utilizadores ou use o botão acima
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Testar login</h4>
                    <p className="text-sm text-gray-600">
                      Tente fazer login novamente. Se ainda não funcionar, passe
                      ao passo 4
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Diagnóstico avançado
                    </h4>
                    <p className="text-sm text-gray-600">
                      Use a ferramenta de diagnóstico para identificar o
                      problema específico (password incorreta, conta inativa,
                      etc.)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Recriar utilizador (último recurso)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Se nada funcionar, elimine o utilizador problemático e
                      crie-o novamente com uma password diferente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prevention Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Dicas para Prevenir Problemas Futuros
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  Sempre teste o login imediatamente após criar um novo
                  utilizador
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  Use passwords únicas para cada utilizador (evite reutilizar
                  passwords)
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  Execute sincronização periódica se criar muitos utilizadores
                  de uma vez
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  Mantenha registo das credenciais dos utilizadores criados
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Fechar Guia
            </button>
          </div>
        </div>
      </div>

      {/* Diagnostics Modal */}
      <LoginDiagnostics
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
      />
    </div>
  );
};

export default AuthTroubleshootingGuide;
