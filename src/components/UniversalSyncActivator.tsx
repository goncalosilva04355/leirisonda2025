import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Users,
  Smartphone,
  Database,
  ArrowRight,
} from "lucide-react";
import { useUniversalDataSyncSafe as useUniversalDataSync } from "../hooks/useUniversalDataSyncSafe";

export function UniversalSyncActivator() {
  const universalSync = useUniversalDataSync();
  const [activationStep, setActivationStep] = useState<
    "inactive" | "activating" | "migrating" | "active"
  >("inactive");
  const [activationProgress, setActivationProgress] = useState(0);

  useEffect(() => {
    // Determinar estado atual com base no hook
    if (
      universalSync.syncStatus === "connected" &&
      universalSync.totalItems > 0
    ) {
      setActivationStep("active");
      setActivationProgress(100);
    } else if (
      universalSync.isLoading ||
      universalSync.syncStatus === "syncing"
    ) {
      setActivationStep("migrating");
      setActivationProgress(75);
    } else if (universalSync.syncStatus === "connecting") {
      setActivationStep("activating");
      setActivationProgress(25);
    } else {
      setActivationStep("inactive");
      setActivationProgress(0);
    }
  }, [
    universalSync.syncStatus,
    universalSync.totalItems,
    universalSync.isLoading,
  ]);

  const handleActivateUniversalSync = async () => {
    try {
      setActivationStep("activating");
      setActivationProgress(25);

      // Forçar inicialização e migração
      await universalSync.resetSync();

      setActivationStep("migrating");
      setActivationProgress(75);

      // Aguardar conclusão da sincronização
      await universalSync.forceSyncAll();

      setActivationStep("active");
      setActivationProgress(100);
    } catch (error) {
      console.error("❌ Erro ao ativar sincronização universal:", error);
      setActivationStep("inactive");
      setActivationProgress(0);
    }
  };

  const getStepDescription = () => {
    switch (activationStep) {
      case "inactive":
        return "Sincronização universal não está ativa. Os dados podem não estar partilhados entre utilizadores.";
      case "activating":
        return "Ativando sincronização universal e conectando ao Firebase...";
      case "migrating":
        return "Migrando dados locais para partilha global. Todos os utilizadores terão acesso aos mesmos dados.";
      case "active":
        return "Sincronização universal ativa! Todos os dados são partilhados em tempo real entre utilizadores.";
      default:
        return "";
    }
  };

  const getStepIcon = () => {
    switch (activationStep) {
      case "inactive":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case "activating":
      case "migrating":
        return <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />;
      case "active":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      default:
        return <Globe className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (activationStep) {
      case "inactive":
        return <Badge variant="destructive">Inativo</Badge>;
      case "activating":
        return <Badge className="bg-blue-500">Ativando</Badge>;
      case "migrating":
        return <Badge className="bg-blue-500">Migrando</Badge>;
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Ativo
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStepIcon()}
            Sincronização Universal de Dados
          </div>
          {getStatusBadge()}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Garantir que todas as obras, manutenções, piscinas e clientes sejam
          partilhados entre todos os utilizadores
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da Ativação</span>
            <span>{activationProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${activationProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Descrição do Estado Atual */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{getStepDescription()}</p>
        </div>

        {/* Estatísticas Atuais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">
              {universalSync.totalItems}
            </div>
            <div className="text-sm text-blue-600">Total de Registos</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-800">
              {activationStep === "active" ? "100" : "0"}%
            </div>
            <div className="text-sm text-green-600">Partilhado</div>
          </div>
        </div>

        {/* Detalhes dos Dados */}
        {universalSync.totalItems > 0 && (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-semibold">{universalSync.obras.length}</div>
              <div className="text-xs text-gray-600">Obras</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-semibold">
                {universalSync.manutencoes.length}
              </div>
              <div className="text-xs text-gray-600">Manutenções</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-semibold">
                {universalSync.piscinas.length}
              </div>
              <div className="text-xs text-gray-600">Piscinas</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-semibold">
                {universalSync.clientes.length}
              </div>
              <div className="text-xs text-gray-600">Clientes</div>
            </div>
          </div>
        )}

        {/* Problemas/Erros */}
        {universalSync.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
              <AlertTriangle className="h-4 w-4" />
              Problema Detectado
            </div>
            <p className="text-sm text-red-700">{universalSync.error}</p>
          </div>
        )}

        {/* Benefícios da Sincronização Universal */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            Benefícios da Sincronização Universal:
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Todos os utilizadores veem os mesmos dados</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Smartphone className="h-4 w-4 text-green-600" />
              <span>
                Acesso em qualquer dispositivo (telemóvel, tablet, computador)
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-purple-600" />
              <span>Sincronização automática em tempo real</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-orange-600" />
              <span>
                Dados seguros na cloud, sem depender de dispositivos locais
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="space-y-2">
          {activationStep === "inactive" && (
            <Button
              onClick={handleActivateUniversalSync}
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <Globe className="h-5 w-5" />
              Ativar Sincronização Universal
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {(activationStep === "activating" ||
            activationStep === "migrating") && (
            <Button
              disabled
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <RefreshCw className="h-5 w-5 animate-spin" />
              {activationStep === "activating"
                ? "Ativando..."
                : "Migrando Dados..."}
            </Button>
          )}

          {activationStep === "active" && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                <CheckCircle2 className="h-5 w-5" />
                Sincronização Universal Ativa
              </div>
              <Button
                onClick={universalSync.forceSyncAll}
                variant="outline"
                size="sm"
                disabled={universalSync.isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${universalSync.isLoading ? "animate-spin" : ""}`}
                />
                Sincronizar Agora
              </Button>
            </div>
          )}
        </div>

        {/* Nota de Rodapé */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <div>
            💡 A sincronização universal resolve o problema de dados não
            partilhados
          </div>
          <div>
            🔐 Todos os dados ficam seguros no Firebase e são partilhados
            automaticamente
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
