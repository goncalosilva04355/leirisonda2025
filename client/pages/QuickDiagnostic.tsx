import React, { useState, useEffect } from "react";

export function QuickDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {};

      try {
        addLog("🔍 Iniciando diagnóstico...");

        // Test 1: Basic environment
        addLog("✅ React carregado");
        results.react = true;

        // Test 2: Local Storage
        try {
          localStorage.setItem("test", "test");
          localStorage.removeItem("test");
          results.localStorage = true;
          addLog("✅ localStorage funcionando");
        } catch (e) {
          results.localStorage = false;
          addLog("❌ localStorage com problema: " + e);
        }

        // Test 3: Firebase import
        try {
          const { auth, db } = await import("@/lib/firebase");
          results.firebase = { auth: !!auth, db: !!db };
          addLog(`✅ Firebase carregado: auth=${!!auth}, db=${!!db}`);
        } catch (e: any) {
          results.firebase = false;
          addLog("❌ Firebase com problema: " + e.message);
        }

        // Test 4: Auth Provider
        try {
          const { useAuth } = await import("@/components/AuthProvider");
          results.authProvider = true;
          addLog("✅ AuthProvider carregado");
        } catch (e: any) {
          results.authProvider = false;
          addLog("❌ AuthProvider com problema: " + e.message);
        }

        // Test 5: Router
        try {
          const { useNavigate } = await import("react-router-dom");
          results.router = true;
          addLog("✅ React Router carregado");
        } catch (e: any) {
          results.router = false;
          addLog("❌ Router com problema: " + e.message);
        }

        // Test 6: Check stored data
        try {
          const storedUser = localStorage.getItem("leirisonda_user");
          results.storedUser = !!storedUser;
          addLog(`ℹ️ Utilizador armazenado: ${!!storedUser}`);
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            addLog(`ℹ️ Utilizador: ${parsed.email || "email não definido"}`);
          }
        } catch (e: any) {
          results.storedUser = false;
          addLog("❌ Erro ao ler utilizador armazenado: " + e.message);
        }

        // Test 7: Network
        try {
          await fetch("/api/ping");
          results.network = true;
          addLog("✅ Rede funcionando");
        } catch (e: any) {
          results.network = false;
          addLog("❌ Problema de rede: " + e.message);
        }

        setDiagnostics(results);
        addLog("🎉 Diagnóstico completo!");
      } catch (error: any) {
        addLog("💥 Erro durante diagnóstico: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    runDiagnostics();
  }, []);

  const goToLogin = () => {
    addLog("🔄 Redirecionando para login...");
    window.location.href = "/login";
  };

  const clearEverything = () => {
    addLog("🧹 Limpando tudo...");
    localStorage.clear();
    sessionStorage.clear();
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "monospace",
        backgroundColor: "#1a1a1a",
        color: "#00ff00",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#00ff00", marginBottom: "20px" }}>
          🔧 Diagnóstico Leirisonda
        </h1>

        {loading && (
          <div style={{ color: "#ffff00", marginBottom: "20px" }}>
            ⏳ Executando testes...
          </div>
        )}

        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <h3 style={{ color: "#00ff00", margin: "0 0 10px 0" }}>
            📜 Logs em Tempo Real:
          </h3>
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: "5px", fontSize: "14px" }}>
              {log}
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#00ff00", margin: "0 0 10px 0" }}>
            📊 Resultados:
          </h3>
          <pre style={{ color: "#ffffff", fontSize: "14px" }}>
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={goToLogin}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0066cc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🔐 Ir para Login
          </button>

          <button
            onClick={clearEverything}
            style={{
              padding: "10px 20px",
              backgroundColor: "#cc0000",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🧹 Limpar Tudo
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#009900",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🔄 Recarregar
          </button>
        </div>

        <div
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#666666",
          }}
        >
          <p>📱 User Agent: {navigator.userAgent}</p>
          <p>🌐 URL: {window.location.href}</p>
          <p>⏰ Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}
