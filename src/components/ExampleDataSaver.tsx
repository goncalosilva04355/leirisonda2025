import React, { useState } from "react";
import { useObras, useFirestore } from "../hooks/useFirestore";
import { Save, Plus, RefreshCw } from "lucide-react";

// Exemplo de formulário para salvar uma obra
export const ExampleObraSaver: React.FC = () => {
  const { save, documents: obras, loading, error, refresh } = useObras();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    status: "Em andamento",
    responsavel: "",
    dataInicio: "",
    dataFim: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const docId = await save(formData);
      if (docId) {
        console.log("✅ Obra salva com sucesso:", docId);
        // Limpar formulário
        setFormData({
          nome: "",
          descricao: "",
          status: "Em andamento",
          responsavel: "",
          dataInicio: "",
          dataFim: "",
        });
      }
    } catch (err) {
      console.error("❌ Erro ao salvar obra:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nova Obra</h2>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          Erro: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome da Obra *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            value={formData.nome}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome da obra"
          />
        </div>

        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição da obra"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Em andamento">Em andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Pausada">Pausada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="responsavel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Responsável
          </label>
          <input
            type="text"
            id="responsavel"
            name="responsavel"
            value={formData.responsavel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do responsável"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dataInicio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data de Início
            </label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="dataFim"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data de Fim
            </label>
            <input
              type="date"
              id="dataFim"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || !formData.nome.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "A salvar..." : "Salvar Obra"}
        </button>
      </form>

      {/* Lista de obras salvas */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Obras Salvas ({obras.length})
        </h3>

        {obras.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma obra salva ainda.
          </p>
        ) : (
          <div className="space-y-2">
            {obras.map((obra) => (
              <div
                key={obra.id}
                className="p-3 border border-gray-200 rounded-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{obra.nome}</h4>
                    {obra.descricao && (
                      <p className="text-sm text-gray-600">{obra.descricao}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {obra.status}
                  </span>
                </div>
                {obra.responsavel && (
                  <p className="text-sm text-gray-500 mt-1">
                    Responsável: {obra.responsavel}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Exemplo de hook personalizado para uma coleção específica
export const useCustomData = () => {
  return useFirestore<{
    id?: string;
    titulo: string;
    conteudo: string;
    tipo: "nota" | "tarefa" | "lembrete";
    importante: boolean;
    createdAt?: any;
    updatedAt?: any;
  }>({
    collection: "dados_personalizados",
    autoLoad: true,
  });
};

// Exemplo de componente simples para testar salvamento
export const SimpleDataTester: React.FC = () => {
  const { save, documents, loading } = useCustomData();
  const [testData, setTestData] = useState({
    titulo: "",
    conteudo: "",
    tipo: "nota" as const,
    importante: false,
  });

  const handleSave = async () => {
    if (!testData.titulo.trim()) return;

    const result = await save(testData);
    if (result) {
      setTestData({
        titulo: "",
        conteudo: "",
        tipo: "nota",
        importante: false,
      });
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Teste de Salvamento</h3>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Título"
          value={testData.titulo}
          onChange={(e) => setTestData({ ...testData, titulo: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Conteúdo"
          value={testData.conteudo}
          onChange={(e) =>
            setTestData({ ...testData, conteudo: e.target.value })
          }
          className="w-full p-2 border rounded"
          rows={3}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={testData.importante}
            onChange={(e) =>
              setTestData({ ...testData, importante: e.target.checked })
            }
          />
          Importante
        </label>

        <button
          onClick={handleSave}
          disabled={!testData.titulo.trim()}
          className="w-full p-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Salvar
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {loading ? "Carregando..." : `${documents.length} itens salvos`}
        </p>
      </div>
    </div>
  );
};
