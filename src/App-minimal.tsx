import React, { useState } from "react";

function AppMinimal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("🔍 AppMinimal renderizando...");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔐 Tentativa de login:", email);

    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      setIsLoggedIn(true);
      console.log("✅ Login bem-sucedido");
    } else {
      alert("Login incorreto");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Aplicação Funcionando!
          </h1>
          <p className="text-gray-600 mb-4">
            Login bem-sucedido. A aplicação está a funcionar correctamente.
          </p>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login Leirisonda
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="gongonsilva@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sua password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Entrar
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Se a aplicação está branca, este componente deve aparecer.
        </p>
      </div>
    </div>
  );
}

export default AppMinimal;
