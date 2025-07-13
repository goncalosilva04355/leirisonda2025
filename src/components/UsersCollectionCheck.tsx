import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Users,
  AlertTriangle,
} from "lucide-react";

interface UsersCollectionStatus {
  canAccessUsers: boolean;
  usersCount: number;
  sampleUsers: any[];
  canCreateUser: boolean;
  error?: string;
  details?: string;
  isLoading: boolean;
}

export const UsersCollectionCheck: React.FC = () => {
  const [status, setStatus] = useState<UsersCollectionStatus>({
    canAccessUsers: false,
    usersCount: 0,
    sampleUsers: [],
    canCreateUser: false,
    isLoading: true,
  });

  const checkUsersCollection = async () => {
    setStatus((prev) => ({ ...prev, isLoading: true, error: undefined }));

    try {
      console.log("👥 VERIFICAÇÃO USERS: Testando coleção de utilizadores...");

      const { getDB } = await import("../firebase/config");
      const db = await getDB();

      if (!db) {
        setStatus({
          canAccessUsers: false,
          usersCount: 0,
          sampleUsers: [],
          canCreateUser: false,
          error: "Firestore connection failed",
          details: "Não conseguiu conectar ao Firestore",
          isLoading: false,
        });
        return;
      }

      // Test 1: Read users collection
      console.log("📖 Teste 1: Lendo coleção 'users'...");
      let canAccessUsers = false;
      let usersCount = 0;
      let sampleUsers: any[] = [];

      try {
        const { collection, getDocs, limit, query } = await import(
          "firebase/firestore"
        );
        const usersCollection = collection(db, "users");

        // Get all users count
        const allUsersSnapshot = await getDocs(usersCollection);
        usersCount = allUsersSnapshot.size;

        // Get sample users (first 3)
        const sampleQuery = query(usersCollection, limit(3));
        const sampleSnapshot = await getDocs(sampleQuery);

        sampleUsers = sampleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        canAccessUsers = true;
        console.log(
          `✅ Coleção users acessível: ${usersCount} utilizadores encontrados`,
        );
      } catch (readError: any) {
        console.warn("⚠️ Erro ao ler coleção users:", readError.message);
        canAccessUsers = false;
      }

      // Test 2: Try to create a test user
      console.log("✏️ Teste 2: Testando criação de utilizador...");
      let canCreateUser = false;

      try {
        const { collection, doc, setDoc } = await import("firebase/firestore");
        const testUserId = `test_user_${Date.now()}`;
        const testUserDoc = doc(collection(db, "users"), testUserId);

        await setDoc(testUserDoc, {
          email: "test@firestore.check",
          name: "Test User",
          role: "technician",
          createdAt: new Date().toISOString(),
          isTestUser: true,
        });

        // Try to delete the test user immediately
        const { deleteDoc } = await import("firebase/firestore");
        await deleteDoc(testUserDoc);

        canCreateUser = true;
        console.log("✅ Criação de utilizador: OK");
      } catch (writeError: any) {
        console.warn("⚠️ Erro ao criar utilizador:", writeError.message);
        canCreateUser = false;
      }

      // Final status
      if (canAccessUsers && canCreateUser) {
        console.log("🎉 COLEÇÃO USERS TOTALMENTE FUNCIONAL!");
        setStatus({
          canAccessUsers: true,
          usersCount,
          sampleUsers,
          canCreateUser: true,
          details: `Cole��ão 'users' está funcionando perfeitamente com ${usersCount} utilizadores`,
          isLoading: false,
        });
      } else if (canAccessUsers && !canCreateUser) {
        console.log(
          "⚠️ Pode ler mas não criar utilizadores (regras restritivas)",
        );
        setStatus({
          canAccessUsers: true,
          usersCount,
          sampleUsers,
          canCreateUser: false,
          error: "Write permissions restricted for users collection",
          details: `Pode ler ${usersCount} utilizadores mas não pode criar novos (problema de regras de segurança)`,
          isLoading: false,
        });
      } else {
        console.log("❌ Coleção users não está acessível");
        setStatus({
          canAccessUsers: false,
          usersCount: 0,
          sampleUsers: [],
          canCreateUser: false,
          error: "Users collection not accessible",
          details:
            "Coleção 'users' não está acessível (problema de configuração ou regras)",
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error("❌ ERRO na verificação da coleção users:", error);

      setStatus({
        canAccessUsers: false,
        usersCount: 0,
        sampleUsers: [],
        canCreateUser: false,
        error: error.message || "Unknown error",
        details: "Erro inesperado ao verificar coleção de utilizadores",
        isLoading: false,
      });
    }
  };

  // Auto-check on mount
  useEffect(() => {
    checkUsersCollection();
  }, []);

  const getStatusIcon = () => {
    if (status.isLoading) {
      return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />;
    }

    if (status.canAccessUsers && status.canCreateUser) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }

    if (status.canAccessUsers) {
      return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }

    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const getStatusText = () => {
    if (status.isLoading) {
      return "Verificando coleção 'users'...";
    }

    if (status.canAccessUsers && status.canCreateUser) {
      return "✅ Coleção 'users' funcionando!";
    }

    if (status.canAccessUsers) {
      return "⚠️ Pode ler mas não criar utilizadores";
    }

    return "❌ Coleção 'users' não acessível";
  };

  const getStatusColor = () => {
    if (status.isLoading) return "border-blue-200 bg-blue-50";
    if (status.canAccessUsers && status.canCreateUser)
      return "border-green-200 bg-green-50";
    if (status.canAccessUsers) return "border-yellow-200 bg-yellow-50";
    return "border-red-200 bg-red-50";
  };

  return (
    <div className={`p-4 border-2 rounded-lg ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-3">
        {getStatusIcon()}
        <h3 className="font-semibold text-lg">{getStatusText()}</h3>
        <button
          onClick={checkUsersCollection}
          disabled={status.isLoading}
          className="ml-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Re-testar
        </button>
      </div>

      {/* Detailed Status */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="font-medium">Utilizadores encontrados:</span>
          <span
            className={`font-bold ${status.usersCount > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {status.usersCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Pode ler:</span>
          {status.canAccessUsers ? (
            <span className="text-green-600">✅ Sim</span>
          ) : (
            <span className="text-red-600">❌ Não</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Pode criar:</span>
          {status.canCreateUser ? (
            <span className="text-green-600">✅ Sim</span>
          ) : (
            <span className="text-red-600">❌ Não</span>
          )}
        </div>

        {status.sampleUsers.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium mb-1">Utilizadores existentes:</h4>
            <div className="space-y-1 text-xs bg-gray-100 p-2 rounded">
              {status.sampleUsers.map((user, index) => (
                <div key={index} className="flex justify-between">
                  <span>{user.email || user.id}</span>
                  <span className="text-gray-500">
                    ({user.role || "sem role"})
                  </span>
                </div>
              ))}
              {status.usersCount > status.sampleUsers.length && (
                <div className="text-gray-500 italic">
                  ... e mais {status.usersCount - status.sampleUsers.length}{" "}
                  utilizadores
                </div>
              )}
            </div>
          </div>
        )}

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

      {/* Problem solving hints */}
      {!status.canCreateUser && status.canAccessUsers && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded text-sm">
          <strong>💡 Problema identificado:</strong> As regras de segurança do
          Firestore estão muito restritivas.
          <br />
          <strong>Solução:</strong> Nas regras do Firestore, permita escrita na
          coleção 'users'.
        </div>
      )}

      {!status.canAccessUsers && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded text-sm">
          <strong>🚨 Problema crítico:</strong> Não consegue aceder à coleção
          'users'.
          <br />
          <strong>Possível causa:</strong> Erro na configuração do Firebase ou
          regras muito restritivas.
        </div>
      )}
    </div>
  );
};

export default UsersCollectionCheck;
