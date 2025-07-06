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
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedPassword, setAdvancedPassword] = useState("");
  const [advancedPasswordError, setAdvancedPasswordError] = useState("");

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("savedLoginCredentials");
    if (savedCredentials) {
      try {
        const {
          email,
          password,
          rememberMe: savedRememberMe,
        } = JSON.parse(savedCredentials);
        if (savedRememberMe) {
          setLoginForm({ email: email || "", password: password || "" });
          setRememberMe(true);

          // Auto-login if credentials are saved and rememberMe is true
          if (email && password) {
            setTimeout(() => {
              onLogin(email, password);
            }, 500);
          }
        }
      } catch (error) {
        console.error("Error loading saved credentials:", error);
        localStorage.removeItem("savedLoginCredentials");
      }
    }
  }, [onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save credentials if remember me is checked
    if (rememberMe) {
      localStorage.setItem(
        "savedLoginCredentials",
        JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
          rememberMe: true,
        }),
      );
    } else {
      localStorage.removeItem("savedLoginCredentials");
    }

    await onLogin(loginForm.email, loginForm.password);
  };

  const handleAdvancedSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = "19867";

    if (advancedPassword === correctPassword) {
      setAdvancedPasswordError("");
      setShowAdvancedSettings(false);
      setAdvancedPassword("");
      // Navigate to administration
      window.location.hash = "administracao";
    } else {
      setAdvancedPasswordError("Palavra-passe incorreta");
    }
  };

  // Advanced Settings Modal
  if (showAdvancedSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Administração
            </h2>
            <p className="text-gray-600 text-sm">
              Acesso à área de administração e configurações avançadas
            </p>
          </div>

          <form onSubmit={handleAdvancedSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe de Administração
              </label>
              <input
                type="password"
                value={advancedPassword}
                onChange={(e) => setAdvancedPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••"
                required
                autoFocus
              />
            </div>

            {advancedPasswordError && (
              <div className="text-red-600 text-sm text-center">
                {advancedPasswordError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAdvancedSettings(false);
                  setAdvancedPassword("");
                  setAdvancedPasswordError("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
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
        onClick={() => setShowAdvancedSettings(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-105"
        disabled={isLoading}
        title="Administração"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
};
