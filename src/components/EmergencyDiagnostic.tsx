/**
 * Componente de diagnóstico de emergência
 * Mostra o status dos estabilizadores e permite debug em tempo real
 */

import React, { useState, useEffect } from "react";

export function EmergencyDiagnostic() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const updateStatus = () => {
      const newStatus = {
        ultraStabilized: (window as any).ULTRA_STABILIZED || false,
        emergencyStop: (window as any).EMERGENCY_STOP_ACTIVE || false,
        emergencyMode: (window as any).EMERGENCY_MODE_ACTIVE || false,
        realtimeMonitor: !!(window as any).realtimeMonitor,
        builderStabilizer: !!(window as any).builderStabilizer,
        timestamp: new Date().toLocaleTimeString(),
      };
      setStatus(newStatus);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const getRealtimeLogs = () => {
    if ((window as any).realtimeMonitor) {
      const report = (window as any).realtimeMonitor.getFullReport();
      setLogs(report.slice(-20)); // Últimos 20 logs
    }
  };

  const getBuilderStatus = () => {
    if ((window as any).builderStabilizer) {
      const builderStatus = (window as any).builderStabilizer.getStatus();
      console.log("🛡️ Builder.io Stabilizer Status:", builderStatus);
    }
  };

  const forceStabilize = () => {
    console.log("🚨 FORÇANDO ESTABILIZAÇÃO TOTAL");

    // Limpar todos os intervalos novamente
    for (let i = 1; i <= 99999; i++) {
      try {
        clearInterval(i);
        clearTimeout(i);
      } catch (e) {}
    }

    // Reforçar bloqueios
    (window as any).ULTRA_STABILIZED = true;
    (window as any).EMERGENCY_STOP_ACTIVE = true;
    (window as any).EMERGENCY_MODE_ACTIVE = true;

    console.log("✅ Estabilização forçada concluída");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-red-600 transition-colors"
        title="Diagnóstico de Emergência"
      >
        🚨
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4 max-w-md max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900">
          🚨 Diagnóstico de Emergência
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Status dos Estabilizadores */}
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium text-sm mb-2">
            Status dos Estabilizadores:
          </h4>
          <div className="space-y-1 text-xs">
            <div
              className={`flex justify-between ${status.ultraStabilized ? "text-green-600" : "text-red-600"}`}
            >
              <span>Ultra Stabilizer:</span>
              <span>{status.ultraStabilized ? "✅ ATIVO" : "❌ INATIVO"}</span>
            </div>
            <div
              className={`flex justify-between ${status.emergencyStop ? "text-green-600" : "text-red-600"}`}
            >
              <span>Emergency Stop:</span>
              <span>{status.emergencyStop ? "✅ ATIVO" : "❌ INATIVO"}</span>
            </div>
            <div
              className={`flex justify-between ${status.realtimeMonitor ? "text-green-600" : "text-red-600"}`}
            >
              <span>Realtime Monitor:</span>
              <span>{status.realtimeMonitor ? "✅ ATIVO" : "❌ INATIVO"}</span>
            </div>
            <div
              className={`flex justify-between ${status.builderStabilizer ? "text-green-600" : "text-red-600"}`}
            >
              <span>Builder.io Stabilizer:</span>
              <span>
                {status.builderStabilizer ? "✅ ATIVO" : "❌ INATIVO"}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Atualizado: {status.timestamp}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2">
          <button
            onClick={getRealtimeLogs}
            className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600"
          >
            📊 Ver Logs Tempo Real
          </button>

          <button
            onClick={getBuilderStatus}
            className="w-full bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600"
          >
            🛡️ Status Builder.io
          </button>

          <button
            onClick={forceStabilize}
            className="w-full bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600"
          >
            🚨 Forçar Estabilização
          </button>
        </div>

        {/* Logs Recentes */}
        {logs.length > 0 && (
          <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
            <h4 className="font-medium text-sm mb-2">Logs Recentes:</h4>
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-xs">
                  <span className="text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`ml-2 ${log.type.includes("CRITICAL") ? "text-red-600" : "text-gray-700"}`}
                  >
                    {log.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 border-t pt-2">
          Use F12 → Console para logs detalhados
        </div>
      </div>
    </div>
  );
}
