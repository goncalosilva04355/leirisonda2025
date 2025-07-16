import React, { useState, useEffect } from "react";

export default function AppDiagnostic() {
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<string>("Carregando componentes base...");

  useEffect(() => {
    const testComponents = async () => {
      try {
        setStep("Testando React basics...");
        await new Promise((resolve) => setTimeout(resolve, 100));

        setStep("Testando imports de ícones...");
        const { Building2 } = await import("lucide-react");

        setStep("Testando hooks...");
        const { usePullToRefresh } = await import("./hooks/usePullToRefresh");

        setStep("Testando services...");
        const { authServiceWrapperSafe } = await import(
          "./services/authServiceWrapperSafe"
        );

        setStep("Testando Firebase...");
        const { isFirebaseReady } = await import("./firebase/leiriaConfig");

        setStep("Testando LoginPageFixed...");
        const { LoginPageFixed } = await import("./pages/LoginPageFixed");

        setStep("Todos os componentes carregados com sucesso!");
      } catch (err: any) {
        console.error("Erro durante teste de componentes:", err);
        setError(`${step}\nErro: ${err.message}\nStack: ${err.stack}`);
      }
    };

    testComponents();
  }, []);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef2f2",
          fontFamily: "system-ui",
          padding: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <h1
            style={{
              color: "#dc2626",
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Erro Encontrado!
          </h1>
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.375rem",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <pre
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
              }}
            >
              {error}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
          >
            Recarregar
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Limpar Cache
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        fontFamily: "system-ui",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem",
          }}
        />
        <h1
          style={{
            color: "#1f2937",
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Leirisonda
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>{step}</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
