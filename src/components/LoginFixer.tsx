import React, { useState } from "react";
import {
  AlertCircle,
  UserCheck,
  Settings,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import {
  runCompleteUserFix,
  diagnoseUserLoginIssues,
  UserLoginIssue,
} from "../utils/userLoginFix";

export const LoginFixer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [diagnosis, setDiagnosis] = useState<UserLoginIssue[]>([]);
  const [result, setResult] = useState<{
    passwordsFixed: number;
    usersCreated: number;
    errors: string[];
  } | null>(null);

  const runDiagnosis = () => {
    console.log("🔍 Running user login diagnosis...");
    const issues = diagnoseUserLoginIssues();
    setDiagnosis(issues);
  };

  const runFix = async () => {
    setIsRunning(true);
    try {
      const fixResult = runCompleteUserFix();
      setResult({
        passwordsFixed: fixResult.passwordsFixed,
        usersCreated: fixResult.usersCreated,
        errors: fixResult.errors,
      });
      setDiagnosis(fixResult.diagnosis);

      // Show success message
      const message =
        `✅ Correção Completa!\n\n` +
        `🔑 Passwords corrigidas: ${fixResult.passwordsFixed}\n` +
        `👤 Utilizadores criados: ${fixResult.usersCreated}\n` +
        `❌ Erros: ${fixResult.errors.length}\n\n` +
        `Sistema limpo para criação manual de utilizadores`;

      alert(message);
    } catch (error: any) {
      alert(`❌ Erro na correção: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Correção de Login
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={runDiagnosis}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
          >
            <Settings className="h-4 w-4" />
            <span>Diagnosticar</span>
          </button>
          <button
            onClick={runFix}
            disabled={isRunning}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
            <span>{isRunning ? "A corrigir..." : "Corrigir Tudo"}</span>
          </button>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded p-3">
        <h4 className="text-sm font-medium text-orange-800 mb-2">
          Estado do Sistema:
        </h4>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Sistema limpo de utilizadores antigos</li>
          <li>• Apenas super admin disponível</li>
          <li>• Pronto para criação manual de novos utilizadores</li>
        </ul>
      </div>

      {/* Diagnosis Results */}
      {diagnosis.length > 0 && (
        <div className="border border-gray-200 rounded p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Diagnóstico de Utilizadores:
          </h4>
          <div className="space-y-2">
            {diagnosis.map((issue, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <div>
                  <span className="font-medium">{issue.name}</span>
                  <span className="text-gray-600 ml-2">({issue.email})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      issue.found
                        ? issue.active
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {issue.found
                      ? issue.active
                        ? "✅ Ativo"
                        : "⚠️ Inativo"
                      : "❌ Não encontrado"}
                  </span>
                  <span className="text-xs text-gray-500">{issue.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fix Results */}
      {result && (
        <div className="border border-green-200 bg-green-50 rounded p-3">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h4 className="text-sm font-medium text-green-800">
              Resultados da Correção:
            </h4>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <div>
              🔑 Passwords corrigidas: <strong>{result.passwordsFixed}</strong>
            </div>
            <div>
              👤 Utilizadores criados: <strong>{result.usersCreated}</strong>
            </div>
            {result.errors.length > 0 && (
              <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded">
                <div className="text-red-800 font-medium">Erros:</div>
                {result.errors.map((error, index) => (
                  <div key={index} className="text-red-700 text-xs">
                    • {error}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Como usar:</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>
            Clique em <strong>"Diagnosticar"</strong> para ver o estado atual
          </li>
          <li>
            Clique em <strong>"Corrigir Tudo"</strong> para resolver todos os
            problemas
          </li>
          <li>Tente fazer login com as credenciais corrigidas</li>
          <li>Se ainda houver problemas, execute novamente</li>
        </ol>
      </div>

      {/* Credenciais disponíveis */}
      <div className="bg-gray-50 border border-gray-200 rounded p-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Credenciais Disponíveis:
        </h4>
        <div className="text-sm text-gray-700 space-y-1 font-mono">
          <div>
            • <strong>Super Admin:</strong> gongonsilva@gmail.com / 19867gsf
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Para criar novos utilizadores, use a interface de administração
          </div>
        </div>
      </div>
    </div>
  );
};
