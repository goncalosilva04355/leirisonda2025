import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, login } = useAuth();

  // Se já está logado, redireciona
  if (user) {
    window.location.href = "/dashboard";
    return <div>Redirecionando...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    console.log("🔐 LOGIN TENTATIVA:", { email, password });

    if (!email || !password) {
      setError("Preencha todos os campos");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        console.log("✅ LOGIN OK - REDIRECIONANDO");
        window.location.href = "/dashboard";
      } else {
        console.log("❌ LOGIN FALHOU");
        setError("Email ou password incorretos");
      }
    } catch (err) {
      console.error("❌ ERRO:", err);
      setError("Erro no login");
    }

    setIsSubmitting(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2563eb, #0891b2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "#1f2937",
          }}
        >
          Leirisonda Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px",
              background: isSubmitting ? "#9ca3af" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <div
          style={{
            marginTop: "16px",
            fontSize: "12px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Credenciais válidas:
          <br />
          gongonsilva@gmail.com / 19867gsf
          <br />
          alexkamaryta@gmail.com / 69alexandre
        </div>
      </div>
    </div>
  );
}
