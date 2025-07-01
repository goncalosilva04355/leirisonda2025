import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Waves, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

export function MaintenanceList() {
  const { user } = useAuth();
  const { maintenances } = useFirebaseSync();

  // Sistema reativado para mostrar novas piscinas criadas
  console.log("✅ Sistema reativado - pode criar e ver novas piscinas");

  const hasMaintenances = maintenances && maintenances.length > 0;

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
                Sistema completamente limpo - sem piscinas
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

      {/* Show content based on whether there are maintenances */}
      {!hasMaintenances ? (
        <>
          {/* Empty State - Sistema Limpo */}
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Waves className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Sistema Limpo
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Nenhuma piscina registrada. Crie a primeira piscina para
                começar.
              </p>
              <div className="space-y-3">
                <Link to="/create-maintenance" className="block">
                  <Button className="btn-primary w-full text-lg py-3">
                    <Plus className="mr-2 h-5 w-5" />
                    Criar Primeira Piscina
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Sistema Pronto
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Sistema limpo e funcional. Pode criar novas piscinas
                  normalmente.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Show actual maintenances when they exist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {maintenances.map((maintenance) => (
              <div key={maintenance.id} className="glass-card p-6 hover-scale">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {maintenance.poolName}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <span className="mr-1">👤</span>
                      {maintenance.clientName}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-1">📍</span>
                    {maintenance.location}
                  </div>
                  {maintenance.clientPhone && (
                    <div className="flex items-center">
                      <span className="mr-1">📞</span>
                      {maintenance.clientPhone}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/maintenance/${maintenance.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Link to={`/edit-maintenance/${maintenance.id}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
