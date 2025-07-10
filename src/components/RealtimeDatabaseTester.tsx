import React, { useState } from "react";
import {
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface RealtimeTestResult {
  success: boolean;
  message?: string;
  error?: string;
  suggestion?: string;
  connected?: boolean;
  databaseURL?: string;
}

export const RealtimeDatabaseTester: React.FC = () => {
  const [testResult, setTestResult] = useState<RealtimeTestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [showRulesGuide, setShowRulesGuide] = useState(false);

  const runRealtimeTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Import the test function
      const { testRealtimeDatabase } = await import(
        "../firebase/realtimeDatabase"
      );

      console.log("🧪 Iniciando teste do Realtime Database...");
      const result = await testRealtimeDatabase();

      console.log("📊 Resultado do teste:", result);
      setTestResult(result);
    } catch (error: any) {
      console.error("❌ Erro no teste:", error);
      setTestResult({
        success: false,
        error: error.message,
        suggestion:
          "Verifique se o Realtime Database está ativado no Firebase Console",
      });
    } finally {
      setTesting(false);
    }
  };

  const openFirebaseConsole = () => {
    window.open(
      "https://console.firebase.google.com/project/leiria-1cfc9/database",
      "_blank",
    );
  };

  const getStatusIcon = () => {
    if (testing) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
    }
    if (!testResult) {
      return <Database className="h-5 w-5 text-gray-500" />;
    }
    return testResult.success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = () => {
    if (testing) return "border-blue-200 bg-blue-50";
    if (!testResult) return "border-gray-200 bg-gray-50";
    return testResult.success
      ? "border-green-200 bg-green-50"
      : "border-red-200 bg-red-50";
  };

  return (
    <div className="max-w-md mx-auto">
      <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">
              Teste Realtime Database
            </h3>
            <p className="text-sm text-gray-600">Firebase Realtime Database</p>
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={runRealtimeTest}
          disabled={testing}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors mb-3"
        >
          {testing ? "Testando..." : "🧪 Testar Conectividade"}
        </button>

        {/* Results */}
        {testResult && (
          <div className="space-y-3">
            <div
              className={`p-3 rounded-md ${
                testResult.success
                  ? "bg-green-100 border border-green-200"
                  : "bg-red-100 border border-red-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {testResult.success ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`font-medium ${
                    testResult.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {testResult.success ? "✅ Conectado" : "❌ Erro de Conexão"}
                </span>
              </div>

              {testResult.message && (
                <p
                  className={`text-sm ${
                    testResult.success ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {testResult.message}
                </p>
              )}

              {testResult.error && (
                <p className="text-sm text-red-700 font-medium">
                  Erro: {testResult.error}
                </p>
              )}

              {testResult.databaseURL && (
                <p className="text-xs text-gray-600 mt-2">
                  URL: {testResult.databaseURL}
                </p>
              )}
            </div>

            {/* Suggestions */}
            {testResult.suggestion && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <h4 className="font-medium text-yellow-800 text-sm mb-1">
                  💡 Sugestão:
                </h4>
                <p className="text-sm text-yellow-700">
                  {testResult.suggestion}
                </p>
              </div>
            )}

            {/* Firebase Console Link */}
            <div className="space-y-2">
              <button
                onClick={openFirebaseConsole}
                className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Abrir Firebase Console</span>
              </button>

              <button
                onClick={() => setShowRulesGuide(!showRulesGuide)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>{showRulesGuide ? "Ocultar" : "Ver"} Guia de Regras</span>
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!testResult && !testing && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
            <h4 className="font-medium text-blue-800 mb-2">
              🔧 Para ativar o Realtime Database:
            </h4>
            <ol className="text-blue-700 space-y-1 text-xs">
              <li>1. Clique em "Abrir Firebase Console"</li>
              <li>2. Vá para "Realtime Database"</li>
              <li>3. Clique "Create database"</li>
              <li>4. Escolha "europe-west1"</li>
              <li>5. Configure as regras de segurança</li>
            </ol>
          </div>
        )}

        {/* Rules Guide */}
        {showRulesGuide && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Configuração de Regras de Segurança
              </h4>

              {/* Quick Rules */}
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900 text-sm">
                      🔧 Desenvolvimento (Recomendado)
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(`{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}`)
                      }
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="text-blue-700 text-xs mb-2">
                    Permite acesso apenas a utilizadores autenticados
                  </p>
                  <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto">
                    {`{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}`}
                  </pre>
                </div>

                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-900 text-sm">
                      🧪 Teste (Temporário)
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`)
                      }
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="text-red-700 text-xs mb-1">
                    ⚠️ Acesso total sem autenticação
                  </p>
                  <p className="text-red-600 text-xs mb-2">
                    APENAS para teste rápido!
                  </p>
                  <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto">
                    {`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
                  </pre>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-600">
                <p>1. Copie uma das regras acima</p>
                <p>2. Abra o Firebase Console → Realtime Database → Rules</p>
                <p>3. Cole as regras e clique "Publish"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeDatabaseTester;
