import React, { useState } from "react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

function AppSimpleTest() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => {
    console.log("🔑 Teste login:", email);
    setLoginError("");

    // Simular login básico
    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      setIsAuthenticated(true);
      console.log("✅ Login simulado com sucesso");
    } else {
      setLoginError("Credenciais inválidas");
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        loginError={loginError}
        isLoading={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          🎉 App Funcionando!
        </h1>
        <p className="text-gray-700">
          Login realizado com sucesso. O problema estava identificado.
        </p>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AppSimpleTest;
