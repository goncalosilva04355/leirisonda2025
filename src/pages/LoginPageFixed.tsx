import React, { useState, useEffect, useCallback } from "react";
import { Settings, AlertTriangle } from "lucide-react";
import { QuickMobileFix } from "../components/QuickMobileFix";
import { FirebaseGoogleCloudStatusCompact } from "../components/FirebaseGoogleCloudStatusCompact";

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
  const [showEmergencyFix, setShowEmergencyFix] = useState(() => {
    // Detectar se é dispositivo móvel e há conflitos
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasQuotaIssues =
      localStorage.getItem("firebase-quota-exceeded") === "true";
    const hasEmergencyShutdown =
      localStorage.getItem("firebase-emergency-shutdown") === "true";
    const hasConflicts =
      document.querySelectorAll('iframe[src*="firebaseapp.com"]').length > 1;
    return isMobile && (hasQuotaIssues || hasEmergencyShutdown || hasConflicts);
  });

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

            // AUTO-LOGIN: Executar login automático quando rememberMe está ativo
            console.log("🔄 Auto-login ativo - fazendo login automático...");

            // Executar auto-login com credenciais salvas
            const performAutoLogin = async () => {
              try {
                await onLogin(email, password, true);
                console.log("✅ Auto-login bem-sucedido");
              } catch (autoLoginError) {
                console.error("❌ Erro no auto-login:", autoLoginError);
                // Em caso de erro, limpar credenciais salvas
                sessionStorage.removeItem("savedLoginCredentials");
              }
            };

            performAutoLogin();
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
      console.error("❌ Error in LoginPage useEffect:", error);
    }
  }, [onLogin]);

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

        console.log("📤 LoginPage: Calling onLogin function...");
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

  const handleEmergencyFix = useCallback(() => {
    // Limpar todas as proteções Firebase
    localStorage.removeItem("firebase-quota-exceeded");
    localStorage.removeItem("firebase-quota-check-time");
    localStorage.removeItem("firebase-emergency-shutdown");
    localStorage.removeItem("firebase-circuit-breaker");

    // Remover iframes duplicados
    const firebaseIframes = document.querySelectorAll(
      'iframe[src*="firebaseapp.com"]',
    );
    for (let i = 1; i < firebaseIframes.length; i++) {
      firebaseIframes[i].remove();
    }

    setShowEmergencyFix(false);
    alert("✅ Fix aplicado! Agora tente fazer login com password '123'");
  }, []);

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Firebase & Google Cloud Status */}
        <FirebaseGoogleCloudStatusCompact />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-20 bg-white rounded-lg shadow-md p-2 mx-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F6c79d54ab5014a40bfea00560b92828d?format=webp&width=800"
              alt="Leirisonda Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Admin Access Button */}
        <div className="text-center mb-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              window.location.hash = "administracao";
            }}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2 mx-auto px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            <span>Área de Administração</span>
          </button>

          {/* Emergency Fix Button - Only show on mobile with issues */}
          {showEmergencyFix && (
            <button
              type="button"
              onClick={handleEmergencyFix}
              className="text-sm text-red-600 hover:text-red-800 flex items-center justify-center space-x-2 mx-auto px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 bg-red-25 animate-pulse"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>⚡ Fix Firebase (📱)</span>
            </button>
          )}
        </div>

        {/* Quick Mobile Fix - Show if conflicts detected */}
        {showEmergencyFix && (
          <div className="mb-4">
            <QuickMobileFix onFixApplied={() => setShowEmergencyFix(false)} />
          </div>
        )}

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

              {/* Mobile quick fix hint */}
              {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
                  <strong>💡 Solução Rápida (Mobile):</strong>
                  <br />
                  Tente usar password:{" "}
                  <code className="bg-yellow-100 px-1 rounded">123</code>
                </div>
              )}
            </div>
          )}

          {/* Login Button */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "A entrar..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
