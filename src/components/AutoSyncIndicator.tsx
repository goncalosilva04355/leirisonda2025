// COMPONENTE SIMPLIFICADO SEM FIREBASE SDK
import React from "react";

export const AutoSyncIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm">REST API Ativa</span>
    </div>
  );
};

export default AutoSyncIndicator;
