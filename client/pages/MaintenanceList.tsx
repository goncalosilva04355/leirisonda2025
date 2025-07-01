import React from "react";
import { Link } from "react-router-dom";
import { Waves, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MaintenanceList() {
  // Página simplificada sem dependências complexas
  console.log("📄 MaintenanceList - Página simplificada carregada");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center shadow-md p-1 shrink-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800"
                alt="Leirisonda Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <Waves className="mr-3 h-6 lg:h-8 w-6 lg:w-8 text-blue-600 shrink-0" />
                <span className="truncate">Manutenção de Piscinas</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Sistema 100% limpo - zero piscinas no sistema
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            <Link to="/create-maintenance" className="block">
              <Button className="btn-primary w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova Piscina
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo simples e funcional */}
      <div className="text-center py-16">
        <div className="mx-auto max-w-md">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Waves className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Manutenção de Piscinas
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Sistema funcional. Pode criar e gerir piscinas.
          </p>
          <div className="space-y-3">
            <Link to="/create-maintenance" className="block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full text-lg py-3">
                <Plus className="mr-2 h-5 w-5" />
                Criar Nova Piscina
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
