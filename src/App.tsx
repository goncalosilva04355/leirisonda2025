import React, { useState, useEffect } from "react";
import { AutoSyncProvider } from "./components/AutoSyncProvider";
import { useDataSync } from "./hooks/useDataSync";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: any;
}

function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingWork, setEditingWork] = useState<any>(null);

  // Auto-login para teste
  useEffect(() => {
    const testUser = {
      id: 1,
      name: "Gonçalo Fonseca",
      email: "gongonsilva@gmail.com",
      role: "super_admin",
      permissions: {
        obras: { view: true, create: true, edit: true, delete: true },
        manutencoes: { view: true, create: true, edit: true, delete: true },
        piscinas: { view: true, create: true, edit: true, delete: true },
        relatorios: { view: true, create: true, edit: true, delete: true },
        utilizadores: { view: true, create: true, edit: true, delete: true },
        admin: { view: true, create: true, edit: true, delete: true },
        dashboard: { view: true },
      },
    };
    setCurrentUser(testUser);
    setIsAuthenticated(true);
  }, []);

  const dataSync = useDataSync();
  const { works, addWork, updateWork } = dataSync;

  const createTestWork = () => {
    const testWork = {
      title: "Obra de Teste " + Date.now(),
      type: "piscina",
      client: "Cliente Teste",
      contact: "912345678",
      location: "Local Teste",
      startTime: "09:00",
      endTime: "17:00",
      status: "pending",
      description: "Descrição de teste",
      budget: 1000,
      assignedTo: currentUser?.name || "",
      assignedUsers: currentUser
        ? [{ id: currentUser.id.toString(), name: currentUser.name }]
        : [],
      assignedUserIds: currentUser ? [currentUser.id.toString()] : [],
      vehicles: [],
      technicians: [],
      photos: [],
      photoCount: 0,
      observations: "",
      workPerformed: "",
      workSheetCompleted: false,
    };
    addWork(testWork);
  };

  if (!currentUser) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <AutoSyncProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-8">
            Leirisonda - Sistema de Gestão
          </h1>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Bem-vindo, {currentUser.name}
            </h2>
            <p className="text-gray-600 mb-4">
              Sistema funcionando correctamente!
            </p>

            <button
              onClick={createTestWork}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Criar Obra de Teste
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Obras no Sistema ({works.length})
            </h3>

            {works.length === 0 ? (
              <p className="text-gray-500">
                Nenhuma obra encontrada. Clique no botão acima para criar uma.
              </p>
            ) : (
              <div className="space-y-3">
                {works.map((work) => (
                  <div
                    key={work.id}
                    className="border rounded p-4 flex justify-between items-start"
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
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AutoSyncProvider>
  );
}

export default App;
