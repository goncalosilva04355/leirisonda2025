import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
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

          // Auto-login if user had "remember me" checked
          setTimeout(() => {
            console.log("🚀 Auto-login triggered...");
            onLogin(email, password);
          }, 500);
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
      await onLogin(loginForm.email.trim(), loginForm.password);
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
              src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
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

      {/* Floating Settings Button (Bottom Right) */}
      <button
        onClick={() => (window.location.hash = "administracao")}
        className="fixed bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-105"
        disabled={isLoading}
        title="Administração"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
};
