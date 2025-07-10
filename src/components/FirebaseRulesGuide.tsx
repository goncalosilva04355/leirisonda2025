import React, { useState } from "react";
import {
  Copy,
  ExternalLink,
  Shield,
  Database,
  CheckCircle,
} from "lucide-react";

export const FirebaseRulesGuide: React.FC = () => {
  const [copiedRule, setCopiedRule] = useState<string | null>(null);

  const copyToClipboard = (text: string, ruleType: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRule(ruleType);
      setTimeout(() => setCopiedRule(null), 2000);
    });
  };

  const developmentRules = `{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}`;

  const testingRules = `{
  "rules": {
    ".read": true,
    ".write": true
  }
}`;

  const productionRules = `{
  "rules": {
    "users": {
      "$userId": {
        ".read": "$userId === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'super_admin'",
        ".write": "$userId === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'super_admin'"
      }
    },
    "obras": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('permissions').child('obras').child('create').val() === true || root.child('users').child(auth.uid).child('permissions').child('obras').child('edit').val() === true"
    },
    "piscinas": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('permissions').child('piscinas').child('create').val() === true || root.child('users').child(auth.uid).child('permissions').child('piscinas').child('edit').val() === true"
    },
    "manutencoes": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('permissions').child('manutencoes').child('create').val() === true || root.child('users').child(auth.uid).child('permissions').child('manutencoes').child('edit').val() === true"
    },
    "clientes": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('permissions').child('clientes').child('create').val() === true || root.child('users').child(auth.uid).child('permissions').child('clientes').child('edit').val() === true"
    }
  }
}`;

  const RuleCard = ({
    title,
    description,
    rules,
    ruleType,
    bgColor,
    borderColor,
    textColor,
    warning,
  }: {
    title: string;
    description: string;
    rules: string;
    ruleType: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    warning?: string;
  }) => (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-semibold ${textColor}`}>{title}</h4>
        <button
          onClick={() => copyToClipboard(rules, ruleType)}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${textColor.replace("text-", "bg-").replace("-900", "-100")} hover:${textColor.replace("text-", "bg-").replace("-900", "-200")}`}
        >
          {copiedRule === ruleType ? (
            <>
              <CheckCircle className="h-3 w-3" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      <p className={`text-sm mb-3 ${textColor.replace("-900", "-700")}`}>
        {description}
      </p>

      {warning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3">
          <p className="text-yellow-800 text-xs font-medium">⚠️ {warning}</p>
        </div>
      )}

      <pre className="bg-gray-900 text-green-400 p-3 rounded-md text-xs overflow-x-auto font-mono">
        {rules}
      </pre>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Database className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Firebase Realtime Database - Regras de Segurança
          </h2>
        </div>
        <p className="text-gray-600">
          Configure as regras adequadas para o seu ambiente de desenvolvimento
          ou produção
        </p>
      </div>

      <div className="grid gap-6">
        {/* Testing Rules */}
        <RuleCard
          title="🧪 Regras de Teste (Temporário)"
          description="Permite acesso total sem autenticação. Use apenas para testes rápidos."
          rules={testingRules}
          ruleType="testing"
          bgColor="bg-red-50"
          borderColor="border-red-200"
          textColor="text-red-900"
          warning="APENAS PARA TESTE! Remove todas as restrições de segurança."
        />

        {/* Development Rules */}
        <RuleCard
          title="🔧 Regras de Desenvolvimento"
          description="Permite acesso apenas a utilizadores autenticados. Ideal para desenvolvimento."
          rules={developmentRules}
          ruleType="development"
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
          textColor="text-blue-900"
        />

        {/* Production Rules */}
        <RuleCard
          title="🛡️ Regras de Produção"
          description="Regras completas com controlo de permissões baseado em funções. Para ambiente de produção."
          rules={productionRules}
          ruleType="production"
          bgColor="bg-green-50"
          borderColor="border-green-200"
          textColor="text-green-900"
        />
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Como Configurar</h3>
        </div>

        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <span>
              Aceda ao{" "}
              <a
                href="https://console.firebase.google.com/project/leiria-1cfc9/database"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 underline inline-flex items-center"
              >
                Firebase Console <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>
              Clique em <strong>"Realtime Database"</strong> no menu lateral
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>
              Se ainda não existe, clique <strong>"Create database"</strong> e
              escolha <strong>"europe-west1"</strong>
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-xs font-medium">
              4
            </span>
            <span>
              Clique na aba <strong>"Rules"</strong>
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-xs font-medium">
              5
            </span>
            <span>
              Cole uma das regras acima (recomendamos começar com as{" "}
              <strong>regras de desenvolvimento</strong>)
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-xs font-medium">
              6
            </span>
            <span>
              Clique <strong>"Publish"</strong> para aplicar as regras
            </span>
          </li>
        </ol>
      </div>

      {/* Database URL */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-semibold text-orange-900 mb-2">
          URL da Base de Dados
        </h4>
        <div className="flex items-center space-x-2">
          <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
            https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app/
          </code>
          <button
            onClick={() =>
              copyToClipboard(
                "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app/",
                "url",
              )
            }
            className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-xs font-medium transition-colors"
          >
            {copiedRule === "url" ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseRulesGuide;
