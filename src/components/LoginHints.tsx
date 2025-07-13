// Componente para mostrar dicas de login válidas
import React from "react";

interface LoginHintsProps {
  showHints?: boolean;
}

export const LoginHints: React.FC<LoginHintsProps> = ({ showHints = true }) => {
  if (!showHints) return null;

  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
      <div className="text-blue-800 font-medium mb-2">
        💡 Credenciais válidas:
      </div>
      <div className="space-y-1 text-blue-700">
        <div>
          <strong>Emails:</strong>
        </div>
        <div className="ml-2">• gongonsilva@gmail.com</div>
        <div className="ml-2">• goncalosfonseca@gmail.com</div>
        <div className="mt-2">
          <strong>Passwords:</strong>
        </div>
        <div className="ml-2">• 123 (rápido)</div>
        <div className="ml-2">• 123456</div>
        <div className="ml-2">• 19867gsf (admin)</div>
      </div>
    </div>
  );
};

export default LoginHints;
