import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class AppWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error("🚨 Error caught by AppWrapper:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 AppWrapper Error Details:", {
      error,
      errorInfo,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
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
          <div style={{ maxWidth: "600px" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              ⚠️ Erro de Carregamento
            </h1>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
              Ocorreu um erro ao carregar a aplicação
            </p>

            {this.state.error && (
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "2rem",
                  textAlign: "left",
                  fontSize: "0.9rem",
                }}
              >
                <p>
                  <strong>Erro:</strong> {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <details style={{ marginTop: "1rem" }}>
                    <summary style={{ cursor: "pointer" }}>Stack Trace</summary>
                    <pre
                      style={{
                        fontSize: "0.8rem",
                        marginTop: "0.5rem",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
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
                Recarregar Página
              </button>

              <button
                onClick={() => {
                  // Limpar cache e recarregar
                  if ("caches" in window) {
                    caches.keys().then((names) => {
                      names.forEach((name) => caches.delete(name));
                    });
                  }
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid white",
                  padding: "1rem 2rem",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Limpar Cache e Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppWrapper;
