import React, { useState } from "react";
import { LoginPageFixed } from "./pages/LoginPageFixed";

function AppMinimal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => {
    try {
      console.log("Login attempt:", email);
      // Simulação de login simples
      if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError("Credenciais inválidas");
      }
    } catch (error) {
      setLoginError("Erro no login");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Login realizado com sucesso!
          </h1>
          <p className="text-gray-700">Bem-vindo ao sistema Leirisonda</p>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <LoginPageFixed
      onLogin={handleLogin}
      loginError={loginError}
      isLoading={false}
    />
  );
}

export default AppMinimal;
