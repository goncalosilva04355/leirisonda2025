import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { useAuth } from "@/components/AuthProvider";

export function SyncTestButton() {
  const { user } = useAuth();
  const { createWork, works, isOnline, syncData } = useFirebaseSync();
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Só mostrar para o Gonçalo
  if (!user || user.email !== "gongonsilva@gmail.com") {
    return null;
  }

  const runSyncTest = async () => {
    setIsRunning(true);
    setTestResult(null);

    try {
      console.log("🧪 INICIANDO TESTE COMPLETO DE SINCRONIZAÇÃO...");

      const startTime = Date.now();
      const timestamp = new Date().toISOString();

      // 1. Criar obra teste
      const testWork = {
        workSheetNumber: `SYNC-TEST-${startTime}`,
        type: "piscina" as const,
        clientName: `🧪 TESTE SYNC ${timestamp}`,
        address: "Endereço de teste",
        contact: "123456789",
        entryTime: new Date().toISOString(),
        status: "pendente" as const,
        vehicles: ["Viatura Teste"],
        technicians: ["Técnico Teste"],
        assignedUsers: ["user_alexandre"],
        photos: [],
        observations: `Obra de teste criada em ${timestamp}`,
        workPerformed: "Teste de sincronização",
        workSheetCompleted: false,
      };

      console.log("📤 Criando obra teste...");
      const workId = await createWork(testWork);
      console.log(`✅ Obra teste criada: ${workId}`);

      // 2. Aguardar um pouco para propagação
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 3. Forçar sincronização
      console.log("🔄 Forçando sincronização...");
      await syncData();
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 4. Verificar múltiplas fontes
      const localStorage1 = JSON.parse(localStorage.getItem("works") || "[]");
      const localStorage2 = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );
      const sessionStorage1 = JSON.parse(
        sessionStorage.getItem("temp_works") || "[]",
      );

      const foundInLS1 = localStorage1.find((w: any) => w.id === workId);
      const foundInLS2 = localStorage2.find((w: any) => w.id === workId);
      const foundInSS = sessionStorage1.find((w: any) => w.id === workId);
      const foundInSync = works.find((w) => w.id === workId);

      const endTime = Date.now();
      const duration = endTime - startTime;

      const result = {
        workId,
        duration: `${duration}ms`,
        success: !!(foundInLS1 && foundInLS2 && foundInSS && foundInSync),
        storageStatus: {
          localStorage1: !!foundInLS1,
          localStorage2: !!foundInLS2,
          sessionStorage: !!foundInSS,
          syncedWorks: !!foundInSync,
        },
        isOnline,
        timestamp,
        assignedToAlexandre:
          foundInSync?.assignedUsers?.includes("user_alexandre") || false,
      };

      console.log("🧪 RESULTADO DO TESTE:", result);

      if (result.success) {
        setTestResult(`✅ TESTE APROVADO
Obra criada e sincronizada com sucesso!
ID: ${workId}
Duração: ${duration}ms
Atribuída ao Alexandre: ${result.assignedToAlexandre ? "Sim" : "Não"}

AGORA TESTE NO DISPOSITIVO DO ALEXANDRE:
- Abra a app no dispositivo dele
- Vá ao Dashboard
- Procure por: "${testWork.clientName}"
- Deve aparecer na seção "Suas Obras Atribuídas"`);
      } else {
        setTestResult(`❌ TESTE FALHADO
Problema na sincronização detectado!
ID: ${workId}
Duração: ${duration}ms

Status dos storages:
- localStorage 'works': ${result.storageStatus.localStorage1 ? "✅" : "❌"}
- localStorage 'leirisonda_works': ${result.storageStatus.localStorage2 ? "✅" : "❌"}
- sessionStorage 'temp_works': ${result.storageStatus.sessionStorage ? "✅" : "❌"}
- useFirebaseSync: ${result.storageStatus.syncedWorks ? "✅" : "❌"}
- Online: ${isOnline ? "✅" : "❌"}

AÇÃO NECESSÁRIA: Verificar configuração Firebase`);
      }
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      setTestResult(`❌ ERRO NO TESTE
${error instanceof Error ? error.message : String(error)}

Verifique:
1. Conexão com internet
2. Configuração Firebase
3. Permissões do navegador`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={runSyncTest}
        disabled={isRunning}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <RefreshCw
          className={`w-4 h-4 mr-2 ${isRunning ? "animate-spin" : ""}`}
        />
        {isRunning ? "Testando..." : "🧪 Teste Completo de Sync"}
      </Button>

      {testResult && (
        <div
          className={`p-4 rounded-lg border ${
            testResult.includes("APROVADO")
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start space-x-2">
            {testResult.includes("APROVADO") ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <pre className="text-sm font-mono whitespace-pre-wrap text-gray-900">
              {testResult}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
