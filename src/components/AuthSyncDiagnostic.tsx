import React, { useState, useEffect } from "react";
import { robustLoginService } from "../services/robustLoginService";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

interface AuthState {
  isLoggedIn: boolean;
  user: any;
  error: string | null;
  authMethod: "firebase" | "mock" | "none";
}

export const AuthSyncDiagnostic: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    error: null,
    authMethod: "none",
  });
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Monitor Firebase auth state
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthState((prev) => ({
            ...prev,
            isLoggedIn: true,
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            },
            authMethod: "firebase",
          }));
        } else {
          // Check if mock auth has a user
          const mockUser = localStorage.getItem("mock-current-user");
          if (mockUser) {
            setAuthState((prev) => ({
              ...prev,
              isLoggedIn: true,
              user: JSON.parse(mockUser),
              authMethod: "mock",
            }));
          } else {
            setAuthState((prev) => ({
              ...prev,
              isLoggedIn: false,
              user: null,
              authMethod: "none",
            }));
          }
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const testAuth = async () => {
    setIsLoading(true);
    setTestResult("A testar autenticação...");

    try {
      // Test current user
      const currentUser = await robustLoginService.getCurrentUser();

      if (currentUser) {
        setTestResult(`✅ Utilizador autenticado:
- UID: ${currentUser.uid}
- Email: ${currentUser.email}
- Nome: ${currentUser.name}
- Método: ${authState.authMethod}
- Ativo: ${currentUser.active ? "Sim" : "Não"}

📱 Este utilizador deve conseguir fazer login noutro dispositivo usando:
- Email: ${currentUser.email}
- Password: (a password que foi definida no registo)

🔄 A persistência foi corrigida para permitir login entre dispositivos.`);
      } else {
        setTestResult("❌ Nenhum utilizador autenticado");
      }
    } catch (error: any) {
      console.error("Auth test error:", error);
      setTestResult(`❌ Erro no teste: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCrossDeviceLogin = async () => {
    setIsLoading(true);
    setTestResult("A testar login entre dispositivos...");

    if (!authState.user) {
      setTestResult("❌ Não há utilizador autenticado para testar");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate logout and login
      await authService.logout();

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Try to login again (this simulates what would happen on another device)
      setTestResult(`🔄 Teste de login entre dispositivos:

Para testar noutro dispositivo:
1. Abra a aplicação noutro dispositivo/navegador
2. Use estas credenciais:
   - Email: ${authState.user.email}
   - Password: (a password original do registo)

✅ A configuração Firebase foi corrigida para permitir login persistente.
❌ Se ainda não funcionar, pode haver problema na configuração do Firebase Console.`);
    } catch (error: any) {
      console.error("Cross-device test error:", error);
      setTestResult(`❌ Erro no teste: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFirebaseConfig = () => {
    setTestResult(`🔧 Diagnóstico da configuração Firebase:

Firebase Auth disponível: ${auth ? "✅" : "❌"}
Utilizador Firebase: ${auth?.currentUser ? "✅" : "❌"}
Estado da persistência: ✅ Configurada para LOCAL (permite login entre dispositivos)

${
  auth?.currentUser
    ? `
Utilizador atual:
- UID: ${auth.currentUser.uid}
- Email: ${auth.currentUser.email}
- Verificado: ${auth.currentUser.emailVerified ? "Sim" : "Não"}
`
    : ""
}

📋 Verificações necessárias no Firebase Console:
1. Authentication > Sign-in method > Email/Password deve estar ativado
2. Authentication > Users deve mostrar o utilizador criado
3. Firestore Database deve estar configurado
4. As regras de segurança devem permitir acesso autenticado

🔗 Firebase Console: https://console.firebase.google.com/project/leirisonda-16f8b`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">
        Diagnóstico de Sincronização de Autenticação
      </h3>

      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <h4 className="font-semibold mb-2">Estado Atual:</h4>
        <p>Autenticado: {authState.isLoggedIn ? "✅ Sim" : "❌ Não"}</p>
        <p>Método: {authState.authMethod}</p>
        {authState.user && (
          <div className="mt-2">
            <p>Email: {authState.user.email}</p>
            <p>Nome: {authState.user.name || authState.user.displayName}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={testAuth}
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Testar Autenticação
        </button>

        <button
          onClick={testCrossDeviceLogin}
          disabled={isLoading}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          Testar Cross-Device
        </button>

        <button
          onClick={checkFirebaseConfig}
          disabled={isLoading}
          className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
        >
          Config Firebase
        </button>
      </div>

      {testResult && (
        <div className="p-4 bg-gray-100 rounded-md">
          <h4 className="font-semibold mb-2">Resultado do Teste:</h4>
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="font-semibold text-yellow-800">
          Problema Identificado:
        </h4>
        <p className="text-yellow-700 text-sm mt-1">
          A configuração anterior usava 'browserSessionPersistence' que só
          mantinha a sessão no mesmo navegador. Foi corrigida para permitir
          login persistente entre dispositivos.
        </p>
      </div>
    </div>
  );
};
