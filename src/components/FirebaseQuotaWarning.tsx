import React from "react";
import { AlertTriangle, Clock, Wifi } from "lucide-react";

export const FirebaseQuotaWarning: React.FC = () => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-orange-800 mb-1">
              Sincronização Temporariamente Desabilitada
            </h3>
            <p className="text-xs text-orange-600 mb-2">
              O Firebase atingiu o limite de operações. A sincronização entre
              dispositivos está pausada para evitar problemas.
            </p>
            <div className="flex items-center gap-4 text-xs text-orange-600">
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                <span>App funciona offline</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Reset em ~24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
