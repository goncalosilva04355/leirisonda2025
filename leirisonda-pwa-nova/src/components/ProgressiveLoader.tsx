import React, { useState, useEffect } from "react";

interface ProgressiveLoaderProps {
  children: React.ReactNode;
}

const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({ children }) => {
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const phases = [
    "Inicializando...",
    "Carregando componentes base...",
    "Configurando Firebase...",
    "Carregando serviços...",
    "Finalizando...",
  ];

  useEffect(() => {
    const loadPhases = async () => {
      try {
        // Fase 1: Base
        setLoadingPhase(1);
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Fase 2: Componentes React base
        setLoadingPhase(2);
        await import("react");
        await import("lucide-react");
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Fase 3: Firebase e configurações
        setLoadingPhase(3);
        try {
          await import("../firebase/config");
          await import("../utils/firebaseQuotaRecovery");
        } catch (e) {
          console.warn("Firebase imports com problemas:", e);
        }
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Fase 4: Serviços
        setLoadingPhase(4);
        try {
          await import("../services/simplifiedSyncService");
          await import("../hooks/usePullToRefresh");
        } catch (e) {
          console.warn("Serviços com problemas:", e);
        }
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Fase 5: Concluído
        setLoadingPhase(5);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: any) {
        console.error("❌ Erro durante carregamento progressivo:", error);
        setError(error.message || "Erro desconhecido");
      }
    };

    loadPhases();
  }, []);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            ❌ Erro no Carregamento
          </h1>
          <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>
            Erro na fase {loadingPhase}: {phases[loadingPhase - 1]}
          </p>
          <p
            style={{
              fontSize: "1rem",
              marginBottom: "2rem",
              background: "rgba(255,255,255,0.1)",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "white",
              color: "#ef4444",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (loadingPhase < 5) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
            🚀 Leirisonda
          </h1>

          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: "300px",
                height: "4px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "2px",
                overflow: "hidden",
                margin: "0 auto 1rem",
              }}
            >
              <div
                style={{
                  width: `${(loadingPhase / 5) * 100}%`,
                  height: "100%",
                  background: "white",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <p style={{ fontSize: "1rem" }}>
              {phases[loadingPhase] || "Carregando..."}
            </p>
            <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
              Fase {loadingPhase} de 5
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProgressiveLoader;
