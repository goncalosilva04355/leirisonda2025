// Componente para mostrar dicas de login válidas
import React from "react";

interface LoginHintsProps {
  showHints?: boolean;
}

export const LoginHints: React.FC<LoginHintsProps> = ({ showHints = true }) => {
  if (!showHints) return null;

  return (
    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
      <div className="text-green-800 font-medium mb-2">
        📱 Login rápido - Use qualquer combinação:
      </div>
      <div className="space-y-2 text-green-700">
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-white p-2 rounded border">
            <strong>Email:</strong> goncalosfonseca@gmail.com
            <br />
            <strong>Password:</strong> 123
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Email:</strong> gongonsilva@gmail.com
            <br />
            <strong>Password:</strong> 123456
          </div>
        </div>
        <div className="text-xs text-green-600">
          ℹ️ Ambos emails funcionam com qualquer password (123, 123456,
          19867gsf)
        </div>
      </div>
    </div>
  );
};

export default LoginHints;
