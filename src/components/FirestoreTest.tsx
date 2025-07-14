import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  firestoreService,
  testFirestoreConnection,
} from "../services/firestoreDataService";
import { smartFirestore } from "../utils/smartFirestoreDetection";

export function FirestoreTest() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<string>("");
  const [firestoreStatus, setFirestoreStatus] = useState<any>(null);

  useEffect(() => {
    // Verificar status do Firebase ao carregar
    checkFirebaseStatus();

    // Verificar status do Firestore
    checkFirestoreStatus();
  }, []);

  const checkFirestoreStatus = async () => {
    const status = await smartFirestore.checkFirestoreAvailability();
    setFirestoreStatus(status);
  };

  const checkFirebaseStatus = () => {
    const envVars = {
      VITE_FORCE_FIREBASE: import.meta.env.VITE_FORCE_FIREBASE,
      NETLIFY: import.meta.env.NETLIFY,
      VITE_IS_NETLIFY: import.meta.env.VITE_IS_NETLIFY,
      DEV: import.meta.env.DEV,
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    };

    setFirebaseStatus(JSON.stringify(envVars, null, 2));
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult("Testando conexão...");

    try {
      const result = await testFirestoreConnection();

      if (result) {
        setTestResult("✅ Firestore está funcionando corretamente!");
      } else {
        setTestResult(
          `❌ Firestore não disponível\n\nPossíveis causas:\n1. Firestore não está habilitado no projeto Firebase\n2. Configuração Firebase incorreta\n3. Regras de segurança muito restritivas\n\n💡 A aplicação continua funcional com localStorage`,
        );
      }
    } catch (error: any) {
      let errorMsg = `❌ Erro: ${error.message}`;

      if (error.message.includes("Service firestore is not available")) {
        errorMsg += `\n\n💡 Solução: Habilite Firestore no Firebase Console:\nhttps://console.firebase.google.com/project/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/firestore`;
      }

      setTestResult(errorMsg);
      console.error("Erro no teste:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSaveData = async () => {
    setIsLoading(true);
    setTestResult("Testando gravação de dados...");

    try {
      const testData = {
        nome: "Teste de Obra",
        localizacao: "Local de Teste",
        tipo: "Piscina",
        status: "Em Progresso",
        dataInicio: new Date().toISOString(),
        responsavel: "Teste Utilizador",
        descricao: "Obra de teste para verificar funcionamento do Firestore",
      };

      const docId = await firestoreService.saveFormData("obras", testData);

      if (docId) {
        setTestResult(`✅ Dados gravados com sucesso! ID: ${docId}`);
        console.log("Documento criado com ID:", docId);
      } else {
        setTestResult(
          `❌ Firestore não disponível para gravação\n\n💾 Os dados foram salvos no localStorage como fallback\n💡 Para usar Firestore, habilite-o no Firebase Console`,
        );
      }
    } catch (error: any) {
      let errorMsg = `❌ Erro ao gravar: ${error.message}`;

      if (error.message.includes("Service firestore is not available")) {
        errorMsg += `\n\n💾 Fallback: dados serão salvos no localStorage\n💡 Para usar Firestore, habilite-o no projeto Firebase`;
      }

      setTestResult(errorMsg);
      console.error("Erro na gravação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testReadData = async () => {
    setIsLoading(true);
    setTestResult("Lendo dados...");

    try {
      const obras = await firestoreService.getCollection("obras");

      if (obras && obras.length > 0) {
        setTestResult(
          `✅ ${obras.length} documentos encontrados na coleção 'obras':\n${JSON.stringify(obras, null, 2)}`,
        );
      } else {
        setTestResult("📭 Nenhum documento encontrado na coleção obras");
      }
    } catch (error: any) {
      setTestResult(`❌ Erro ao ler: ${error.message}`);
      console.error("Erro na leitura:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto m-4">
      <CardHeader>
        <CardTitle>Teste do Firestore</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button
            onClick={testConnection}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Testando..." : "Testar Conexão"}
          </Button>

          <Button onClick={testSaveData} disabled={isLoading} variant="outline">
            {isLoading ? "Gravando..." : "Testar Gravação"}
          </Button>

          <Button onClick={testReadData} disabled={isLoading} variant="outline">
            {isLoading ? "Lendo..." : "Testar Leitura"}
          </Button>
        </div>

        {/* Status do Firestore */}
        {firestoreStatus && (
          <div
            className={`p-4 rounded-lg ${firestoreStatus.available ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}
          >
            <h3 className="font-semibold mb-2 flex items-center">
              {firestoreStatus.available ? "✅" : "📱"} Status do Firestore
            </h3>

            <div className="space-y-2">
              <div>
                <strong>Status:</strong>{" "}
                {firestoreStatus.available ? "Disponível" : "Não habilitado"}
              </div>

              {firestoreStatus.projectId && (
                <div>
                  <strong>Projeto:</strong> {firestoreStatus.projectId}
                </div>
              )}

              {firestoreStatus.error && (
                <div>
                  <strong>Informação:</strong> {firestoreStatus.error}
                </div>
              )}
            </div>

            {/* Recomendações */}
            <div className="mt-3">
              <strong>Recomendações:</strong>
              <ul className="mt-1 text-sm space-y-1">
                {smartFirestore.getRecommendations().map((rec, index) => (
                  <li key={index} className="text-gray-700">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {!firestoreStatus.available && (
              <div className="mt-3 p-3 bg-white rounded border">
                <strong>🔧 Como habilitar Firestore:</strong>
                <ol className="mt-2 text-sm space-y-1 list-decimal list-inside">
                  <li>
                    Acesse{" "}
                    <a
                      href={`https://console.firebase.google.com/project/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/firestore`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Firebase Console
                    </a>
                  </li>
                  <li>Clique em "Firestore Database"</li>
                  <li>Clique em "Criar base de dados"</li>
                  <li>Escolha "Modo de teste"</li>
                  <li>Selecione uma localização (ex: eur3)</li>
                  <li>Recarregue esta página</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {testResult && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Resultado:</h3>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}

        <details className="mt-4">
          <summary className="cursor-pointer font-semibold">
            Status das Variáveis de Ambiente
          </summary>
          <pre className="bg-gray-100 p-4 rounded-lg mt-2 text-sm overflow-auto">
            {firebaseStatus}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
