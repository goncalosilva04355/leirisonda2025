import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertCircle, CheckCircle, RefreshCw, Users } from "lucide-react";
import FixDataVisibilityService from "../services/fixDataVisibility";

interface DataVisibilityFixProps {
  onFixCompleted?: () => void;
}

export function DataVisibilityFix({ onFixCompleted }: DataVisibilityFixProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [status, setStatus] = useState<{
    needsFix: boolean;
    checked: boolean;
    fixed: boolean;
    details?: string[];
    fixResult?: any;
  }>({
    needsFix: false,
    checked: false,
    fixed: false,
  });

  // Verificar automaticamente se há dados que precisam de correção
  useEffect(() => {
    checkVisibilityStatus();
  }, []);

  const checkVisibilityStatus = async () => {
    setIsChecking(true);
    try {
      const result = await FixDataVisibilityService.checkDataVisibilityStatus();
      setStatus({
        needsFix: result.needsFix,
        checked: true,
        fixed: false,
        details: [
          `Obras: ${result.counts.works.needsFix}/${result.counts.works.total} precisam correção`,
          `Piscinas: ${result.counts.pools.needsFix}/${result.counts.pools.total} precisam correção`,
          `Manutenções: ${result.counts.maintenance.needsFix}/${result.counts.maintenance.total} precisam correção`,
          `Clientes: ${result.counts.clients.needsFix}/${result.counts.clients.total} precisam correção`,
        ],
      });
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const applyFix = async () => {
    setIsFixing(true);
    try {
      const result = await FixDataVisibilityService.fixAllDataVisibility();

      setStatus((prev) => ({
        ...prev,
        fixed: result.success,
        fixResult: result,
        details: result.details,
      }));

      if (result.success) {
        // Forçar sincronização entre utilizadores
        await FixDataVisibilityService.forceCrossUserSync();

        // Notificar componente pai se necessário
        if (onFixCompleted) {
          onFixCompleted();
        }
      }
    } catch (error) {
      console.error("Erro ao aplicar correção:", error);
    } finally {
      setIsFixing(false);
    }
  };

  if (!status.checked && !isChecking) {
    return null;
  }

  return (
    <Card className="p-4 mb-4 border-l-4 border-l-blue-500">
      <div className="flex items-start gap-3">
        <Users className="w-5 h-5 text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            Partilha de Dados Entre Utilizadores
          </h3>

          {isChecking && (
            <div className="flex items-center gap-2 text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verificando visibilidade dos dados...</span>
            </div>
          )}

          {status.checked && !status.needsFix && !status.fixed && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>
                Todos os dados estão corretamente partilhados entre utilizadores
              </span>
            </div>
          )}

          {status.needsFix && !status.fixed && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Alguns dados não estão visíveis para todos os utilizadores
                </span>
              </div>

              {status.details && (
                <div className="bg-orange-50 p-3 rounded text-sm">
                  <p className="font-medium text-orange-800 mb-1">
                    Dados que precisam de correção:
                  </p>
                  <ul className="list-disc list-inside text-orange-700 space-y-1">
                    {status.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={applyFix}
                disabled={isFixing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isFixing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Corrigindo...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Corrigir Partilha de Dados
                  </>
                )}
              </Button>
            </div>
          )}

          {status.fixed && status.fixResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">{status.fixResult.message}</span>
              </div>

              <div className="bg-green-50 p-3 rounded text-sm">
                <p className="font-medium text-green-800 mb-1">
                  Correção aplicada com sucesso:
                </p>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  {status.details?.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                Agora todos os utilizadores podem ver as obras, piscinas,
                manutenções e clientes.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default DataVisibilityFix;
