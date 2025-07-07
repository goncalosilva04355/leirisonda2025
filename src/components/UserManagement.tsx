import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Save,
  X,
  Check,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  UserCheck,
  UserX,
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

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "super_admin";
  active: boolean;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "user",
    active: true,
  });

  // Load users from localStorage and sync with auth services
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Load from localStorage first
        const savedUsers = localStorage.getItem("app-users");
        if (savedUsers) {
          try {
            const parsedUsers = JSON.parse(savedUsers);
            setUsers(parsedUsers);
          } catch (error) {
            console.error("Erro ao carregar utilizadores:", error);
            setUsers([]);
          }
        } else {
          // Initialize with default admin user
          const defaultUsers: User[] = [
            {
              id: "1",
              name: "Gonçalo Fonseca",
              email: "gongonsilva@gmail.com",
              password: "19867gsf",
              role: "super_admin",
              permissions: {
                obras: { view: true, create: true, edit: true, delete: true },
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
              },
              active: true,
              createdAt: "2024-01-01",
            },
          ];
          setUsers(defaultUsers);
          localStorage.setItem("app-users", JSON.stringify(defaultUsers));
        }

        // Also sync with mock auth service
        try {
          const { mockAuthService } = await import(
            "../services/mockAuthService"
          );
          mockAuthService.reloadUsers();
          console.log("Synchronized with mock auth service");
        } catch (error) {
          console.warn("Could not sync with mock auth service:", error);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  }, []);

  // Save users to localStorage
  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem("app-users", JSON.stringify(updatedUsers));
  };

  // Refresh users from all sources
  const refreshUsers = async () => {
    try {
      // Reload from localStorage
      const savedUsers = localStorage.getItem("app-users");
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      }

      // Sync with auth services
      const { mockAuthService } = await import("../services/mockAuthService");
      mockAuthService.reloadUsers();
      console.log("Users refreshed from all sources");
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  // Generate default permissions based on role
  const getDefaultPermissions = (role: string) => {
    switch (role) {
      case "super_admin":
        return {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        };
      case "admin":
        return {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: true, edit: true, delete: false },
          clientes: { view: true, create: true, edit: true, delete: false },
        };
      default: // user
        return {
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
        };
    }
  };

  // Create new user
  const handleCreateUser = async () => {
    console.log("🔄 handleCreateUser called");
    console.log("📝 Form data:", formData);
    console.log("🔒 isCreatingUser:", isCreatingUser);

    if (isCreatingUser) {
      console.log("❌ Already creating user, preventing double submission");
      return; // Prevent multiple submissions
    }

    if (!formData.name || !formData.email || !formData.password) {
      console.log("❌ Missing required fields");
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log("❌ Invalid email format");
      alert("Por favor, insira um email válido.");
      return;
    }

    if (formData.password.length < 6) {
      console.log("❌ Password too short");
      alert("Password deve ter pelo menos 6 caracteres.");
      return;
    }

    // Check if email already exists in local users
    if (
      users.some(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase(),
      )
    ) {
      console.log("❌ Email already exists in local users");
      alert("Já existe um utilizador com este email.");
      return;
    }

    // Also check with mock auth service for additional validation
    try {
      const { mockAuthService } = await import("../services/mockAuthService");
      const allUsers = mockAuthService.getAllUsers();
      if (
        allUsers.some(
          (user) => user.email.toLowerCase() === formData.email.toLowerCase(),
        )
      ) {
        console.log("❌ Email already exists in auth service");
        alert("Este email já está registado no sistema.");
        return;
      }
    } catch (error) {
      console.warn("Could not check auth service for duplicates:", error);
    }

    console.log("✅ All validations passed, starting user creation");
    setIsCreatingUser(true);

    try {
      // Import authService dynamically to ensure proper initialization
      const { authService } = await import("../services/authService");

      console.log("Creating user with data:", {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      });

      // Map role from UserManagement to authService format
      let authRole: "super_admin" | "manager" | "technician" = "technician";
      if (formData.role === "super_admin") {
        authRole = "super_admin";
      } else if (formData.role === "admin") {
        authRole = "manager";
      } else {
        authRole = "technician";
      }

      // Create user through authService for proper sync
      const result = await authService.register(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
        authRole,
      );

      console.log("AuthService registration result:", result);

      if (result.success) {
        // Create local user record for UI management
        const newUser: User = {
          id: result.user?.uid || Date.now().toString(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          permissions: getDefaultPermissions(formData.role),
          active: formData.active,
          createdAt: new Date().toISOString().split("T")[0],
        };

        const updatedUsers = [...users, newUser];
        saveUsers(updatedUsers);

        // Refresh all user data to ensure sync
        await refreshUsers();

        setIsCreating(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "user",
          active: true,
        });

        console.log("✅ Utilizador criado com sucesso!");
        alert("✅ Utilizador criado com sucesso e está ativo!");
      } else {
        console.error("Registration failed:", result.error);
        alert(
          `❌ Erro ao criar utilizador: ${result.error || "Erro desconhecido"}`,
        );
      }
    } catch (error: any) {
      console.error("Erro ao criar utilizador:", error);
      alert("❌ Erro inesperado ao criar utilizador. Tente novamente.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Update user
  const handleUpdateUser = () => {
    if (!editingUser) return;

    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? editingUser : user,
    );
    saveUsers(updatedUsers);
    setEditingUser(null);
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    if (
      window.confirm("Tem a certeza que pretende eliminar este utilizador?")
    ) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      saveUsers(updatedUsers);
    }
  };

  // Toggle user active status
  const toggleUserActive = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, active: !user.active } : user,
    );
    saveUsers(updatedUsers);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Administrador";
      default:
        return "Utilizador";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestão de Utilizadores
          </h2>
          <p className="text-gray-600">
            Criar, editar e gerir utilizadores do sistema
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          <span>Novo Utilizador</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-lg font-semibold text-blue-600">
                {users.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Ativos</p>
              <p className="text-lg font-semibold text-green-600">
                {users.filter((u) => u.active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admins</p>
              <p className="text-lg font-semibold text-red-600">
                {
                  users.filter(
                    (u) => u.role === "admin" || u.role === "super_admin",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <UserX className="h-5 w-5 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Inativos</p>
              <p className="text-lg font-semibold text-gray-600">
                {users.filter((u) => !u.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Form */}
      {isCreating && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Criar Novo Utilizador
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password segura"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Função
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Utilizador</option>
                <option value="admin">Administrador</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Utilizador ativo
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateUser}
              disabled={isCreatingUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isCreatingUser && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isCreatingUser ? "A criar..." : "Criar Utilizador"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Utilizadores Registados
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilizador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={!user.active ? "bg-gray-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 font-mono">
                        {showPasswords[user.id] ? user.password : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords[user.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserActive(user.id)}
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {user.active ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Inativo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {user.role !== "super_admin" && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Editar Utilizador
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={editingUser.password}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Função
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Utilizador</option>
                  <option value="admin">Administrador</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editActive"
                  checked={editingUser.active}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, active: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="editActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  Utilizador ativo
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
