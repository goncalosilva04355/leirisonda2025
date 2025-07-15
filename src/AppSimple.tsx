import React, { useState } from "react";

function LoginForm({
  onLogin,
}: {
  onLogin: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              color: "#0891b2",
              margin: "0 0 10px",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            Leirisonda
          </h1>
          <p
            style={{
              color: "#666",
              margin: 0,
              fontSize: "16px",
            }}
          >
            Sistema de Gestão de Piscinas
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              placeholder="seu@email.com"
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              Palavra-passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#0891b2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
          }}
        >
          <p>Utilizador de teste:</p>
          <p>
            <strong>Email:</strong> gongonsilva@gmail.com
          </p>
          <p>
            <strong>Palavra-passe:</strong> 19867gsf
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                color: "#0891b2",
                margin: "0 0 5px",
                fontSize: "28px",
              }}
            >
              Bem-vindo, {user.name}
            </h1>
            <p
              style={{
                color: "#666",
                margin: 0,
                fontSize: "16px",
              }}
            >
              Sistema de Gestão de Piscinas
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: "10px 20px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Sair
          </button>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#0891b2",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
              }}
            >
              🏗️
            </div>
            <h3 style={{ color: "#333", marginBottom: "10px" }}>Obras</h3>
            <p style={{ color: "#666", margin: 0 }}>
              Gestão de obras e projectos
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#0891b2",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
              }}
            >
              🏊
            </div>
            <h3 style={{ color: "#333", marginBottom: "10px" }}>Piscinas</h3>
            <p style={{ color: "#666", margin: 0 }}>Gestão de piscinas</p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#0891b2",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
              }}
            >
              🔧
            </div>
            <h3 style={{ color: "#333", marginBottom: "10px" }}>Manutenções</h3>
            <p style={{ color: "#666", margin: 0 }}>Manutenções e serviços</p>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#333", marginBottom: "20px" }}>
            ✅ Aplicação a Funcionar!
          </h2>
          <p style={{ color: "#666", fontSize: "16px", margin: 0 }}>
            A página já não está em branco. O problema foi resolvido com
            sucesso.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AppSimple() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (email: string, password: string) => {
    // Simple authentication check
    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      const user = {
        name: "Gonçalo Fonseca",
        email: "gongonsilva@gmail.com",
        role: "super_admin",
      };
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      alert("Credenciais inválidas. Use: gongonsilva@gmail.com / 19867gsf");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
}
