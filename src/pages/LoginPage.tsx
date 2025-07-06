import React, { useState } from "react";
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
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedPassword, setAdvancedPassword] = useState("");
  const [advancedPasswordError, setAdvancedPasswordError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(loginForm.email, loginForm.password);
  };

  const handleAdvancedSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = "19867";

    if (advancedPassword === correctPassword) {
      setAdvancedPasswordError("");
      setShowAdvancedSettings(false);
      window.location.hash = "configuracoes-avancadas";
    } else {
      setAdvancedPasswordError("Palavra-passe incorreta");
    }
  };

  if (showAdvancedSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Configurações Avançadas
          </h2>

          <p className="text-gray-600 text-sm mb-6 text-center">
            Acesso a configurações Firebase e sincronização
          </p>

          <form onSubmit={handleAdvancedSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe de Configuração
              </label>
              <input
                type="password"
                value={advancedPassword}
                onChange={(e) => setAdvancedPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••"
                required
              />
            </div>

            {advancedPasswordError && (
              <div className="text-red-600 text-sm">
                {advancedPasswordError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowAdvancedSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="text-center mb-8">
          <div className="w-32 h-20 bg-white rounded-lg shadow-md p-2 mx-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
              alt="Leirisonda Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

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
            />
          </div>

          {loginError && (
            <div className="text-red-600 text-sm">{loginError}</div>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "A entrar..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>

      <button
        onClick={() => setShowAdvancedSettings(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-xl transition-all duration-200"
        disabled={isLoading}
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
};
