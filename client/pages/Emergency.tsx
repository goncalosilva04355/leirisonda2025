import React from "react";

export function Emergency() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#00ff00",
        fontFamily: "monospace",
        padding: "20px",
        fontSize: "16px",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1
          style={{ color: "#00ff00", fontSize: "24px", marginBottom: "20px" }}
        >
          🚨 LEIRISONDA - MODO DE EMERGÊNCIA
        </h1>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          <h2 style={{ color: "#ffff00", marginBottom: "15px" }}>STATUS:</h2>
          <p>✅ Servidor funcionando na porta 8080</p>
          <p>✅ React carregado</p>
          <p>❓ Interface principal com problemas</p>
        </div>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          <h2 style={{ color: "#ffff00", marginBottom: "15px" }}>
            AÇÕES DE RECUPERAÇÃO:
          </h2>

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              alert("Dados limpos! Recarregando...");
              window.location.href = "/login";
            }}
            style={{
              backgroundColor: "#cc0000",
              color: "white",
              border: "none",
              padding: "15px 30px",
              fontSize: "16px",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            🧹 LIMPAR DADOS E IR PARA LOGIN
          </button>

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            style={{
              backgroundColor: "#0066cc",
              color: "white",
              border: "none",
              padding: "15px 30px",
              fontSize: "16px",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            🔐 IR PARA LOGIN
          </button>

          <button
            onClick={() => {
              window.location.reload();
            }}
            style={{
              backgroundColor: "#009900",
              color: "white",
              border: "none",
              padding: "15px 30px",
              fontSize: "16px",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            🔄 RECARREGAR PÁGINA
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h2 style={{ color: "#ffff00", marginBottom: "15px" }}>
            LOGIN DIRETO:
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as any).email.value;
              const password = (e.target as any).password.value;

              // Login direto básico
              if (
                email === "gongonsilva@gmail.com" &&
                password === "19867gsf"
              ) {
                localStorage.setItem(
                  "leirisonda_user",
                  JSON.stringify({
                    id: "admin",
                    email: "gongonsilva@gmail.com",
                    name: "Gonçalo Silva",
                    role: "admin",
                  }),
                );
                alert("Login efetuado! Redirecionando...");
                window.location.href = "/dashboard";
              } else {
                alert("Credenciais incorretas");
              }
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#ffffff",
                }}
              >
                Email:
              </label>
              <input
                name="email"
                type="email"
                defaultValue="gongonsilva@gmail.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                  borderRadius: "3px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#ffffff",
                }}
              >
                Password:
              </label>
              <input
                name="password"
                type="password"
                defaultValue="19867gsf"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                  borderRadius: "3px",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#00aa00",
                color: "white",
                border: "none",
                padding: "15px 30px",
                fontSize: "16px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              🚀 ENTRAR AGORA
            </button>
          </form>
        </div>

        <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          <p>Hora: {new Date().toLocaleString()}</p>
          <p>URL: {window.location.href}</p>
        </div>
      </div>
    </div>
  );
}
