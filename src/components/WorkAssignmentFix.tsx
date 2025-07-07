import React, { useState, useEffect } from "react";
import {
  Users,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Wrench,
  Database,
  RotateCw,
  UserPlus,
  UserCheck,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "super_admin";
  permissions: {
    obras: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    manutencoes: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    piscinas: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    utilizadores: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    relatorios: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    clientes: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
  active: boolean;
  createdAt: string;
}

interface MockUser {
  uid: string;
  email: string;
  password: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

export const WorkAssignmentFix: React.FC = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResults, setFixResults] = useState<string[]>([]);
  const [usersAnalysis, setUsersAnalysis] = useState<{
    appUsers: User[];
    mockUsers: MockUser[];
    syncIssues: string[];
  }>({
    appUsers: [],
    mockUsers: [],
    syncIssues: [],
  });

  // Analyze user synchronization issues
  const analyzeUsers = () => {
    const appUsers: User[] = JSON.parse(
      localStorage.getItem("app-users") || "[]",
    );
    const mockUsers: MockUser[] = JSON.parse(
      localStorage.getItem("mock-users") || "[]",
    );

    const syncIssues: string[] = [];

    // Check for missing users in app-users
    mockUsers.forEach((mockUser) => {
      const found = appUsers.find(
        (appUser) => appUser.email === mockUser.email,
      );
      if (!found) {
        syncIssues.push(
          `Utilizador "${mockUser.name}" (${mockUser.email}) existe em mock-users mas não em app-users`,
        );
      }
    });

    // Check for missing users in mock-users
    appUsers.forEach((appUser) => {
      const found = mockUsers.find(
        (mockUser) => mockUser.email === appUser.email,
      );
      if (!found) {
        syncIssues.push(
          `Utilizador "${appUser.name}" (${appUser.email}) existe em app-users mas não em mock-users`,
        );
      }
    });

    // Check for inactive users
    appUsers.forEach((user) => {
      if (!user.active) {
        syncIssues.push(
          `Utilizador "${user.name}" está inativo e não aparecerá na lista de atribuição`,
        );
      }
    });

    // Log detailed user information for debugging
    console.log("=== ANÁLISE DETALHADA DE UTILIZADORES ===");
    console.log("App Users:", appUsers.length, appUsers);
    console.log("Mock Users:", mockUsers.length, mockUsers);
    console.log("Sync Issues:", syncIssues);

    // Check active vs inactive users
    const activeAppUsers = appUsers.filter((u) => u.active);
    const inactiveAppUsers = appUsers.filter((u) => !u.active);
    console.log(
      "Utilizadores ativos:",
      activeAppUsers.length,
      activeAppUsers.map((u) => u.name),
    );
    console.log(
      "Utilizadores inativos:",
      inactiveAppUsers.length,
      inactiveAppUsers.map((u) => u.name),
    );

    setUsersAnalysis({
      appUsers,
      mockUsers,
      syncIssues,
    });
  };

  // Create example users if only Gonçalo exists
  const createExampleUsers = () => {
    const exampleUsers = [
      {
        id: "2",
        name: "José Silva",
        email: "jose.silva@leirisonda.com",
        password: "123456",
        role: "user",
        permissions: {
          obras: { view: true, create: false, edit: false, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: false, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        },
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Maria Santos",
        email: "maria.santos@leirisonda.com",
        password: "123456",
        role: "user",
        permissions: {
          obras: { view: true, create: false, edit: false, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: false, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        },
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "António Costa",
        email: "antonio.costa@leirisonda.com",
        password: "123456",
        role: "user",
        permissions: {
          obras: { view: true, create: false, edit: false, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: false, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        },
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Get existing users
    const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
    const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "[]");

    // Add example users to app-users
    const updatedAppUsers = [...appUsers, ...exampleUsers];
    localStorage.setItem("app-users", JSON.stringify(updatedAppUsers));

    // Add to mock-users too
    const mockExampleUsers = exampleUsers.map((user) => ({
      uid: `mock-${user.id}`,
      email: user.email,
      password: user.password,
      name: user.name,
      role:
        user.role === "super_admin"
          ? "super_admin"
          : user.role === "admin"
            ? "manager"
            : "technician",
      active: user.active,
      createdAt: user.createdAt,
    }));

    const updatedMockUsers = [...mockUsers, ...mockExampleUsers];
    localStorage.setItem("mock-users", JSON.stringify(updatedMockUsers));

    console.log("✅ Utilizadores de exemplo criados:", exampleUsers.length);
    return exampleUsers.length;
  };

  // Fix user synchronization issues
  const fixUserSync = async () => {
    setIsFixing(true);
    setFixResults([]);
    const results: string[] = [];

    try {
      // Load current data
      const appUsers: User[] = JSON.parse(
        localStorage.getItem("app-users") || "[]",
      );
      const mockUsers: MockUser[] = JSON.parse(
        localStorage.getItem("mock-users") || "[]",
      );

      // Convert roles between systems
      const convertMockRoleToAppRole = (
        mockRole: "super_admin" | "manager" | "technician",
      ): "user" | "admin" | "super_admin" => {
        switch (mockRole) {
          case "super_admin":
            return "super_admin";
          case "manager":
            return "admin";
          case "technician":
            return "user";
          default:
            return "user";
        }
      };

      const convertAppRoleToMockRole = (
        appRole: "user" | "admin" | "super_admin",
      ): "super_admin" | "manager" | "technician" => {
        switch (appRole) {
          case "super_admin":
            return "super_admin";
          case "admin":
            return "manager";
          case "user":
            return "technician";
          default:
            return "technician";
        }
      };

      // Generate default permissions
      const getDefaultPermissions = (role: string) => {
        const isAdmin = role === "admin" || role === "super_admin";
        return {
          obras: {
            view: true,
            create: isAdmin,
            edit: isAdmin,
            delete: isAdmin,
          },
          manutencoes: {
            view: true,
            create: true,
            edit: true,
            delete: isAdmin,
          },
          piscinas: {
            view: true,
            create: isAdmin,
            edit: isAdmin,
            delete: isAdmin,
          },
          utilizadores: {
            view: isAdmin,
            create: isAdmin,
            edit: isAdmin,
            delete: isAdmin,
          },
          relatorios: {
            view: true,
            create: isAdmin,
            edit: isAdmin,
            delete: isAdmin,
          },
          clientes: {
            view: true,
            create: isAdmin,
            edit: isAdmin,
            delete: isAdmin,
          },
        };
      };

      // Sync mock users to app users
      for (const mockUser of mockUsers) {
        const existingAppUser = appUsers.find(
          (u) => u.email === mockUser.email,
        );

        if (!existingAppUser) {
          const newAppUser: User = {
            id: mockUser.uid.replace("mock-", ""),
            name: mockUser.name,
            email: mockUser.email,
            password: mockUser.password,
            role: convertMockRoleToAppRole(mockUser.role),
            permissions: getDefaultPermissions(
              convertMockRoleToAppRole(mockUser.role),
            ),
            active: mockUser.active,
            createdAt: mockUser.createdAt,
          };

          appUsers.push(newAppUser);
          results.push(
            `✅ Sincronizado utilizador "${mockUser.name}" para app-users`,
          );
        }
      }

      // Sync app users to mock users
      for (const appUser of appUsers) {
        const existingMockUser = mockUsers.find(
          (u) => u.email === appUser.email,
        );

        if (!existingMockUser) {
          const newMockUser: MockUser = {
            uid: `mock-${appUser.id}`,
            email: appUser.email,
            password: appUser.password,
            name: appUser.name,
            role: convertAppRoleToMockRole(appUser.role),
            active: appUser.active,
            createdAt: appUser.createdAt,
          };

          mockUsers.push(newMockUser);
          results.push(
            `✅ Sincronizado utilizador "${appUser.name}" para mock-users`,
          );
        }
      }

      // Activate all users if they're inactive
      let activatedCount = 0;
      appUsers.forEach((user) => {
        if (!user.active) {
          user.active = true;
          activatedCount++;
        }
      });

      if (activatedCount > 0) {
        results.push(`✅ Ativados ${activatedCount} utilizadores inativos`);
      }

      // Save updated data
      localStorage.setItem("app-users", JSON.stringify(appUsers));
      localStorage.setItem("mock-users", JSON.stringify(mockUsers));

      // Sync with mockAuthService
      try {
        const { mockAuthService } = await import("../services/mockAuthService");
        mockAuthService.reloadUsers();
        results.push("✅ Sincronizado com mockAuthService");
      } catch (error) {
        results.push("⚠️ Erro ao sincronizar com mockAuthService");
      }

      // Force reload of app users in the main component
      window.dispatchEvent(new CustomEvent("usersUpdated"));

      results.push(
        "🎉 Sincronização completa! Os utilizadores devem agora aparecer na lista de atribuição.",
      );
    } catch (error) {
      console.error("Erro durante a correção:", error);
      results.push("❌ Erro durante a correção: " + error.message);
    }

    setFixResults(results);
    setIsFixing(false);

    // Re-analyze after fixing
    setTimeout(analyzeUsers, 1000);
  };

  useEffect(() => {
    // Run analysis immediately when component loads
    analyzeUsers();

    // Auto-run the fix if there are obvious problems with no users in app-users
    const appUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
    const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "[]");

    if (appUsers.length === 0 && mockUsers.length > 0) {
      console.log(
        "🔧 Auto-running sync fix because no app-users found but mock-users exist",
      );
      setTimeout(() => {
        fixUserSync();
      }, 1000);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Wrench className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Correção de Atribuição de Obras
            </h2>
            <p className="text-gray-600">
              Diagnóstico e correção de problemas na atribuição de utilizadores
              às obras
            </p>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-sm text-blue-600">Utilizadores App</div>
                  <div className="text-lg font-semibold text-blue-900">
                    {usersAnalysis.appUsers.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <div className="text-sm text-green-600">
                    Utilizadores Auth
                  </div>
                  <div className="text-lg font-semibold text-green-900">
                    {usersAnalysis.mockUsers.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <div className="text-sm text-yellow-600">Ativos</div>
                  <div className="text-lg font-semibold text-yellow-900">
                    {usersAnalysis.appUsers.filter((u) => u.active).length}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <div className="text-sm text-red-600">Problemas</div>
                  <div className="text-lg font-semibold text-red-900">
                    {usersAnalysis.syncIssues.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          {usersAnalysis.appUsers.length <= 1 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-orange-800">
                    Problema Identificado: Poucos Utilizadores
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Só existe {usersAnalysis.appUsers.length} utilizador(es) no
                    sistema. Para atribuir obras a diferentes pessoas, precisa
                    de criar mais utilizadores.
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    Vá a{" "}
                    <strong>
                      Configurações → Área de Administração → Gestão de
                      Utilizadores
                    </strong>{" "}
                    para criar novos utilizadores.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Issues List */}
          {usersAnalysis.syncIssues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Problemas Detectados:
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {usersAnalysis.syncIssues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">⚠️</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* User Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Utilizadores no Sistema Principal:
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                {usersAnalysis.appUsers.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {usersAnalysis.appUsers.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <span
                          className={
                            user.active ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          {user.name} ({user.email})
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            user.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.active ? "Ativo" : "Inativo"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Nenhum utilizador encontrado
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Utilizadores no Sistema de Autenticação:
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                {usersAnalysis.mockUsers.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {usersAnalysis.mockUsers.map((user) => (
                      <li
                        key={user.uid}
                        className="flex items-center justify-between"
                      >
                        <span
                          className={
                            user.active ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          {user.name} ({user.email})
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            user.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.active ? "Ativo" : "Inativo"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Nenhum utilizador encontrado
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fix Button */}
        <div className="flex flex-wrap space-x-4 gap-2">
          <button
            onClick={fixUserSync}
            disabled={isFixing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isFixing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            <span>{isFixing ? "A corrigir..." : "Corrigir Sincronização"}</span>
          </button>

          <button
            onClick={analyzeUsers}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Analisar Novamente</span>
          </button>

          <button
            onClick={() => {
              // Force trigger the usersUpdated event to test if it works
              window.dispatchEvent(new CustomEvent("usersUpdated"));
              alert(
                "Evento de atualização de utilizadores enviado! Vá à secção 'Nova Obra' para verificar se os utilizadores aparecem agora.",
              );
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Testar Correção</span>
          </button>

          {usersAnalysis.appUsers.length <= 1 && (
            <button
              onClick={() => {
                alert(
                  "Para criar novos utilizadores:\n\n1. Clique em 'Configurações' no menu\n2. Vá a 'Área de Administração'\n3. Clique em 'Gestão de Utilizadores'\n4. Use o botão 'Novo Utilizador' para criar utilizadores adicionais\n\nDepois volte aqui e clique em 'Corrigir Sincronização'",
                );
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Como Criar Utilizadores</span>
            </button>
          )}
        </div>

        {/* Fix Results */}
        {fixResults.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Resultados da Correção:
            </h3>
            <ul className="text-sm space-y-1">
              {fixResults.map((result, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">
                    {result.startsWith("✅") ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : result.startsWith("❌") ? (
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    )}
                  </span>
                  <span className="text-gray-700">{result}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Como funciona esta correção:
        </h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>
            Analisa os utilizadores em ambos os sistemas (principal e
            autenticação)
          </li>
          <li>Identifica discrepâncias e utilizadores em falta</li>
          <li>Sincroniza os utilizadores entre os dois sistemas</li>
          <li>
            Ativa utilizadores inativos que podem estar a causar o problema
          </li>
          <li>Atualiza as permissões corretamente</li>
          <li>
            Força a recarregar a lista de utilizadores na interface principal
          </li>
        </ol>
        <p className="text-sm text-blue-700 mt-2">
          <strong>Após executar a correção</strong>, vá à secção "Nova Obra" e
          verifique se os utilizadores aparecem agora na lista de atribuição.
        </p>
      </div>
    </div>
  );
};
