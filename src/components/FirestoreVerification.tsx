import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import FirestoreActivationSteps from "./FirestoreActivationSteps";

interface FirestoreStatus {
  isAvailable: boolean;
  canRead: boolean;
  canWrite: boolean;
  error?: string;
  details?: string;
  isLoading: boolean;
}

export const FirestoreVerification: React.FC = () => {
  const [status, setStatus] = useState<FirestoreStatus>({
    isAvailable: false,
    canRead: false,
    canWrite: false,
    isLoading: true,
  });

  const verifyFirestore = async () => {
    setStatus((prev) => ({ ...prev, isLoading: true, error: undefined }));

    try {
      console.log("🔍 VERIFICAÇÃO FIRESTORE: Iniciando testes...");

      // Import Firebase config
      const { getDB } = await import("../firebase/config");

      // Test 1: Basic connection
      console.log("📡 Teste 1: Conectividade básica...");
      const db = await getDB();

      if (!db) {
        setStatus({
          isAvailable: false,
          canRead: false,
          canWrite: false,
          error: "Firestore service not available",
          details: "Firebase Database service not initialized",
          isLoading: false,
        });
        return;
      }

      console.log("✅ Conectividade básica: OK");

      // Test 2: Read operation
      console.log("📖 Teste 2: Operação de leitura...");
      let canRead = false;
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const testCollection = collection(db, "users");
        await getDocs(testCollection);
        canRead = true;
        console.log("✅ Leitura: OK");
      } catch (readError: any) {
        console.warn("⚠️ Leitura falhou:", readError.message);
        canRead = false;
      }

      // Test 3: Write operation
      console.log("✏️ Teste 3: Operação de escrita...");
      let canWrite = false;
      try {
        const { collection, doc, setDoc } = await import("firebase/firestore");
        const testDoc = doc(collection(db, "system"), "firestore_test");
        await setDoc(testDoc, {
          test: true,
          timestamp: new Date().toISOString(),
          purpose: "Firestore connectivity verification",
        });
        canWrite = true;
        console.log("✅ Escrita: OK");
      } catch (writeError: any) {
        console.warn("⚠️ Escrita falhou:", writeError.message);
        canWrite = false;
      }

      // Final status
      const isFullyWorking = canRead && canWrite;

      if (isFullyWorking) {
        console.log("🎉 FIRESTORE TOTALMENTE FUNCIONAL!");
        setStatus({
          isAvailable: true,
          canRead: true,
          canWrite: true,
          details: "Firestore está ativo e funcionando perfeitamente",
          isLoading: false,
        });
      } else if (canRead && !canWrite) {
        console.log("⚠️ Firestore parcialmente funcional (só leitura)");
        setStatus({
          isAvailable: true,
          canRead: true,
          canWrite: false,
          error: "Write permissions restricted",
          details:
            "Firestore está ativo mas as regras de segurança podem estar muito restritivas",
          isLoading: false,
        });
      } else {
        console.log("❌ Firestore não está funcionando corretamente");
        setStatus({
          isAvailable: false,
          canRead: false,
          canWrite: false,
          error: "Firestore not properly configured",
          details: "Verifique se o Firestore está ativado no Firebase Console",
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error("❌ ERRO CRÍTICO na verificação:", error);

      let errorMessage = "Erro desconhecido";
      let details = error.message || "";

      if (
        error.message?.includes("firestore") ||
        error.message?.includes("not available")
      ) {
        errorMessage = "Firestore service not enabled";
        details = "O serviço Firestore não está ativado no projeto Firebase";
      } else if (
        error.message?.includes("permission") ||
        error.message?.includes("PERMISSION_DENIED")
      ) {
        errorMessage = "Permission denied";
        details = "Regras de segurança do Firestore muito restritivas";
      } else if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        errorMessage = "Network connectivity issue";
        details = "Problema de conectividade com Firebase";
      }

      setStatus({
        isAvailable: false,
        canRead: false,
        canWrite: false,
        error: errorMessage,
        details: details,
        isLoading: false,
      });
    }
  };

  // Auto-verify on mount
  useEffect(() => {
    verifyFirestore();
  }, []);

  const getStatusIcon = () => {
    if (status.isLoading) {
      return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />;
    }

    if (status.isAvailable && status.canRead && status.canWrite) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }

    if (status.isAvailable && status.canRead) {
      return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }

    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const getStatusText = () => {
    if (status.isLoading) {
      return "Verificando Firestore...";
    }

    if (status.isAvailable && status.canRead && status.canWrite) {
      return "✅ Firestore ATIVO e funcionando!";
    }

    if (status.isAvailable && status.canRead) {
      return "⚠️ Firestore parcialmente funcional";
    }

    return "❌ Firestore NÃO está ativo";
  };

  const getStatusColor = () => {
    if (status.isLoading) return "border-blue-200 bg-blue-50";
    if (status.isAvailable && status.canRead && status.canWrite)
      return "border-green-200 bg-green-50";
    if (status.isAvailable && status.canRead)
      return "border-yellow-200 bg-yellow-50";
    return "border-red-200 bg-red-50";
  };

  return (
    <div className={`p-4 border-2 rounded-lg ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-3">
        {getStatusIcon()}
        <h3 className="font-semibold text-lg">{getStatusText()}</h3>
        <button
          onClick={verifyFirestore}
          disabled={status.isLoading}
          className="ml-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Re-testar
        </button>
      </div>

      {/* Detailed Status */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Conectividade:</span>
          {status.isAvailable ? (
            <span className="text-green-600">✅ Conectado</span>
          ) : (
            <span className="text-red-600">❌ Não conectado</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Leitura:</span>
          {status.canRead ? (
            <span className="text-green-600">✅ Funciona</span>
          ) : (
            <span className="text-red-600">❌ Falha</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Escrita:</span>
          {status.canWrite ? (
            <span className="text-green-600">✅ Funciona</span>
          ) : (
            <span className="text-red-600">❌ Falha</span>
          )}
        </div>

        {status.details && (
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
            <strong>Detalhes:</strong> {status.details}
          </div>
        )}

        {status.error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs">
            <strong>Erro:</strong> {status.error}
          </div>
        )}
      </div>

      {/* Detailed activation guide when Firestore is not working */}
      {!status.canWrite && (
        <div className="mt-4">
          <FirestoreActivationSteps />
        </div>
      )}
    </div>
  );
};

export default FirestoreVerification;
