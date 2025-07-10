import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useUniversalDataSyncSafe as useUniversalDataSync } from "../hooks/useUniversalDataSyncSafe";
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Database,
  Users,
  Building2,
  Wrench,
  Waves,
  UserCheck,
} from "lucide-react";

export function UniversalSyncMonitor() {
  const universalSync = useUniversalDataSync();
  const [showDetails, setShowDetails] = useState(false);

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "syncing":
        return "bg-blue-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "connecting":
        return <RefreshCw className="h-4 w-4" />;
      case "error":
        return <WifiOff className="h-4 w-4" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Conectado - Dados Sincronizados";
      case "syncing":
        return "Sincronizando...";
      case "connecting":
        return "Conectando...";
      case "error":
        return "Erro de Conexão";
      default:
        return "Desconectado";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sincronização Universal de Dados
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${getSyncStatusColor(universalSync.syncStatus)}`}
            ></div>
            {getSyncStatusIcon(universalSync.syncStatus)}
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Monitorização da partilha de dados entre todos os utilizadores e
          dispositivos
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status de Sincronização */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {getSyncStatusIcon(universalSync.syncStatus)}
            <span className="font-medium">
              {getSyncStatusText(universalSync.syncStatus)}
            </span>
          </div>
          <Badge
            variant={
              universalSync.syncStatus === "connected"
                ? "default"
                : "destructive"
            }
          >
            {universalSync.syncStatus.toUpperCase()}
          </Badge>
        </div>

        {/* Última Sincronização */}
        {universalSync.lastSync && (
          <div className="text-sm text-gray-600">
            <strong>Última Sincronização:</strong>{" "}
            {new Date(universalSync.lastSync).toLocaleString("pt-PT")}
          </div>
        )}

        {/* Resumo dos Dados */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-semibold text-blue-800">
                {universalSync.obras.length}
              </div>
              <div className="text-sm text-blue-600">Obras</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Wrench className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-800">
                {universalSync.manutencoes.length}
              </div>
              <div className="text-sm text-green-600">Manutenções</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-cyan-50 rounded-lg">
            <Waves className="h-5 w-5 text-cyan-600" />
            <div>
              <div className="font-semibold text-cyan-800">
                {universalSync.piscinas.length}
              </div>
              <div className="text-sm text-cyan-600">Piscinas</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <UserCheck className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-semibold text-purple-800">
                {universalSync.clientes.length}
              </div>
              <div className="text-sm text-purple-600">Clientes</div>
            </div>
          </div>
        </div>

        {/* Total de Registos */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">
            {universalSync.totalItems}
          </div>
          <div className="text-sm text-gray-600">
            Total de Registos Partilhados
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Visíveis para todos os utilizadores em todos os dispositivos
          </div>
        </div>

        {/* Indicador de Partilha Global */}
        <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">
            Partilha Global Ativa
          </span>
          <Users className="h-4 w-4 text-green-600" />
        </div>

        {/* Error Display */}
        {universalSync.error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium text-red-800">
                Erro de Sincronização
              </div>
              <div className="text-sm text-red-600">{universalSync.error}</div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {universalSync.isLoading && (
          <div className="flex items-center justify-center gap-2 p-3">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Carregando dados universais...</span>
          </div>
        )}

        {/* Detalhes Técnicos */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full"
        >
          {showDetails ? "Ocultar" : "Mostrar"} Detalhes Técnicos
        </Button>

        {showDetails && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg text-sm">
            <div>
              <strong>Estado:</strong> {universalSync.syncStatus}
            </div>
            <div>
              <strong>Carregando:</strong>{" "}
              {universalSync.isLoading ? "Sim" : "Não"}
            </div>
            <div>
              <strong>Partilha Global:</strong>{" "}
              {universalSync.isGloballyShared ? "Ativa" : "Inativa"}
            </div>
            <div>
              <strong>Total de Items:</strong> {universalSync.totalItems}
            </div>
            {universalSync.lastSync && (
              <div>
                <strong>Última Sincronização:</strong> {universalSync.lastSync}
              </div>
            )}
            {universalSync.error && (
              <div>
                <strong>Erro:</strong>{" "}
                <span className="text-red-600">{universalSync.error}</span>
              </div>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            onClick={universalSync.forceSyncAll}
            disabled={universalSync.isLoading}
            className="flex-1 flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${universalSync.isLoading ? "animate-spin" : ""}`}
            />
            Sincronizar Agora
          </Button>

          <Button
            onClick={universalSync.resetSync}
            variant="outline"
            disabled={universalSync.isLoading}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Informação sobre Partilha */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <div>
            🌐 Todos os dados são partilhados automaticamente entre utilizadores
          </div>
          <div>📱 Sincronização em tempo real em todos os dispositivos</div>
          <div>
            🔄 Alterações são visíveis instantaneamente para toda a equipa
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
