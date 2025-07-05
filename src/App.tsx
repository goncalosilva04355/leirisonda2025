import React, { useState } from "react";

function App() {
  const [works, setWorks] = useState([
    {
      id: 1,
      title: "Obra Exemplo",
      client: "Cliente Exemplo",
      location: "Local Exemplo",
      status: "pending",
    },
  ]);

  const [editingWork, setEditingWork] = useState(null);

  const handleSaveEdit = () => {
    try {
      const title = document.getElementById("edit-title").value;
      const client = document.getElementById("edit-client").value;
      const status = document.getElementById("edit-status").value;

      setWorks(
        works.map((work) =>
          work.id === editingWork.id
            ? { ...work, title, client, status }
            : work,
        ),
      );

      alert("�� Obra atualizada com sucesso!");
      setEditingWork(null);
    } catch (error) {
      alert("❌ Erro ao atualizar obra");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Leirisonda - Sistema Simplificado
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Obras ({works.length})</h2>

        <div className="space-y-4">
          {works.map((work) => (
            <div
              key={work.id}
              className="border rounded p-4 flex justify-between"
            >
              <div>
                <h3 className="font-semibold">{work.title}</h3>
                <p>Cliente: {work.client}</p>
                <p>Status: {work.status}</p>
              </div>
              <button
                onClick={() => setEditingWork(work)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Obra</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
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
                <label className="block text-sm font-medium mb-1">Status</label>
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
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Guardar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
