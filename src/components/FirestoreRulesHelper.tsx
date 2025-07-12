import React, { useState } from "react";
import { Copy, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import { FirebaseConfigValidator } from "../firebase/configValidator";

export const FirestoreRulesHelper: React.FC = () => {
  const [rulesCopied, setRulesCopied] = useState(false);

  const devRules = FirebaseConfigValidator.getDevFirestoreRules();
  const prodRules = FirebaseConfigValidator.getProdFirestoreRules();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setRulesCopied(true);
      setTimeout(() => setRulesCopied(false), 2000);
    });
  };

  const openFirebaseConsole = () => {
    const projectId = FirebaseConfigValidator.getOfficialConfig().projectId;
    window.open(
      `https://console.firebase.google.com/project/${projectId}/firestore/rules`,
      "_blank",
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Configuração de Regras Firestore
        </h3>
        <button
          onClick={openFirebaseConsole}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Abrir Firebase Console</span>
        </button>
      </div>

      {/* Instruções */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Problema Detectado:</strong> O Firestore está com regras
            restritivas que bloqueiam o acesso. Para testar a aplicação, precisa
            de aplicar regras permissivas.
          </div>
        </div>
      </div>

      {/* Passos de configuração */}
      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">
            Passos para configurar:
          </h4>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Clique no botão "Abrir Firebase Console" acima</li>
            <li>
              Confirme que está no projeto:{" "}
              <code className="bg-gray-200 px-1 rounded">leiria-1cfc9</code>
            </li>
            <li>Vá para "Firestore Database" → "Rules"</li>
            <li>
              Substitua as regras existentes pelas regras de desenvolvimento
            </li>
            <li>Clique em "Publish" para aplicar as alterações</li>
            <li>Volte aqui e teste novamente</li>
          </ol>
        </div>

        {/* Regras de desenvolvimento */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">
              Regras de Desenvolvimento (PERMISSIVAS)
            </h4>
            <button
              onClick={() => copyToClipboard(devRules)}
              className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
            >
              {rulesCopied ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span>{rulesCopied ? "Copiado!" : "Copiar"}</span>
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-3 rounded-md text-xs overflow-x-auto">
            {devRules}
          </pre>
          <div className="mt-2 text-xs text-red-600">
            ⚠️ <strong>Atenção:</strong> Estas regras são apenas para
            desenvolvimento. Altere antes de ir para produção!
          </div>
        </div>

        {/* Regras de produção (para referência futura) */}
        <details className="border border-gray-200 rounded-md">
          <summary className="p-3 bg-gray-50 cursor-pointer font-medium text-gray-900">
            Regras de Produção (SEGURAS) - Para usar mais tarde
          </summary>
          <div className="p-3">
            <pre className="bg-gray-900 text-blue-400 p-3 rounded-md text-xs overflow-x-auto">
              {prodRules}
            </pre>
            <div className="mt-2 text-xs text-gray-600">
              ✅ Estas regras são seguras para produção e requerem autenticação.
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default FirestoreRulesHelper;
