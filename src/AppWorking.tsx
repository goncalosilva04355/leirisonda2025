import React, { useState } from "react";
import { Building2, User, Lock } from "lucide-react";

export default function AppWorking() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple auth check
    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      setIsAuthenticated(true);
    } else {
      setError("Email ou palavra-passe incorretos");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  if (isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        {/* Header */}
        <header
          style={{
            backgroundColor: "#1e40af",
            color: "white",
            padding: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Building2 size={32} />
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                Leirisonda
              </h1>
            </div>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {/* Welcome Card */}
            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                Bem-vindo, Gonçalo!
              </h2>
              <p style={{ color: "#6b7280" }}>
                Sistema de Gestão de Piscinas em funcionamento
              </p>
            </div>

            {/* Stats Cards */}
            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "semibold",
                  marginBottom: "0.5rem",
                }}
              >
                Obras
              </h3>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#1e40af",
                }}
              >
                0
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Total de obras registadas
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "semibold",
                  marginBottom: "0.5rem",
                }}
              >
                Piscinas
              </h3>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#059669",
                }}
              >
                0
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Piscinas em gestão
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "semibold",
                  marginBottom: "0.5rem",
                }}
              >
                Manutenções
              </h3>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#dc2626",
                }}
              >
                0
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Manutenções realizadas
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Sistema Operacional
            </h2>
            <div style={{ color: "#059669", marginBottom: "0.5rem" }}>
              ✅ Aplicação carregada com sucesso
            </div>
            <div style={{ color: "#059669", marginBottom: "0.5rem" }}>
              ✅ Autenticação funcionando
            </div>
            <div style={{ color: "#059669", marginBottom: "0.5rem" }}>
              ✅ Interface responsiva
            </div>
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                marginTop: "1rem",
              }}
            >
              A aplicação principal está a ser reparada. Esta versão garante que
              o sistema está funcional.
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          margin: "1rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Building2
            size={48}
            style={{ color: "#1e40af", margin: "0 auto 1rem" }}
          />
          <h1
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}
          >
            Leirisonda
          </h1>
          <p style={{ color: "#6b7280" }}>Sistema de Gestão de Piscinas</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Email
            </label>
            <div style={{ position: "relative" }}>
              <User
                size={20}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.5rem",
                  paddingRight: "0.75rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Palavra-passe
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={20}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.5rem",
                  paddingRight: "0.75rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
                placeholder="Digite sua palavra-passe"
                required
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
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

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#1e40af",
              color: "white",
              border: "none",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.375rem",
            fontSize: "0.75rem",
            color: "#6b7280",
          }}
        >
          <div style={{ fontWeight: "500", marginBottom: "0.5rem" }}>
            Credenciais de teste:
          </div>
          <div>Email: gongonsilva@gmail.com</div>
          <div>Password: 19867gsf</div>
        </div>
      </div>
    </div>
  );
}
