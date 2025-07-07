import React, { useState } from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface FirebaseQuotaAlertProps {
  onResolve?: () => void;
}

export const FirebaseQuotaAlert: React.FC<FirebaseQuotaAlertProps> = ({
  onResolve,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
  };

  const handleResolve = () => {
    // Firebase-only mode - no quota management needed
    if (onResolve) onResolve();
    window.location.reload();
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Sistema Simplificado
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              A aplicação foi simplificada para usar exclusivamente Firebase.
              Não há mais problemas de quota ou sincronização local.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDismiss}
                className="text-sm text-yellow-600 hover:text-yellow-800"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleResolve}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 flex items-center"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
