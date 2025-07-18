import React, { useState } from "react";
import { Building2, User, LogIn } from "lucide-react";

function AppSimple() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simular login simples
    if (
      loginForm.email === "gongonsilva@gmail.com" &&
      loginForm.password === "19867gsf"
    ) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Credenciais inválidas");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-8 h-8 text-cyan-600" />
              <h1 className="text-2xl font-bold text-gray-800">Leirisonda</h1>
            </div>

            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Bem-vindo ao Sistema de Gestão
              </h2>
              <p className="text-gray-600 mb-6">
                A aplicação está a funcionar corretamente em produção.
              </p>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-cyan-600" />
          <h1 className="text-2xl font-bold text-gray-800">Leirisonda</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="********"
              required
            />
          </div>

          {loginError && (
            <div className="text-red-600 text-sm text-center">{loginError}</div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Teste: gongonsilva@gmail.com / 19867gsf</p>
        </div>
      </div>
    </div>
  );
}

export default AppSimple;
