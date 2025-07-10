import React, { useState } from "react";
import { Settings, ArrowLeft, AlertCircle } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Password de administração (mesma que no LoginPage)
    const adminPassword = "19867";

    if (password === adminPassword) {
      onLogin();
      setError("");
    } else {
      setError("Palavra-passe incorreta");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-auto">
        <div className="p-8 text-center">
          {/* Settings Icon */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="h-10 w-10 text-blue-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Área de Administração
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Acesso restrito para testes e configurações
            <br />
            do sistema
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Palavra-passe de Administração
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg tracking-[0.2em]"
                placeholder="•••••"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm font-medium text-left">
                {error}
              </div>
            )}

            {/* Login Diagnostics */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowDiagnostics(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center justify-center gap-1 mx-auto"
              >
                <AlertCircle className="h-4 w-4" />
                Problemas de Login? Diagnóstico
              </button>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Login Diagnostics Modal */}
      {showDiagnostics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Diagnóstico de Login</h3>
            <p className="text-gray-600 mb-4">
              Funcionalidade de diagnóstico temporariamente desabilitada
            </p>
            <button
              onClick={() => setShowDiagnostics(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
