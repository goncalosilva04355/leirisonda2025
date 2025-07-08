import React, { useState } from "react";
import { Share, Users, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { Button } from "./ui/button";
import {
  crossUserDataSync,
  CrossUserSyncResult,
} from "../services/crossUserDataSync";

interface DataSharingFixButtonProps {
  currentUser?: {
    uid: string;
    email: string;
    name: string;
    role: string;
  };
  onComplete?: (result: CrossUserSyncResult) => void;
}

export function DataSharingFixButton({
  currentUser,
  onComplete,
}: DataSharingFixButtonProps) {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<CrossUserSyncResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFixDataSharing = async () => {
    setIsFixing(true);
    setResult(null);

    try {
      console.log("🔧 Iniciando correção da partilha de dados...");

      // Migrate all data to shared collections
      const migrationResult =
        await crossUserDataSync.migrateToSharedData(currentUser);

      // Force immediate cross-user sync
      await crossUserDataSync.forceCrossUserSync();

      setResult(migrationResult);

      if (onComplete) {
        onComplete(migrationResult);
      }

      console.log(
        "✅ Correção da partilha de dados concluída:",
        migrationResult,
      );
    } catch (error) {
      console.error("❌ Erro ao corrigir partilha de dados:", error);

      const errorResult: CrossUserSyncResult = {
        success: false,
        message: "Erro durante a correção",
        details: [
          `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        ],
        dataShared: { pools: 0, works: 0, maintenance: 0, clients: 0 },
      };

      setResult(errorResult);

      if (onComplete) {
        onComplete(errorResult);
      }
    }

    setIsFixing(false);
  };

  const totalDataShared = result
    ? result.dataShared.pools +
      result.dataShared.works +
      result.dataShared.maintenance +
      result.dataShared.clients
    : 0;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Share className="h-8 w-8 text-blue-600" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Corrigir Partilha de Dados Entre Utilizadores
          </h3>

          <p className="text-blue-700 mb-4">
            Se os outros utilizadores (admin, técnicos) não conseguem ver os
            dados que introduziu, use este botão para forçar a sincronização e
            partilha de todos os dados.
          </p>

          <div className="space-y-3">
            {!result && (
              <Button
                onClick={handleFixDataSharing}
                disabled={isFixing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isFixing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Corrigindo Partilha de Dados...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Corrigir Partilha de Dados Agora
                  </>
                )}
              </Button>
            )}

            {result && (
              <div
                className={`rounded-lg p-4 ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <h4
                    className={`font-medium ${
                      result.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.message}
                  </h4>
                </div>

                {result.success && totalDataShared > 0 && (
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-700">
                        {result.dataShared.pools}
                      </div>
                      <div className="text-xs text-green-600">Piscinas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-700">
                        {result.dataShared.works}
                      </div>
                      <div className="text-xs text-green-600">Obras</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-700">
                        {result.dataShared.maintenance}
                      </div>
                      <div className="text-xs text-green-600">Manutenções</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-700">
                        {result.dataShared.clients}
                      </div>
                      <div className="text-xs text-green-600">Clientes</div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="outline"
                  size="sm"
                  className="mb-3"
                >
                  {showDetails ? "Ocultar" : "Ver"} Detalhes
                </Button>

                {showDetails && (
                  <div className="space-y-2">
                    {result.details.map((detail, index) => (
                      <div
                        key={index}
                        className={`text-sm ${
                          result.success ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {detail}
                      </div>
                    ))}
                  </div>
                )}

                {result.success && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Dados agora partilhados com todos os utilizadores!
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Os administradores e técnicos podem agora ver todos os
                      dados que introduziu.
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setResult(null);
                    setShowDetails(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Corrigir Novamente
                </Button>
              </div>
            )}

            <div className="text-xs text-blue-600">
              <strong>O que esta função faz:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>
                  Migra todos os dados para coleções partilhadas no Firebase
                </li>
                <li>
                  Configura sincronização em tempo real entre utilizadores
                </li>
                <li>Garante que todos os utilizadores veem os mesmos dados</li>
                <li>Mantém os dados seguros e acessíveis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
