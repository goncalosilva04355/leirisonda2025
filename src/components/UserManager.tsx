import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  User,
  Shield,
  Mail,
  UserCheck,
} from "lucide-react";
import { AuthorizedUser } from "../config/authorizedUsers";
import { useAuthorizedUsers } from "../hooks/useAuthorizedUsers";
import { safeLocalStorage, storageUtils } from "../utils/storageUtils";

interface UserManagerProps {
  currentUser: any;
}

const UserManager: React.FC<UserManagerProps> = ({ currentUser }) => {
  const { users, updateUsers, isLoading } = useAuthorizedUsers();

  // Garantir que há pelo menos um utilizador autorizado padrão
  useEffect(() => {
    if (!isLoading && users.length === 0) {
      console.log(
        "⚠️ Nenhum utilizador autorizado encontrado, inicializando...",
      );
      const defaultUsers = [
        {
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "super_admin" as const,
        },
      ];
      updateUsers(defaultUsers);
    }
  }, [isLoading, users.length, updateUsers]);
  const [editingUser, setEditingUser] = useState<AuthorizedUser | null>(null);
  const [newUser, setNewUser] = useState<
    AuthorizedUser & { password?: string }
  >({
    email: "",
    name: "",
    role: "technician",
    password: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [errors, setErrors] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editingPermissions, setEditingPermissions] = useState<string | null>(
    null,
  );
  const [tempPermissions, setTempPermissions] = useState<any>(null);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // Salvar utilizadores
  const saveUsers = (updatedUsers: AuthorizedUser[]) => {
    updateUsers(updatedUsers);
    console.log("✅ Utilizadores atualizados:", updatedUsers.length);
  };

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar utilizador
  const validateUser = (
    user: AuthorizedUser & { password?: string },
  ): string => {
    if (!user.email.trim()) return "Email é obrigatório";
    if (!validateEmail(user.email)) return "Email inválido";
    if (!user.name.trim()) return "Nome é obrigatório";
    if (!user.role) return "Role é obrigatória";
    if (!user.password || user.password.trim().length < 4)
      return "Password deve ter pelo menos 4 caracteres";

    // Verificar email duplicado
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === user.email.toLowerCase(),
    );
    if (
      existingUser &&
      (!editingUser || existingUser.email !== editingUser.email)
    ) {
      return "Email já existe";
    }

    return "";
  };

  // Adicionar utilizador
  const handleAddUser = () => {
    const error = validateUser(newUser);
    if (error) {
      setErrors(error);
      return;
    }

    // Atualizar sistema de AuthorizedUsers
    const updatedUsers = [
      ...users,
      {
        email: newUser.email.toLowerCase(),
        name: newUser.name,
        role: newUser.role,
      },
    ];
    saveUsers(updatedUsers);

    // Adicionar ao sistema principal de utilizadores (com password)
    try {
      const mainUsers = storageUtils.getJson("app-users", []);
      const newMainUser = {
        id: Date.now(),
        uid: `user_${Date.now()}`, // Adicionar uid para compatibilidade
        name: newUser.name,
        email: newUser.email.toLowerCase(),
        password: newUser.password,
        role: newUser.role,
        permissions: {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        },
        active: true,
        createdAt: new Date().toISOString(),
      };

      mainUsers.push(newMainUser);
      localStorage.setItem("app-users", JSON.stringify(mainUsers));

      // Sincronizar com mock-users para compatibilidade
      const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "{}");
      mockUsers[newMainUser.uid] = {
        uid: newMainUser.uid,
        email: newMainUser.email,
        name: newMainUser.name,
        role: newMainUser.role,
        permissions: newMainUser.permissions,
        active: newMainUser.active,
        createdAt: newMainUser.createdAt,
      };
      localStorage.setItem("mock-users", JSON.stringify(mockUsers));

      // Triggerar evento para atualizar outros componentes
      window.dispatchEvent(new CustomEvent("usersUpdated"));

      console.log("✅ Utilizador criado com sucesso:", newMainUser.email);
    } catch (error) {
      console.error("❌ Erro ao criar utilizador no sistema principal:", error);
      setErrors("Erro ao guardar utilizador. Tente novamente.");
      return;
    }

    setNewUser({ email: "", name: "", role: "technician", password: "" });
    setShowAddForm(false);
    setErrors("");
  };

  // Editar utilizador
  const handleEditUser = (user: AuthorizedUser) => {
    setEditingUser({ ...user });
    setErrors("");
  };

  // Salvar edição
  const handleSaveEdit = () => {
    if (!editingUser) return;

    // Para edição, não validar password se não foi alterada
    const userForValidation = { ...editingUser, password: "temppass123" };
    const error = validateUser(userForValidation);
    if (error && !error.includes("Password")) {
      setErrors(error);
      return;
    }

    const updatedUsers = users.map((user) =>
      user.email === editingUser.email ? { ...editingUser } : user,
    );
    saveUsers(updatedUsers);
    setEditingUser(null);
    setErrors("");
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingUser(null);
    setErrors("");
  };

  // Eliminar utilizador
  const handleDeleteUser = (email: string) => {
    if (email === currentUser?.email) {
      setErrors("Não pode eliminar o seu próprio utilizador");
      return;
    }

    if (
      confirm(
        `Tem a certeza que quer eliminar o utilizador com email: ${email}?`,
      )
    ) {
      const updatedUsers = users.filter((user) => user.email !== email);
      saveUsers(updatedUsers);
      setErrors("");
    }
  };

  // Cores para roles
  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "technician":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Ícone para roles
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Shield className="h-4 w-4" />;
      case "manager":
        return <UserCheck className="h-4 w-4" />;
      case "technician":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Obter permissões do utilizador do sistema principal
  const getUserPermissions = (email: string) => {
    const mainUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
    const user = mainUsers.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase(),
    );
    return user?.permissions || null;
  };

  // Editar permissões
  const handleEditPermissions = (email: string) => {
    const permissions = getUserPermissions(email);
    if (permissions) {
      setTempPermissions({ ...permissions });
      setEditingPermissions(email);
    } else {
      // Se não encontrar permissões, criar padrão
      console.log(`⚠️ Criando permissões padrão para: ${email}`);
      const defaultPermissions = {
        obras: { view: true, create: true, edit: true, delete: false },
        manutencoes: { view: true, create: true, edit: true, delete: false },
        piscinas: { view: true, create: false, edit: true, delete: false },
        utilizadores: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        relatorios: { view: true, create: true, edit: false, delete: false },
        clientes: { view: true, create: false, edit: false, delete: false },
      };
      setTempPermissions(defaultPermissions);
      setEditingPermissions(email);
    }
  };

  // Salvar permissões
  const handleSavePermissions = () => {
    if (!editingPermissions || !tempPermissions) return;

    try {
      const mainUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
      let userIndex = mainUsers.findIndex(
        (u: any) => u.email.toLowerCase() === editingPermissions.toLowerCase(),
      );

      if (userIndex !== -1) {
        // Utilizador existe - atualizar permissões
        mainUsers[userIndex].permissions = { ...tempPermissions };
      } else {
        // Utilizador não existe no sistema principal - criar entrada
        console.log(
          `⚠️ Utilizador ${editingPermissions} não encontrado em app-users, criando entrada...`,
        );
        const authorizedUser = users.find(
          (u) => u.email.toLowerCase() === editingPermissions.toLowerCase(),
        );
        if (authorizedUser) {
          const newMainUser = {
            id: Date.now(),
            uid: `user_${Date.now()}`,
            name: authorizedUser.name,
            email: authorizedUser.email.toLowerCase(),
            password: "temppass123", // Password temporária
            role: authorizedUser.role,
            permissions: { ...tempPermissions },
            active: true,
            createdAt: new Date().toISOString(),
          };
          mainUsers.push(newMainUser);
        }
      }

      localStorage.setItem("app-users", JSON.stringify(mainUsers));

      // Sincronizar com mock-users
      const mockUsers = JSON.parse(localStorage.getItem("mock-users") || "{}");
      const targetUser = mainUsers.find(
        (u: any) => u.email.toLowerCase() === editingPermissions.toLowerCase(),
      );
      if (targetUser) {
        mockUsers[targetUser.uid] = {
          uid: targetUser.uid,
          email: targetUser.email,
          name: targetUser.name,
          role: targetUser.role,
          permissions: targetUser.permissions,
          active: targetUser.active,
          createdAt: targetUser.createdAt,
        };
        localStorage.setItem("mock-users", JSON.stringify(mockUsers));
      }

      // Triggerar evento para atualizar outros componentes
      window.dispatchEvent(new CustomEvent("usersUpdated"));

      console.log(
        "✅ Permissões atualizadas com sucesso para:",
        editingPermissions,
      );

      // Mostrar feedback de sucesso
      setErrors("");
      setSuccessMessage(
        `Permissões atualizadas com sucesso para ${editingPermissions}`,
      );
      setIsSavingPermissions(false);

      // Limpar estado após pequeno delay para permitir ver a confirmação
      setTimeout(() => {
        setEditingPermissions(null);
        setTempPermissions(null);
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("❌ Erro ao guardar permissões:", error);
      setErrors("Erro ao guardar permissões. Tente novamente.");
      setIsSavingPermissions(false);
    }
  };

  // Cancelar edição de permissões
  const handleCancelPermissionsEdit = () => {
    setEditingPermissions(null);
    setTempPermissions(null);
    setErrors("");
    setSuccessMessage("");
    setIsSavingPermissions(false);
  };

  // Atualizar permissão específica
  const updatePermission = (
    section: string,
    action: string,
    value: boolean,
  ) => {
    if (!tempPermissions) return;

    setTempPermissions({
      ...tempPermissions,
      [section]: {
        ...tempPermissions[section],
        [action]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">A carregar utilizadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestão de Utilizadores
          </h2>
          <p className="text-gray-600 mt-1">
            Gerir utilizadores autorizados e suas permissões (Sistema Unificado)
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Diagnóstico rápido
              const appUsers = JSON.parse(
                localStorage.getItem("app-users") || "[]",
              );
              const mockUsers = JSON.parse(
                localStorage.getItem("mock-users") || "{}",
              );
              const authorizedUsers = JSON.parse(
                localStorage.getItem("authorizedUsers") || "[]",
              );

              alert(`📊 Diagnóstico de Utilizadores:

🔵 app-users: ${appUsers.length} utilizadores
🟡 mock-users: ${Object.keys(mockUsers).length} utilizadores
🟢 authorizedUsers: ${authorizedUsers.length} utilizadores

Este gestor sincroniza todos os sistemas automaticamente.`);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700"
          >
            <Shield className="h-4 w-4" />
            <span>Diagnóstico</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Utilizador</span>
          </button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {errors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{errors}</p>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm font-medium">
            ✅ {successMessage}
          </p>
        </div>
      )}

      {/* Formulário de adicionar utilizador */}
      {showAddForm && (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Adicionar Novo Utilizador
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="exemplo@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do utilizador"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={newUser.password || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Palavra-passe (mín. 4 caracteres)"
                minLength={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="technician">Técnico</option>
                <option value="manager">Gestor</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewUser({
                  email: "",
                  name: "",
                  role: "technician",
                  password: "",
                });
                setErrors("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Lista de utilizadores */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">
            Utilizadores Autorizados ({users.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.email} className="px-6 py-4">
              {editingUser?.email === user.email ? (
                /* Modo de edição */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value as any,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="technician">Técnico</option>
                      <option value="manager">Gestor</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Modo de visualização */
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.email}
                        </p>
                        {user.email === currentUser?.email && (
                          <span className="text-xs text-blue-600">(Você)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                      >
                        {getRoleIcon(user.role)}
                        <span className="ml-1">
                          {user.role === "super_admin"
                            ? "Super Admin"
                            : user.role === "manager"
                              ? "Gestor"
                              : "Técnico"}
                        </span>
                      </span>

                      {/* Indicador de permissões */}
                      {(() => {
                        const permissions = getUserPermissions(user.email);
                        if (!permissions) return null;

                        const totalPerms = Object.values(permissions).reduce(
                          (acc: number, section: any) => {
                            return (
                              acc +
                              Object.values(section).filter(Boolean).length
                            );
                          },
                          0,
                        );

                        return (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {totalPerms} permissões
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar utilizador"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditPermissions(user.email)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                      title="Editar permissões"
                    >
                      <Shield className="h-4 w-4" />
                    </button>
                    {user.email !== currentUser?.email && (
                      <button
                        onClick={() => handleDeleteUser(user.email)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhum utilizador encontrado</p>
        </div>
      )}

      {/* Modal de Edição de Permissões */}
      {editingPermissions && tempPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Editar Permissões - {editingPermissions}
                </h3>
                <button
                  onClick={handleCancelPermissionsEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Botões de atalho para permissões */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Atalhos rápidos:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const fullPermissions = {
                        obras: {
                          view: true,
                          create: true,
                          edit: true,
                          delete: true,
                        },
                        manutencoes: {
                          view: true,
                          create: true,
                          edit: true,
                          delete: true,
                        },
                        piscinas: {
                          view: true,
                          create: true,
                          edit: true,
                          delete: true,
                        },
                        utilizadores: {
                          view: true,
                          create: true,
                          edit: true,
                          delete: true,
                        },
                        relatorios: {
                          view: true,
                          create: true,
                          edit: true,
                          delete: true,
                        },
                        clientes: {
                          view: true,
                          create: true,
                          edit: true,
                          delete: true,
                        },
                      };
                      setTempPermissions(fullPermissions);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Todas as Permissões
                  </button>
                  <button
                    onClick={() => {
                      const viewOnlyPermissions = {
                        obras: {
                          view: true,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        manutencoes: {
                          view: true,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        piscinas: {
                          view: true,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        utilizadores: {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        relatorios: {
                          view: true,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        clientes: {
                          view: true,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                      };
                      setTempPermissions(viewOnlyPermissions);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Apenas Visualização
                  </button>
                  <button
                    onClick={() => {
                      const technicianPermissions = {
                        obras: {
                          view: true,
                          create: true,
                          edit: true,
                          delete: false,
                        },
                        manutencoes: {
                          view: true,
                          create: true,
                          edit: true,
                          delete: false,
                        },
                        piscinas: {
                          view: true,
                          create: false,
                          edit: true,
                          delete: false,
                        },
                        utilizadores: {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        relatorios: {
                          view: true,
                          create: true,
                          edit: false,
                          delete: false,
                        },
                        clientes: {
                          view: true,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                      };
                      setTempPermissions(technicianPermissions);
                    }}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Técnico Padrão
                  </button>
                  <button
                    onClick={() => {
                      const noPermissions = {
                        obras: {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        manutencoes: {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        piscinas: {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        utilizadores: {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        relatorios: {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                        clientes: {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        },
                      };
                      setTempPermissions(noPermissions);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Remover Todas
                  </button>
                </div>
              </div>

              <div className="grid gap-6">
                {Object.entries(tempPermissions).map(
                  ([section, perms]: [string, any]) => (
                    <div key={section} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 capitalize">
                        {section === "obras"
                          ? "Obras"
                          : section === "manutencoes"
                            ? "Manutenções"
                            : section === "piscinas"
                              ? "Piscinas"
                              : section === "utilizadores"
                                ? "Utilizadores"
                                : section === "relatorios"
                                  ? "Relatórios"
                                  : section === "clientes"
                                    ? "Clientes"
                                    : section}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(perms).map(
                          ([action, value]: [string, any]) => (
                            <label
                              key={action}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(value)}
                                onChange={(e) =>
                                  updatePermission(
                                    section,
                                    action,
                                    e.target.checked,
                                  )
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 capitalize">
                                {action === "view"
                                  ? "Ver"
                                  : action === "create"
                                    ? "Criar"
                                    : action === "edit"
                                      ? "Editar"
                                      : action === "delete"
                                        ? "Eliminar"
                                        : action}
                              </span>
                            </label>
                          ),
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleCancelPermissionsEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setIsSavingPermissions(true);
                    handleSavePermissions();
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                  disabled={!tempPermissions || isSavingPermissions}
                >
                  {isSavingPermissions && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>
                    {isSavingPermissions
                      ? "A guardar..."
                      : editingPermissions && tempPermissions
                        ? "Guardar Permissões"
                        : "A processar..."}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
