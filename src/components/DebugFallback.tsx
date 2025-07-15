/**
 * Componente de fallback para debug quando a aplicação não carrega
 */

import React from "react";

export function DebugFallback() {
  const checkStatus = () => {
    console.log("🔍 DEBUG STATUS:");
    console.log("- Window object:", typeof window);
    console.log("- Document ready:", document.readyState);
    console.log("- React loaded:", typeof React);
    console.log("- Firebase simple:", !!(window as any).simpleFirebaseDb);
    console.log("- Emergency mode:", !!(window as any).EMERGENCY_MODE_ACTIVE);
    console.log("- Ultra stabilized:", !!(window as any).ULTRA_STABILIZED);
    console.log("- Current user:", localStorage.getItem("currentUser"));
    console.log("- Is authenticated:", localStorage.getItem("isAuthenticated"));
  };

  const testLogin = () => {
    console.log("🧪 Testando login emergência...");

    // Simular login de emergência
    const testUser = {
      uid: "debug_user",
      email: "admin@debug.com",
      name: "Debug User",
      role: "admin",
      active: true,
      emergencyMode: true,
    };

    localStorage.setItem("currentUser", JSON.stringify(testUser));
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("emergency_user", JSON.stringify(testUser));

    console.log("✅ Login de debug criado. Recarregar página...");
    setTimeout(() => window.location.reload(), 1000);
  };

  const clearAll = () => {
    console.log("🧹 Limpando tudo...");
    localStorage.clear();
    sessionStorage.clear();
    console.log("✅ Armazenamento limpo. Recarregar página...");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-xl font-bold text-red-600 mb-4">🚨 Debug Mode</h1>

        <p className="text-gray-600 mb-6">
          A aplicação não está a carregar normalmente. Use os botões abaixo para
          diagnosticar:
        </p>

        <div className="space-y-3">
          <button
            onClick={checkStatus}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            🔍 Verificar Status (Console)
          </button>

          <button
            onClick={testLogin}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            🧪 Login de Debug
          </button>

          <button
            onClick={clearAll}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            🧹 Limpar Tudo
          </button>
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded text-sm">
          <p className="font-medium mb-2">Informação de Debug:</p>
          <div className="space-y-1 text-xs">
            <div>URL: {window.location.href}</div>
            <div>Hora: {new Date().toLocaleString()}</div>
            <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
