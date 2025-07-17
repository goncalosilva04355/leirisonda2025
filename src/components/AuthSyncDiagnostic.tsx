// COMPONENTE SIMPLIFICADO SEM FIREBASE SDK
import React from "react";

export const AuthSyncDiagnostic: React.FC = () => {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <p className="text-green-800">
        ✅ Firebase SDK removido - usando REST API
      </p>
    </div>
  );
};

export default AuthSyncDiagnostic;
