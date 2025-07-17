import React, { useState } from "react";
import { authServiceWrapperSafe } from "../services/authServiceWrapperSafe";

export const LoginTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testValidLogin = async () => {
    setIsLoading(true);
    addResult("🔄 Testando login válido...");

    try {
      const result = await authServiceWrapperSafe.login(
        "gongonsilva@gmail.com",
        "123456",
        false,
      );

      if (result.success) {
        addResult("✅ Login válido funcionou!");
        addResult(`👤 Usuário: ${result.user?.email}`);
      } else {
        addResult(`❌ Login válido falhou: ${result.error}`);
      }
    } catch (error: any) {
      addResult(`❌ Erro no login válido: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testInvalidEmail = async () => {
    setIsLoading(true);
    addResult("🔄 Testando email inválido...");

    try {
      const result = await authServiceWrapperSafe.login(
        "email_inexistente@gmail.com",
        "123456",
        false,
      );

      if (!result.success) {
        addResult("✅ Email inválido corretamente rejeitado");
        addResult(`📝 Erro: ${result.error}`);
      } else {
        addResult("❌ Email inválido deveria ter sido rejeitado");
      }
    } catch (error: any) {
      addResult(`❌ Erro no teste de email inválido: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testWeakPassword = async () => {
    setIsLoading(true);
    addResult("🔄 Testando senha fraca...");

    try {
      const result = await authServiceWrapperSafe.login(
        "gongonsilva@gmail.com",
        "12", // Senha muito fraca
        false,
      );

      if (!result.success) {
        addResult("✅ Senha fraca corretamente rejeitada");
        addResult(`📝 Erro: ${result.error}`);
      } else {
        addResult("❌ Senha fraca deveria ter sido rejeitada");
      }
    } catch (error: any) {
      addResult(`❌ Erro no teste de senha fraca: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthStatus = () => {
    addResult("🔄 Verificando status de autenticação...");

    const isAuth = authServiceWrapperSafe.isAuthenticated();
    const currentUser = authServiceWrapperSafe.getCurrentUser();

    addResult(`🔐 Autenticado: ${isAuth ? "SIM" : "NÃO"}`);
    addResult(
      `👤 Usuário atual: ${currentUser ? currentUser.email : "Nenhum"}`,
    );

    const authorizedEmails = authServiceWrapperSafe.getAuthorizedEmails();
    addResult(`📧 Emails autorizados: ${authorizedEmails.join(", ")}`);
  };

  const testLogout = async () => {
    setIsLoading(true);
    addResult("🔄 Testando logout...");

    try {
      await authServiceWrapperSafe.logout();
      addResult("✅ Logout realizado com sucesso");

      // Verificar se realmente fez logout
      const isAuth = authServiceWrapperSafe.isAuthenticated();
      addResult(
        `🔐 Status após logout: ${isAuth ? "AINDA AUTENTICADO" : "DESCONECTADO"}`,
      );
    } catch (error: any) {
      addResult(`❌ Erro no logout: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        🧪 Teste de Autenticação
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <button
          onClick={testValidLogin}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          ✅ Login Válido
        </button>

        <button
          onClick={testInvalidEmail}
          disabled={isLoading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          ❌ Email Inválido
        </button>

        <button
          onClick={testWeakPassword}
          disabled={isLoading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          🔑 Senha Fraca
        </button>

        <button
          onClick={testAuthStatus}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          🔍 Status Auth
        </button>

        <button
          onClick={testLogout}
          disabled={isLoading}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          🚪 Logout
        </button>

        <button
          onClick={clearResults}
          disabled={isLoading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          🗑️ Limpar
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto">
        <h3 className="font-bold mb-2">📋 Resultados dos Testes:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500 italic">
            Clique nos botões acima para executar os testes...
          </p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="text-sm font-mono p-2 bg-white rounded border"
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>📧 Emails válidos:</strong> gongonsilva@gmail.com,
          goncalosfonseca@gmail.com
        </p>
        <p>
          <strong>🔑 Senhas válidas:</strong> 123, 123456, 19867gsf (ou qualquer
          senha com 3+ caracteres)
        </p>
      </div>
    </div>
  );
};

export default LoginTest;
