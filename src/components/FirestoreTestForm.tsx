import React, { useState } from "react";
import { Database, Save, TestTube, Trash2 } from "lucide-react";
import {
  saveFormToFirestore,
  testFirestoreConnection,
  getFirestoreCollection,
  deleteFirestoreDocument,
} from "../services/firestoreDataService";

interface TestFormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

export const FirestoreTestForm: React.FC = () => {
  const [formData, setFormData] = useState<TestFormData>({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [savedId, setSavedId] = useState<string | null>(null);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");

  // Testar conexão com Firestore
  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const isConnected = await testFirestoreConnection();
      setConnectionStatus(isConnected ? "connected" : "disconnected");
      setStatus(isConnected ? "success" : "error");
    } catch (error) {
      console.error("Erro no teste de conexão:", error);
      setConnectionStatus("disconnected");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Gravar formulário no Firestore
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("saving");

    try {
      // Validação básica
      if (!formData.nome.trim() || !formData.email.trim()) {
        alert("Por favor, preencha pelo menos o nome e email");
        setStatus("error");
        return;
      }

      // Gravar no Firestore na coleção "test_forms"
      const docId = await saveFormToFirestore("test_forms", {
        ...formData,
        source: "FirestoreTestForm",
        userAgent: navigator.userAgent,
      });

      if (docId) {
        setSavedId(docId);
        setStatus("success");
        console.log(`✅ Formulário gravado com ID: ${docId}`);

        // Limpar formulário após sucesso
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          mensagem: "",
        });
      } else {
        setStatus("error");
        console.error("❌ Falha ao gravar formulário");
      }
    } catch (error) {
      console.error("❌ Erro ao gravar formulário:", error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar todos os documentos da coleção
  const handleLoadDocuments = async () => {
    setIsLoading(true);
    try {
      const documents = await getFirestoreCollection("test_forms");
      setAllDocuments(documents);
      console.log(`📋 Carregados ${documents.length} documentos`);
    } catch (error) {
      console.error("❌ Erro ao carregar documentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar documento
  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Tem a certeza que quer eliminar este documento?")) {
      return;
    }

    try {
      const success = await deleteFirestoreDocument("test_forms", docId);
      if (success) {
        setAllDocuments((prev) => prev.filter((doc) => doc.id !== docId));
        console.log(`✅ Documento ${docId} eliminado`);
      }
    } catch (error) {
      console.error("❌ Erro ao eliminar documento:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Database className="h-6 w-6" />
        <span>Teste de Gravação Firestore</span>
      </h2>

      {/* Status da Conexão */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Status da Conexão</h3>
          <button
            onClick={handleTestConnection}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            <TestTube className="h-4 w-4" />
            <span>Testar</span>
          </button>
        </div>

        <div className="text-sm">
          {connectionStatus === "unknown" && (
            <span className="text-gray-500">
              🔄 Status desconhecido - clique em "Testar"
            </span>
          )}
          {connectionStatus === "connected" && (
            <span className="text-green-600">✅ Conectado ao Firestore</span>
          )}
          {connectionStatus === "disconnected" && (
            <span className="text-red-600">❌ Não conectado ao Firestore</span>
          )}
        </div>
      </div>

      {/* Formulário de Teste */}
      <form onSubmit={handleSaveForm} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
            placeholder="Digite seu nome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="+351 xxx xxx xxx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem
          </label>
          <textarea
            name="mensagem"
            value={formData.mensagem}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="Escreva sua mensagem aqui..."
          />
        </div>

        {/* Status da Gravação */}
        {status !== "idle" && (
          <div
            className={`p-3 rounded-md text-sm ${
              status === "saving"
                ? "bg-blue-50 text-blue-700"
                : status === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            {status === "saving" && "💾 Guardando dados..."}
            {status === "success" && (
              <>
                ✅ Dados gravados com sucesso!
                {savedId && <span className="block mt-1">ID: {savedId}</span>}
              </>
            )}
            {status === "error" && "❌ Erro ao gravar dados"}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || status === "saving"}
          className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? "A gravar..." : "Gravar no Firestore"}</span>
        </button>
      </form>

      {/* Carregar e Mostrar Documentos */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Documentos Gravados</h3>
          <button
            onClick={handleLoadDocuments}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            <Database className="h-4 w-4" />
            <span>Carregar</span>
          </button>
        </div>

        {allDocuments.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-gray-50 rounded border text-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{doc.nome}</div>
                    <div className="text-gray-600">{doc.email}</div>
                    {doc.telefone && (
                      <div className="text-gray-600">{doc.telefone}</div>
                    )}
                    {doc.mensagem && (
                      <div className="text-gray-700 mt-1">{doc.mensagem}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      ID: {doc.id}
                      {doc.timestamp && (
                        <span className="ml-2">
                          Data:{" "}
                          {doc.timestamp.toDate?.()?.toLocaleString() || "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="ml-2 p-1 text-red-500 hover:text-red-700"
                    title="Eliminar documento"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {allDocuments.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            Nenhum documento encontrado. Clique em "Carregar" para verificar.
          </div>
        )}
      </div>
    </div>
  );
};
