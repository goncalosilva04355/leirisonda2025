import React, { useState } from "react";
import { Info, Eye, EyeOff, Copy, Check } from "lucide-react";

export function LoginInfo() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState("");

  const users = [
    {
      name: "Administrador",
      email: "gongonsilva@gmail.com",
      password: "19867gsf",
      role: "Admin - Acesso total",
    },
    {
      name: "Supervisor",
      email: "supervisor@leirisonda.pt",
      password: "supervisor123",
      role: "Admin - Sem eliminações",
    },
    {
      name: "Técnico",
      email: "tecnico@leirisonda.pt",
      password: "tecnico123",
      role: "Utilizador - Visualização",
    },
    {
      name: "Utilizador",
      email: "user@leirisonda.pt",
      password: "user123",
      role: "Utilizador - Básico",
    },
  ];

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(""), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(""), 2000);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white/95 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-gray-600" />
          <h3 className="text-gray-800 font-medium">
            Utilizadores Disponíveis
          </h3>
        </div>
        <button
          onClick={() => setShowPasswords(!showPasswords)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showPasswords ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          <span className="text-sm">
            {showPasswords ? "Ocultar" : "Mostrar"} passwords
          </span>
        </button>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.email} className="bg-gray-50 rounded-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-800 font-medium text-sm">
                  {user.name}
                </h4>
                <p className="text-gray-600 text-xs">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <code className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs flex-1">
                {user.email}
              </code>
              <button
                onClick={() => copyEmail(user.email)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copiar email"
              >
                {copiedEmail === user.email ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            {showPasswords && (
              <code className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs block">
                Password: {user.password}
              </code>
            )}
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-xs mt-4 text-center">
        Estes utilizadores funcionam em qualquer dispositivo
      </p>
    </div>
  );
}
