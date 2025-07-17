import React, { useState } from "react";

interface LoginSimpleProps {
  onLogin: (user: any) => void;
  onError?: (error: string) => void;
}

const LoginSimple: React.FC<LoginSimpleProps> = ({ onLogin, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate authentication check
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check default admin credentials
      if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
        const user = {
          id: 1,
          name: "Gonçalo Fonseca",
          email: "gongonsilva@gmail.com",
          role: "super_admin",
          active: true,
        };

        console.log("✅ Login bem-sucedido:", user);
        onLogin(user);
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro no login";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔧</div>
          <h1
            style={{
              color: "#0891b2",
              fontSize: "1.875rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
            }}
          >
            Leirisonda
          </h1>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Sistema de Gestão de Piscinas
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.25rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.25rem",
              }}
            >
              Palavra-passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              background: isLoading ? "#6b7280" : "#0891b2",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "0.375rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginBottom: "1rem",
            }}
          >
            {isLoading ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: 0 }}>
            Email: gongonsilva@gmail.com
            <br />
            Senha: 19867gsf
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSimple;
