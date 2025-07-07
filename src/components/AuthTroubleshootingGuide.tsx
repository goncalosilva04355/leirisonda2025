import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Users,
  Shield,
  XCircle,
} from "lucide-react";

interface AuthTroubleshootingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthTroubleshootingGuide: React.FC<
  AuthTroubleshootingGuideProps
> = ({ isOpen, onClose }) => {
  const [isRunningSync, setIsRunningSync] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            Guia de Resolução de Problemas de Autenticação
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Firebase Only Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Sistema Simplificado
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  A aplicação foi simplificada para usar exclusivamente o
                  Firebase. Não há mais sincronização com localStorage ou
                  migração de utilizadores.
                </p>
              </div>
            </div>
          </div>

          {/* Common Solutions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              Soluções Comuns
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  🔐 Problemas de Login
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Verifique se o email e password estão corretos</li>
                  <li>• Certifique-se de que tem conexão à internet</li>
                  <li>• Tente fazer logout e login novamente</li>
                  <li>• Contacte o administrador se a conta está ativa</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  🌐 Problemas de Conexão
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Verifique a conexão à internet</li>
                  <li>• Tente recarregar a página (F5)</li>
                  <li>• Limpe o cache do navegador</li>
                  <li>• Tente usar um navegador diferente</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  👥 Problemas de Utilizadores
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Todos os utilizadores são geridos no Firebase</li>
                  <li>• Não há mais dados locais ou migração</li>
                  <li>
                    • Contacte o administrador para criar novos utilizadores
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Estado do Sistema
            </h3>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Sistema de Autenticação
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-700">Firebase Ativo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Precisa de Mais Ajuda?
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Se os problemas persistirem, contacte o administrador do
                  sistema com detalhes específicos sobre o erro que está a
                  ocorrer.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
