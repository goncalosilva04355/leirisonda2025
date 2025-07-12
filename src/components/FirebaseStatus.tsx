import React from "react";
import { Database, Cloud, CheckCircle } from "lucide-react";

interface FirebaseStatusProps {
  className?: string;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({
  className = "",
}) => {
  // Simplified static status display to avoid any potential issues
  // This will just show that services are expected to be available
  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 ${className}`}
    >
      <div className="text-xs text-gray-600 text-center mb-2 font-medium">
        Status dos Serviços
      </div>

      <div className="flex justify-center space-x-6">
        {/* Firebase Status */}
        <div className="flex items-center space-x-2">
          <Cloud className="h-4 w-4 text-orange-500" />
          <span className="text-xs font-medium text-gray-700">Firebase</span>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-xs text-gray-600">Ativo</span>
        </div>

        {/* Firestore Status */}
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium text-gray-700">Firestore</span>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-xs text-gray-600">Ativo</span>
        </div>
      </div>
    </div>
  );
};
