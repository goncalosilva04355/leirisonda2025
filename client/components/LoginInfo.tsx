import React, { useState, useEffect } from "react";
import { AlertCircle, Users, Eye, EyeOff } from "lucide-react";

interface UserDebugInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  hasPassword: boolean;
}

export function LoginInfo() {
  const [showDebug, setShowDebug] = useState(false);
  const [users, setUsers] = useState<UserDebugInfo[]>([]);

  useEffect(() => {
    if (showDebug) {
      try {
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          const debugInfo = parsedUsers.map((user: any) => {
            const passwordById = localStorage.getItem(`password_${user.id}`);
            const passwordByEmail = localStorage.getItem(
              `password_${user.email}`,
            );

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              hasPassword: !!(passwordById || passwordByEmail),
              passwordStorageDetails: {
                byId: !!passwordById,
                byEmail: !!passwordByEmail,
                actualPassword: passwordById || passwordByEmail || "none",
              },
            };
          });
          setUsers(debugInfo);
        }
      } catch (error) {
        console.error("Error loading debug info:", error);
      }
    }
  }, [showDebug]);

  if (!showDebug) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setShowDebug(true)}
          style={{
            background: "rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "20px",
            padding: "8px 12px",
            fontSize: "12px",
            color: "#666",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Eye size={14} />
          Debug Info
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "350px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        fontSize: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={16} color="#666" />
          <strong>Debug: Sistema de Login</strong>
        </div>
        <button
          onClick={() => setShowDebug(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <EyeOff size={16} color="#666" />
        </button>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Users size={14} color="#007bff" />
          <span style={{ fontWeight: "500" }}>
            Utilizadores Registados: {users.length}
          </span>
        </div>

        {users.length === 0 ? (
          <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
            Nenhum utilizador encontrado. Use "Criar Utilizador" no menu.
          </p>
        ) : (
          <div style={{ marginTop: "8px" }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  background: "#f8f9fa",
                  padding: "8px",
                  borderRadius: "4px",
                  marginBottom: "6px",
                  fontSize: "12px",
                }}
              >
                <div style={{ fontWeight: "500", marginBottom: "2px" }}>
                  {user.name}
                </div>
                <div style={{ color: "#666", marginBottom: "2px" }}>
                  {user.email}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      background: user.role === "admin" ? "#fff3cd" : "#d4edda",
                      color: user.role === "admin" ? "#856404" : "#155724",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontSize: "10px",
                    }}
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                  <div style={{ fontSize: "10px" }}>
                    <span
                      style={{
                        color: user.hasPassword ? "#28a745" : "#dc3545",
                      }}
                    >
                      {user.hasPassword ? "✓ Password OK" : "❌ No Password"}
                    </span>
                    {user.hasPassword && (
                      <div
                        style={{
                          fontSize: "9px",
                          color: "#666",
                          marginTop: "2px",
                        }}
                      >
                        Pass: {user.passwordStorageDetails.actualPassword}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid #eee",
          paddingTop: "8px",
          fontSize: "11px",
          color: "#666",
        }}
      >
        <div>📍 Credenciais pré-definidas:</div>
        <div>• gongonsilva@gmail.com / 19867gsf</div>
        <div>• tecnico@leirisonda.pt / tecnico123</div>
        <div>• supervisor@leirisonda.pt / supervisor123</div>
      </div>
    </div>
  );
}
