import React, { useState } from "react";

function AppMinimal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", email);

    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Credenciais inválidas");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Leirisonda</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold">App Funcional!</h1>
        <p>Login realizado com sucesso!</p>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AppMinimal;
