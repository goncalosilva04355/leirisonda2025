import React, { useState, useEffect } from "react";
import { Settings, Bug } from "lucide-react";

interface LoginPageProps {
  onLogin: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  loginError: string;
  isLoading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  loginError,
  isLoading = false,
}) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // Load saved credentials from sessionStorage for "remember me" functionality
  useEffect(() => {
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

          // SECURITY: Auto-login DISABLED for security
          console.log(
            "🔒 Auto-login disabled for security - user must login manually",
          );
        } else {
          console.log("⚠️ Incomplete saved credentials, skipping auto-login");
        }
      } catch (error) {
        console.error("��� Error loading saved credentials:", error);
        sessionStorage.removeItem("savedLoginCredentials");
      }
    } else {
      console.log("📭 No saved credentials found");
    }
  }, [onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      console.log("📤 LoginPage: Calling onLogin function...");
      await onLogin(loginForm.email.trim(), loginForm.password, rememberMe);
      console.log("✅ LoginPage: onLogin completed");
    } catch (error) {
      console.error("❌ LoginPage: Login form error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
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
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
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
              onChange={(e) => setRememberMe(e.target.checked)}
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

      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => (window.location.hash = "administracao")}
          className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-105"
          disabled={isLoading}
          title="Administração"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Diagnostic Modal */}
      {showDiagnostic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bug className="h-6 w-6 mr-2 text-purple-600" />
                  Diagnóstico de Login
                </h2>
                <button
                  onClick={() => setShowDiagnostic(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <LoginDebugHelper />

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDiagnostic(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
