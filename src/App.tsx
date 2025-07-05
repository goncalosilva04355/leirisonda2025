import React, { useState, useEffect } from "react";
import { Building2, Edit2, X, Plus } from "lucide-react";
import { useDataSync } from "./hooks/useDataSync_simple";

// Mock users
const initialUsers = [
  {
    id: 1,
    name: "Gonçalo Fonseca",
    email: "gongonsilva@gmail.com",
    role: "super_admin",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: true },
    },
    active: true,
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [editingWork, setEditingWork] = useState(null);

  // Auto-login
  useEffect(() => {
    const user = initialUsers[0];
    setCurrentUser(user);
    setIsAuthenticated(true);
  }, []);

  // Data sync
  const { works, addWork, updateWork } = useDataSync();

  const createTestWork = () => {
    const testWork = {
      title: "Obra Teste " + Date.now(),
      type: "piscina",
      client: "Cliente Teste",
      contact: "912345678",
      location: "Local Teste",
      status: "pending",
      description: "Descrição de teste",
      assignedTo: currentUser?.name || "",
      observations: "",
      workPerformed: "",
    };
    addWork(testWork);
  };

  const handleEditWork = async (workId, updates) => {
    try {
      await updateWork(workId, updates);
      alert("✅ Obra atualizada com sucesso!");
      setEditingWork(null);
    } catch (error) {
      alert("❌ Erro ao atualizar obra");
    }
  };

  if (!currentUser) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">
          Leirisonda - Sistema de Gestão
        </h1>

        {/* Navigation */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`px-4 py-2 rounded ${
              activeSection === "dashboard"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection("obras")}
            className={`px-4 py-2 rounded ${
              activeSection === "obras"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Obras
          </button>
        </div>

        {/* Dashboard */}
        {activeSection === "dashboard" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Bem-vindo, {currentUser.name}
              </h2>
              <p className="text-gray-600 mb-4">
                Sistema funcionando corretamente!
              </p>
              <button
                onClick={createTestWork}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Plus className="inline mr-2 h-4 w-4" />
                Criar Obra de Teste
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Obras no Sistema ({works.length})
              </h3>
              {works.length === 0 ? (
                <p className="text-gray-500">Nenhuma obra encontrada.</p>
              ) : (
                <div className="space-y-3">
                  {works.slice(0, 5).map((work) => (
                    <div
                      key={work.id}
                      className="border rounded p-4 flex justify-between"
                    >
                      <div>
                        <h4 className="font-medium">{work.title}</h4>
                        <p className="text-sm text-gray-600">
                          Cliente: {work.client}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {work.status}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingWork(work)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Obras Section */}
        {activeSection === "obras" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestão de Obras</h2>
              <button
                onClick={createTestWork}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Plus className="inline mr-2 h-4 w-4" />
                Nova Obra
              </button>
            </div>

            <div className="space-y-4">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="border rounded p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{work.title}</h3>
                    <p className="text-gray-600">Cliente: {work.client}</p>
                    <p className="text-gray-600">Local: {work.location}</p>
                    <p className="text-gray-600">Status: {work.status}</p>
                  </div>
                  <button
                    onClick={() => setEditingWork(work)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingWork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Editar Obra</h3>
                <button
                  onClick={() => setEditingWork(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    defaultValue={editingWork.title}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cliente
                  </label>
                  <input
                    type="text"
                    id="edit-client"
                    defaultValue={editingWork.client}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    id="edit-location"
                    defaultValue={editingWork.location}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    defaultValue={editingWork.status}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="pending">Pendente</option>
                    <option value="in_progress">Em Progresso</option>
                    <option value="completed">Concluída</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  onClick={() => setEditingWork(null)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const title = document.getElementById("edit-title").value;
                    const client = document.getElementById("edit-client").value;
                    const location =
                      document.getElementById("edit-location").value;
                    const status = document.getElementById("edit-status").value;

                    handleEditWork(editingWork.id, {
                      title,
                      client,
                      location,
                      status,
                    });
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Guardar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
