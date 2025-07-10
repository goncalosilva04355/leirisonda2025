import React, { useState } from "react";
import {
  Bug,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { authService } from "../services/authService";
import UserSyncManager from "../utils/userSyncManager";
import FirebaseStatusChecker from "./FirebaseStatusChecker";
import EmergencyFirebaseFix from "./EmergencyFirebaseFix";
import FirestoreActivationGuide from "./FirestoreActivationGuide";
import FirestoreVerification from "./FirestoreVerification";

export const LoginDebugHelper: React.FC = () => {
  const [testEmail, setTestEmail] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugResults, setDebugResults] = useState<any>(null);

  const runFullLoginDiagnostic = async () => {
    if (!testEmail || !testPassword) {
      alert("Por favor, insira email e password para testar");
      return;
    }

    setIsRunning(true);
    setDebugResults(null);

    const results: any = {
      timestamp: new Date().toISOString(),
      testCredentials: {
        email: testEmail,
        passwordLength: testPassword.length,
      },
      userExists: {},
      mockAuthTest: {},
      localStorageCheck: {},
      authServiceTest: {},
      syncTest: {},
    };

    try {
      // 1. Check if user exists in different systems
      console.log("🔍 Step 1: Checking user existence...");
      const userExistsResult = UserSyncManager.userExists(testEmail);
      results.userExists = {
        inLocal: userExistsResult.inLocal,
        inMock: userExistsResult.inMock,
        userData: userExistsResult.user,
      };

      // 2. Test mock auth directly
      console.log("🔍 Step 2: Testing mock auth directly...");
      try {
        const mockResult = await mockAuthService.login(testEmail, testPassword);
        results.mockAuthTest = {
          success: mockResult.success,
          error: mockResult.error,
          user: mockResult.user
            ? {
                uid: mockResult.user.uid,
                email: mockResult.user.email,
                name: mockResult.user.name,
                role: mockResult.user.role,
                active: mockResult.user.active,
              }
            : null,
        };
      } catch (error: any) {
        results.mockAuthTest = {
          success: false,
          error: error.message,
          exception: true,
        };
      }

      // 3. Check localStorage directly
      console.log("🔍 Step 3: Checking localStorage...");
      try {
        const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
        const mockUsers = JSON.parse(
          localStorage.getItem("mock-users") || "[]",
        );

        const appUser = appUsers.find(
          (u: any) => u.email?.toLowerCase() === testEmail.toLowerCase(),
        );
        const mockUser = mockUsers.find(
          (u: any) => u.email?.toLowerCase() === testEmail.toLowerCase(),
        );

        results.localStorageCheck = {
          appUsersTotal: appUsers.length,
          mockUsersTotal: mockUsers.length,
          foundInAppUsers: !!appUser,
          foundInMockUsers: !!mockUser,
          appUserData: appUser
            ? {
                id: appUser.id,
                email: appUser.email,
                name: appUser.name,
                role: appUser.role,
                active: appUser.active,
                passwordMatches: appUser.password === testPassword,
              }
            : null,
          mockUserData: mockUser
            ? {
                uid: mockUser.uid,
                email: mockUser.email,
                name: mockUser.name,
                role: mockUser.role,
                active: mockUser.active,
                passwordMatches: mockUser.password === testPassword,
              }
            : null,
        };
      } catch (error: any) {
        results.localStorageCheck = {
          error: error.message,
          exception: true,
        };
      }

      // 4. Test authService login
      console.log("🔍 Step 4: Testing authService login...");
      try {
        const authResult = await authService.login(testEmail, testPassword);
        results.authServiceTest = {
          success: authResult.success,
          error: authResult.error,
          user: authResult.user
            ? {
                uid: authResult.user.uid,
                email: authResult.user.email,
                name: authResult.user.name,
                role: authResult.user.role,
                active: authResult.user.active,
              }
            : null,
        };
      } catch (error: any) {
        results.authServiceTest = {
          success: false,
          error: error.message,
          exception: true,
        };
      }

      // 5. Test sync
      console.log("🔍 Step 5: Testing sync...");
      try {
        const syncResult = UserSyncManager.performFullSync();
        results.syncTest = syncResult;
      } catch (error: any) {
        results.syncTest = {
          error: error.message,
          exception: true,
        };
      }

      setDebugResults(results);
      console.log("🔍 Full diagnostic complete:", results);
    } catch (error: any) {
      console.error("🔍 Diagnostic failed:", error);
      setDebugResults({
        error: "Diagnostic failed: " + error.message,
        exception: true,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const StatusIcon = ({ condition }: { condition: boolean }) => {
    return condition ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Bug className="h-5 w-5 mr-2 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Diagnóstico Completo de Login
        </h3>
      </div>

      <div className="space-y-4">
        {/* Firebase Status Check */}
        <FirebaseStatusChecker />

        {/* Firestore Configuration Check */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-3">
            Verificação do Firestore
          </h4>
          <FirestoreVerification />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email a testar
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password a testar
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={runFullLoginDiagnostic}
          disabled={isRunning}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />A executar
              diagnóstico completo...
            </>
          ) : (
            <>
              <Bug className="h-4 w-4 mr-2" />
              Executar Diagnóstico Completo
            </>
          )}
        </button>

        {debugResults && (
          <div className="mt-6 space-y-4">
            <h4 className="text-md font-semibold text-gray-900">
              Resultados do Diagnóstico:
            </h4>

            {/* User Existence Check */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">
                1. Existência do Utilizador
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Existe no armazenamento local:</span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon condition={debugResults.userExists?.inLocal} />
                    <span
                      className={
                        debugResults.userExists?.inLocal
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugResults.userExists?.inLocal ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Existe no mock auth:</span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon condition={debugResults.userExists?.inMock} />
                    <span
                      className={
                        debugResults.userExists?.inMock
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugResults.userExists?.inMock ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Auth Test */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">
                2. Teste Mock Auth Direto
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Login bem-sucedido:</span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon
                      condition={debugResults.mockAuthTest?.success}
                    />
                    <span
                      className={
                        debugResults.mockAuthTest?.success
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugResults.mockAuthTest?.success ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>
                {debugResults.mockAuthTest?.error && (
                  <div className="text-red-600">
                    Erro: {debugResults.mockAuthTest.error}
                  </div>
                )}
              </div>
            </div>

            {/* LocalStorage Check */}
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">
                3. Verificação localStorage
              </h5>
              <div className="space-y-1 text-sm">
                <div>
                  Total app-users:{" "}
                  {debugResults.localStorageCheck?.appUsersTotal || 0}
                </div>
                <div>
                  Total mock-users:{" "}
                  {debugResults.localStorageCheck?.mockUsersTotal || 0}
                </div>
                <div className="flex items-center justify-between">
                  <span>Encontrado em app-users:</span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon
                      condition={
                        debugResults.localStorageCheck?.foundInAppUsers
                      }
                    />
                    <span
                      className={
                        debugResults.localStorageCheck?.foundInAppUsers
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugResults.localStorageCheck?.foundInAppUsers
                        ? "Sim"
                        : "Não"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Encontrado em mock-users:</span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon
                      condition={
                        debugResults.localStorageCheck?.foundInMockUsers
                      }
                    />
                    <span
                      className={
                        debugResults.localStorageCheck?.foundInMockUsers
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugResults.localStorageCheck?.foundInMockUsers
                        ? "Sim"
                        : "Não"}
                    </span>
                  </div>
                </div>
                {debugResults.localStorageCheck?.mockUserData && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span>Password correta (mock):</span>
                      <div className="flex items-center space-x-1">
                        <StatusIcon
                          condition={
                            debugResults.localStorageCheck.mockUserData
                              .passwordMatches
                          }
                        />
                        <span
                          className={
                            debugResults.localStorageCheck.mockUserData
                              .passwordMatches
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {debugResults.localStorageCheck.mockUserData
                            .passwordMatches
                            ? "Sim"
                            : "Não"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AuthService Test */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">
                4. Teste AuthService
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Login bem-sucedido:</span>
                  <div className="flex items-center space-x-1">
                    <StatusIcon
                      condition={debugResults.authServiceTest?.success}
                    />
                    <span
                      className={
                        debugResults.authServiceTest?.success
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugResults.authServiceTest?.success ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>
                {debugResults.authServiceTest?.error && (
                  <div className="text-red-600">
                    Erro: {debugResults.authServiceTest.error}
                  </div>
                )}
              </div>
            </div>

            {/* User Migration */}
            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    🔄 Migração de Utilizadores para Firestore
                  </h3>
                </div>

                <div className="text-sm text-blue-800 mb-4">
                  <p className="mb-2">
                    <strong>
                      Se outros dados estão na database mas utilizadores não
                      funcionam:
                    </strong>
                  </p>
                  <p>
                    Os utilizadores podem estar apenas no localStorage. Esta
                    migração move-os para o Firestore.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    setIsRunning(true);
                    try {
                      console.log("🔄 Starting user migration...");

                      const { MigrateUsersToFirestore } = await import(
                        "../utils/migrateUsersToFirestore"
                      );
                      const result =
                        await MigrateUsersToFirestore.migrateAllUsers();

                      if (result.success) {
                        alert(
                          `✅ Migração concluída!\n\nMigrados: ${result.migrated}\nJá existiam: ${result.skipped}\nFalharam: ${result.failed}\n\nTeste agora o login em modo anónimo!`,
                        );
                      } else {
                        alert(
                          `❌ Migração falhou:\n\n${result.details.join("\n")}`,
                        );
                      }

                      // Re-run diagnostics
                      runFullLoginDiagnostic();
                    } catch (error: any) {
                      console.error("Migration error:", error);
                      alert(`❌ Erro na migração: ${error.message}`);
                    } finally {
                      setIsRunning(false);
                    }
                  }}
                  disabled={isRunning}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center font-bold"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />A
                      migrar utilizadores...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      🔄 MIGRAR UTILIZADORES PARA FIRESTORE
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Firestore Activation Guide - Show when service is not available */}
            {debugResults &&
              (debugResults.authServiceTest?.error?.includes(
                "Service firestore is not available",
              ) ||
                debugResults.authServiceTest?.error?.includes(
                  "getImmediate",
                )) && (
                <div className="mt-6">
                  <FirestoreActivationGuide />
                </div>
              )}

            {/* Emergency Fix */}
            <div className="mt-6">
              <EmergencyFirebaseFix />
            </div>

            {/* Raw Data */}
            <details className="bg-gray-100 rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-gray-900">
                Dados Completos (Debug)
              </summary>
              <pre className="mt-2 text-xs overflow-auto max-h-96">
                {JSON.stringify(debugResults, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginDebugHelper;
