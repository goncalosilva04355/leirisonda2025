import React from "react";

export const LoginHelper: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <h3 className="text-sm font-semibold text-blue-900 mb-2">
        🔐 Credenciais de Teste
      </h3>
      <div className="text-xs text-blue-800 space-y-1">
        <p>
          <strong>Email:</strong> gongonsilva@gmail.com
        </p>
        <p>
          <strong>Password:</strong> 19867gsf (ou 123456, ou 123)
        </p>
        <p className="text-blue-600 mt-2">
          ℹ️ Sistema aceita qualquer password com 3+ caracteres para
          desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default LoginHelper;
