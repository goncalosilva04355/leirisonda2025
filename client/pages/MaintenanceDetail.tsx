import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MaintenanceDetail() {
  const navigate = useNavigate();

  // PÁGINA COMPLETAMENTE BLOQUEADA - Não mostrar piscinas fantasma
  console.log("🚫 MaintenanceDetail completamente bloqueado");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/pool-maintenance")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="text-center py-16">
        <div className="mx-auto max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Acesso Bloqueado
          </h3>
          <p className="text-gray-600 mb-4">
            Esta página foi bloqueada para evitar mostrar dados antigos.
          </p>
          <p className="text-sm text-gray-500">
            Sistema completamente limpo - sem piscinas fantasma.
          </p>
        </div>
      </div>
    </div>
  );
}
