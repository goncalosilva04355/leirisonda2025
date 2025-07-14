import React, { useState, useEffect, useCallback } from "react";
import { Database } from "lucide-react";
import {
  saveLoginAttempt,
  testFirestoreConnection,
} from "../services/firestoreDataService";
import { FirebaseAlwaysOnStatus } from "../components/FirebaseAlwaysOnStatus";
import { LoginHints } from "../components/LoginHints";
import NetlifyEnvChecker from "../components/NetlifyEnvChecker";

interface LoginPageProps {
  onLogin: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  loginError: string;
  isLoading?: boolean;
}

export const LoginPageFixed: React.FC<LoginPageProps> = ({
  onLogin,
  loginError,
  isLoading = false,
}) => {
  // Initialize state with factory functions for safer initialization
  const [loginForm, setLoginForm] = useState(() => ({
    email: "",
    password: "",
  }));
  const [rememberMe, setRememberMe] = useState(() => false);
  const [firestoreStatus, setFirestoreStatus] = useState<
    "checking" | "ready" | "error"
  >("checking");
  const [lastSaveId, setLastSaveId] = useState<string | null>(null);

  // Load saved credentials from sessionStorage for "remember me" functionality
  useEffect(() => {
    try {
      console.log("🔄 Loading saved credentials...");
      const savedCredentials = sessionStorage.getItem("savedLoginCredentials");
      if (savedCredentials) {
        try {
          const {
            email,
            password,
            rememberMe: savedRememberMe,
          } = JSON.parse(savedCredentials);

          console.log("📋 Found saved credentials:", {
            email,
            hasPassword: !!password,
            rememberMe: savedRememberMe,
          });

          if (savedRememberMe && email && password) {
            setLoginForm({ email: email || "", password: password || "" });
            setRememberMe(true);
            console.log("📋 Auto-filled login form from saved credentials");

            // AUTO-LOGIN: Temporariamente desabilitado para evitar bloqueios
            console.log(
              "ℹ️ Auto-login temporariamente desabilitado para evitar bloqueios",
            );
            console.log("📋 Credenciais preenchidas - login manual necessário");
          } else {
            console.log("⚠️ Incomplete saved credentials, skipping auto-login");
          }
        } catch (error) {
          console.error("❌ Error loading saved credentials:", error);
          sessionStorage.removeItem("savedLoginCredentials");
        }
      } else {
        console.log("📭 No saved credentials found");
      }
    } catch (error) {
      console.error("�� Error in LoginPage useEffect:", error);
    }
  }, [onLogin]);

  // Check Firestore connection status
  useEffect(() => {
    const checkFirestore = async () => {
      console.log("🔄 Verificando conexão com Firestore...");
      try {
        const isConnected = await testFirestoreConnection();
        if (isConnected) {
          setFirestoreStatus("ready");
          console.log("✅ Firestore pronto para gravação de dados");
        } else {
          setFirestoreStatus("error");
          console.warn(
            "⚠️ Firestore não disponível - dados serão salvos localmente",
          );
        }
      } catch (error) {
        console.error("❌ Erro ao verificar Firestore:", error);
        setFirestoreStatus("error");
      }
    };

    checkFirestore();
  }, []);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault();

        console.log("🚀 LoginPage: Form submitted");
        console.log("📧 Email:", loginForm.email);
        console.log("🔐 Password length:", loginForm.password?.length || 0);

        // Basic validation
        if (!loginForm.email.trim() || !loginForm.password.trim()) {
          console.warn("❌ LoginPage: Empty fields detected");
          return; // Let HTML5 validation handle this
        }

        // Gravar dados no Firestore antes do login
        console.log("💾 Salvando dados de login no Firestore...");
        try {
          const saveId = await saveLoginAttempt({
            email: loginForm.email.trim(),
            rememberMe: rememberMe,
            // Não gravar a password por segurança
          });

          if (saveId) {
            setLastSaveId(saveId);
            console.log(`✅ Dados gravados no Firestore com ID: ${saveId}`);
          } else {
            console.warn(
              "⚠️ Falha ao gravar no Firestore - continuando com login",
            );
          }
        } catch (firestoreError) {
          console.error("❌ Erro ao gravar no Firestore:", firestoreError);
          // Continuar com o login mesmo se a gravação falhar
        }

        // Save credentials if remember me is checked (using sessionStorage + Firebase persistence)
        if (rememberMe) {
          console.log("💾 Saving credentials for auto-login");
          sessionStorage.setItem(
            "savedLoginCredentials",
            JSON.stringify({
              email: loginForm.email.trim(),
              password: loginForm.password,
              rememberMe: true,
            }),
          );
        } else {
          sessionStorage.removeItem("savedLoginCredentials");
        }

        console.log("�� LoginPage: Calling onLogin function...");
        await onLogin(loginForm.email.trim(), loginForm.password, rememberMe);
        console.log("✅ LoginPage: onLogin completed");
      } catch (error) {
        console.error("❌ LoginPage: Login form error:", error);
      }
    },
    [loginForm.email, loginForm.password, rememberMe, onLogin],
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginForm((prev) => ({ ...prev, email: e.target.value }));
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginForm((prev) => ({ ...prev, password: e.target.value }));
    },
    [],
  );

  const handleRememberMeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(e.target.checked);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Logo Leirisonda */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 mx-auto border border-gray-200 max-w-sm">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F9413eeead84d4fecb67b4e817e791c86?format=webp&width=800"
              alt="Leirisonda - Furos e Captações de Água, Lda"
              className="w-full h-auto object-contain"
              style={{ maxHeight: "80px" }}
            />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              disabled={isLoading}
              autoComplete="email"
              placeholder="exemplo@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palavra-passe
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              disabled={isLoading}
              autoComplete="current-password"
              placeholder="Digite sua senha"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Lembrar-me (auto-login)
            </label>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded border border-red-200">
              <strong>Erro de Login:</strong>
              <br />
              {loginError}
            </div>
          )}

          {/* Login Hints */}
          <LoginHints />

          {/* Login Button */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-300 text-white py-2 px-4 rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "A entrar..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>

      {/* Verificador de variáveis Netlify - Só em produção */}
      <NetlifyEnvChecker />
    </div>
  );
};
