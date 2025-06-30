import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

export function Login() {
  const [email, setEmail] = useState("gongonsilva@gmail.com");
  const [password, setPassword] = useState("19867gsf");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Get auth context with error handling
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error("❌ Error accessing auth context:", error);
    authContext = {
      user: null,
      login: async () => false,
      logout: () => {},
      isLoading: false,
    };
  }

  const { user, login, isLoading } = authContext;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (user && authReady) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Email ou palavra-passe incorretos.");
      }
    } catch (err) {
      setError("Erro ao iniciar sessão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, rgb(97, 165, 214) 0%, rgb(0, 119, 132) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Open Sans', sans-serif;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .login-header {
          background: linear-gradient(135deg, #2563eb, #0891b2);
          padding: 32px;
          text-align: center;
          color: white;
        }
        .logo-container {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 20px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .login-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 8px 0;
        }
        .login-subtitle {
          margin: 0;
          opacity: 0.9;
        }
        .login-form {
          padding: 32px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          height: 48px;
          padding: 12px 16px;
          font-size: 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          box-sizing: border-box;
        }
        .password-container {
          position: relative;
        }
        .password-input {
          padding-right: 48px;
        }
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }
        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          font-size: 14px;
        }
        .submit-button {
          width: 100%;
          height: 48px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .login-footer {
          text-align: center;
          margin-top: 24px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fb4eb4a9e6feb44b09201dbb824b8737c?format=webp&width=800"
                alt="Leirisonda Logo"
                className="logo-image"
              />
            </div>
            <h1 className="login-title">Leirisonda</h1>
            <p className="login-subtitle">Sistema de Gestão de Obras</p>
          </div>

          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={isSubmitting}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Palavra-passe</label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {error && <div className="error-message">⚠️ {error}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />A entrar...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="login-footer">
          © 2024 Leirisonda - Sistema Profissional de Gestão
        </div>
      </div>
    </>
  );
}
