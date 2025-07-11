import React, { useState } from "react";
import { useDataCleanup, useAppCleanupStatus } from "../hooks/useDataCleanup";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Trash2,
  RefreshCw,
  Users,
  Database,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface DataCleanupManagerProps {
  onCleanupComplete?: () => void;
  autoCleanOnMount?: boolean;
}

export function DataCleanupManager({
  onCleanupComplete,
  autoCleanOnMount = false,
}: DataCleanupManagerProps) {
  const {
    isLoading,
    lastResult,
    error,
    cleanupStats,
    cleanAllData,
    clearDeviceMemory,
    initializeCleanApp,
    ensureUserSync,
    refreshStats,
  } = useDataCleanup();

  const { needsCleanup, isClean, hasData } = useAppCleanupStatus();
  const [showDetails, setShowDetails] = useState(false);

  // Auto-clean on mount if requested
  React.useEffect(() => {
    if (autoCleanOnMount && needsCleanup) {
      handleFullCleanup();
    }
  }, [autoCleanOnMount, needsCleanup]);

  const handleCleanData = async () => {
    const result = await cleanAllData();
    if (result.success && onCleanupComplete) {
      onCleanupComplete();
    }
  };

  const handleFullCleanup = async () => {
    await initializeCleanApp();
    if (onCleanupComplete) {
      onCleanupComplete();
    }
  };

  const handleEnsureSync = async () => {
    await ensureUserSync();
  };

  const handleClearDeviceMemory = async () => {
    const confirmMessage =
      "⚠️ ATENÇÃO: Esta operação irá eliminar TODA a memória do dispositivo!\n\n" +
      "Isto inclui:\n" +
      "• Todos os dados da aplicação\n" +
      "• Preferências e configurações\n" +
      "• Cache do navegador\n" +
      "• Dados de sessão\n\n" +
      "A página será recarregada automaticamente após a limpeza.\n\n" +
      "Tem a certeza que pretende continuar?";

    if (window.confirm(confirmMessage)) {
      await clearDeviceMemory();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleString("pt-PT");
  };

  return (
    <div className="space-y-4">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estado da Aplicação
              </CardTitle>
              <CardDescription>
                Gestão de dados e sincronização de utilizadores
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isClean ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Limpa
                </Badge>
              ) : hasData ? (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Com Dados
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200"
                >
                  <Info className="h-3 w-3 mr-1" />
                  Vazia
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Última Limpeza</div>
              <div className="font-medium">
                {formatDate(cleanupStats.lastCleanup)}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Estado Local</div>
              <div className="font-medium">
                {cleanupStats.localStorageEmpty ? "Vazio" : "Com Dados"}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Estado Geral</div>
              <div className="font-medium">
                {isClean ? "Limpa" : hasData ? "Com Dados" : "Indeterminado"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleCleanData}
              disabled={isLoading}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isLoading ? "A Limpar..." : "Limpar Dados"}
            </Button>

            <Button
              onClick={handleClearDeviceMemory}
              disabled={isLoading}
              variant="destructive"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 border-red-600"
            >
              <Database className="h-4 w-4" />
              {isLoading ? "A Limpar..." : "Limpar Memória do Dispositivo"}
            </Button>

            <Button
              onClick={handleFullCleanup}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Inicialização Limpa
            </Button>

            <Button
              onClick={handleEnsureSync}
              disabled={isLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Verificar Sincronização
            </Button>

            <Button
              onClick={refreshStats}
              disabled={isLoading}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Toggle Details */}
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="link"
            className="p-0 h-auto"
          >
            {showDetails ? "Ocultar Detalhes" : "Mostrar Detalhes"}
          </Button>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {lastResult?.success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {lastResult.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Cleanup Warning */}
      {needsCleanup && !autoCleanOnMount && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            A aplicação contém dados de obras, manutenções e piscinas. Considere
            fazer uma limpeza para começar com um estado limpo.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Results */}
      {showDetails && lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Detalhes da Última Operação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Estado
                  </div>
                  <div
                    className={`text-sm ${lastResult.success ? "text-green-600" : "text-red-600"}`}
                  >
                    {lastResult.success ? "Sucesso" : "Falha"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Mensagem
                  </div>
                  <div className="text-sm">{lastResult.message}</div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Firestore (Eliminações)
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    Piscinas: {lastResult.details.firestoreDeleted.pools}
                  </div>
                  <div>Obras: {lastResult.details.firestoreDeleted.works}</div>
                  <div>
                    Manutenções:{" "}
                    {lastResult.details.firestoreDeleted.maintenance}
                  </div>
                  <div>
                    Clientes: {lastResult.details.firestoreDeleted.clients}
                  </div>
                  <div>
                    Intervenções:{" "}
                    {lastResult.details.firestoreDeleted.interventions}
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Outros Sistemas
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    Realtime DB:{" "}
                    {lastResult.details.realtimeDbCleared ? (
                      <span className="text-green-600">Limpo</span>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                  <div>
                    Local Storage:{" "}
                    {lastResult.details.localStorageCleared ? (
                      <span className="text-green-600">Limpo</span>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Limpar Dados:</strong> Remove todas as obras, manutenções
              e piscinas dos sistemas Firebase e armazenamento local.
            </p>
            <p>
              <strong>Limpar Memória do Dispositivo:</strong> Remove TODA a
              memória do dispositivo incluindo localStorage, sessionStorage,
              cache e dados de sessão. A página será recarregada
              automaticamente.
            </p>
            <p>
              <strong>Inicialização Limpa:</strong> Faz uma limpeza completa e
              configura a aplicação para um estado inicial limpo.
            </p>
            <p>
              <strong>Verificar Sincronização:</strong> Testa e configura a
              sincronização de utilizadores com o Firebase.
            </p>
            <p className="text-red-600">
              <strong>⚠️ Aviso:</strong> Estas operações são irreversíveis,
              especialmente a limpeza da memória do dispositivo. Certifique-se
              de que tem backups se necessário.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataCleanupManager;
