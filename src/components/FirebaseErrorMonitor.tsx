// REMOVIDO: Firebase SDK eliminado
// Este componente não é mais necessário pois não usamos Firebase SDK

import React from "react";

export function FirebaseErrorMonitor() {
  return (
    <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
      ✅ Firebase SDK removido - usando REST API
    </div>
  );
}

export default FirebaseErrorMonitor;
