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
  Settings,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  UserMinus,
} from "lucide-react";
import { cleanUserData } from "../utils/cleanUserData";
import AuthTroubleshootingGuide from "./AuthTroubleshootingGuide";

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
  const [createError, setCreateError] = useState<string>("");
  const [createSuccess, setCreateSuccess] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<User | null>(
    null,
  );
  const [showPasswords, setShowPasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const [showTroubleshootingGuide, setShowTroubleshootingGuide] =
    useState(false);
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
        } catch (error) {
          // Silent sync error
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
    if (isCreatingUser) return; // Prevent multiple submissions

    if (!formData.name || !formData.email || !formData.password) {
      setCreateError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setCreateError("Por favor, insira um email válido.");
      return;
    }

    if (formData.password.length < 6) {
      setCreateError("Password deve ter pelo menos 6 caracteres.");
      return;
    }

    // Check if email already exists in local users
    if (
      users.some(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase(),
      )
    ) {
      setCreateError("Já existe um utilizador com este email.");
      return;
    }

    // Check with mock auth service for additional validation
    try {
      const { mockAuthService } = await import("../services/mockAuthService");
      const allUsers = mockAuthService.getAllUsers();
      if (
        allUsers.some(
          (user) => user.email.toLowerCase() === formData.email.toLowerCase(),
        )
      ) {
        setCreateError(
          "Este email já está registado no sistema. Se o utilizador existe mas não consegue fazer login, contacte o administrador para reativar a conta.",
        );
        return;
      }
    } catch (error) {
      console.warn("Erro ao verificar duplicados no mock auth:", error);
    }

    setCreateError("");
    setCreateSuccess("");
    setIsCreatingUser(true);

    try {
      // Import authService dynamically to ensure proper initialization
      const { authService } = await import("../services/authService");

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

        // Comprehensive sync with all auth systems
        try {
          const { mockAuthService } = await import(
            "../services/mockAuthService"
          );

          // First, sync the user to mock auth service with the correct data
          await mockAuthService.register(
            formData.email.trim(),
            formData.password,
            formData.name.trim(),
            authRole,
          );

          console.log("✅ User synchronized to mock auth service");

          // Reload users to ensure consistency
          mockAuthService.reloadUsers();
        } catch (syncError) {
          console.warn("⚠️ Sync error with mock auth service:", syncError);
          // Don't fail creation if sync fails
        }

        // Refresh all user data to ensure sync
        await refreshUsers();

        // Dispatch event to notify other components (like App.tsx) that users were updated
        window.dispatchEvent(new CustomEvent("usersUpdated"));
        console.log("📢 usersUpdated event dispatched after user creation");

        setIsCreating(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "user",
          active: true,
        });

        setCreateError("");
        setCreateSuccess(
          "✅ Utilizador criado com sucesso e está ativo! Pode agora fazer login com as credenciais fornecidas.",
        );
      } else {
        const errorMsg = `Erro ao criar utilizador: ${result.error || "Erro desconhecido"}`;
        setCreateError(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = "Erro inesperado ao criar utilizador. Tente novamente.";
      setCreateError(errorMsg);
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

    // Dispatch event to notify other components that users were updated
    window.dispatchEvent(new CustomEvent("usersUpdated"));
    console.log("📢 usersUpdated event dispatched after user update");
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    if (
      window.confirm("Tem a certeza que pretende eliminar este utilizador?")
    ) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      saveUsers(updatedUsers);

      // Dispatch event to notify other components that users were updated
      window.dispatchEvent(new CustomEvent("usersUpdated"));
      console.log("📢 usersUpdated event dispatched after user deletion");
    }
  };

  // Toggle user active status
  const toggleUserActive = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, active: !user.active } : user,
    );
    saveUsers(updatedUsers);

    // Dispatch event to notify other components that users were updated
    window.dispatchEvent(new CustomEvent("usersUpdated"));
    console.log("📢 usersUpdated event dispatched after user status change");
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

  // Update user permissions
  const handleUpdatePermissions = () => {
    if (!editingPermissions) return;

    const updatedUsers = users.map((user) =>
      user.id === editingPermissions.id ? editingPermissions : user,
    );
    saveUsers(updatedUsers);
    setEditingPermissions(null);
  };

  // Toggle specific permission
  const togglePermission = (
    section: keyof User["permissions"],
    action: keyof User["permissions"][keyof User["permissions"]],
    value: boolean,
  ) => {
    if (!editingPermissions) return;

    setEditingPermissions({
      ...editingPermissions,
      permissions: {
        ...editingPermissions.permissions,
        [section]: {
          ...editingPermissions.permissions[section],
          [action]: value,
        },
      },
    });
  };

  // Get permission section display name
  const getSectionDisplayName = (section: string) => {
    switch (section) {
      case "obras":
        return "Obras";
      case "manutencoes":
        return "Manutenções";
      case "piscinas":
        return "Piscinas";
      case "utilizadores":
        return "Utilizadores";
      case "relatorios":
        return "Relatórios";
      case "clientes":
        return "Clientes";
      default:
        return section;
    }
  };

  // Get action display name
  const getActionDisplayName = (action: string) => {
    switch (action) {
      case "view":
        return "Visualizar";
      case "create":
        return "Criar";
      case "edit":
        return "Editar";
      case "delete":
        return "Eliminar";
      default:
        return action;
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
            Criar, editar e gerir utilizadores e permissões do sistema
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTroubleshootingGuide(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Resolução de Problemas</span>
          </button>
          <button
            onClick={async () => {
              if (
                confirm(
                  "🔄 Sincronizar todos os utilizadores entre os sistemas de autenticação?",
                )
              ) {
                try {
                  const { UserSyncManager } = await import(
                    "../utils/userSyncManager"
                  );
                  const result = UserSyncManager.performFullSync();
                  if (result.synced) {
                    alert(
                      `✅ Sincronização completa! Local: ${result.localUsers}, Mock: ${result.mockUsers}`,
                    );
                    await refreshUsers();
                  } else {
                    alert("❌ Erro na sincronização.");
                  }
                } catch (error) {
                  alert("❌ Erro ao executar sincronização.");
                }
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Sincronizar</span>
          </button>
          <button
            onClick={() => {
              if (
                confirm(
                  "⚠️ ATENÇÃO: Isto irá remover TODOS os utilizadores exceto o super admin Gonçalo. Confirma?",
                )
              ) {
                const success = cleanUserData();
                if (success) {
                  alert(
                    "✅ Utilizadores limpos! Apenas o super admin Gonçalo permanece.",
                  );
                  refreshUsers(); // Changed from loadUsers to refreshUsers
                } else {
                  alert("❌ Erro na limpeza de utilizadores.");
                }
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <UserMinus className="h-4 w-4" />
            <span>Limpar Utilizadores</span>
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            <span>Novo Utilizador</span>
          </button>
        </div>
      </div>

      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Gestão Completa de Utilizadores e Permissões
            </h3>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>
                • <strong>Editar:</strong> Use o ícone de lápis para alterar
                dados básicos do utilizador
              </p>
              <p>
                • <strong>Permissões:</strong> Use o ícone de engrenagem para
                gerir detalhadamente o que cada utilizador pode fazer
              </p>
              <p>
                • <strong>Eliminar:</strong> Use o ícone de lixo para remover
                utilizadores (Super Admins não podem ser eliminados)
              </p>
              <p>
                • <strong>Estado:</strong> Clique no estado para
                ativar/desativar utilizadores instantaneamente
              </p>
              <p>
                • <strong>Sincronizar:</strong> Se um utilizador existe mas não
                consegue fazer login, use o botão "Sincronizar" para resolver
                problemas de autenticação
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Acesso Total</p>
              <p className="text-lg font-semibold text-purple-600">
                {
                  users.filter((u) => {
                    return Object.values(u.permissions).every((section) =>
                      Object.values(section).every((permission) => permission),
                    );
                  }).length
                }
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
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setCreateError("");
                  setCreateSuccess("");
                }}
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
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setCreateError("");
                }}
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
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setCreateError("");
                }}
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

          {createError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
              <div className="text-red-700 text-sm">{createError}</div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setIsCreating(false);
                setCreateError("");
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCreateUser();
              }}
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
                  Permissões
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
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(user.permissions).map(
                        ([section, permissions]) => {
                          const hasAnyPermission = Object.values(
                            permissions,
                          ).some((p) => p);
                          if (!hasAnyPermission) return null;

                          const totalPermissions =
                            Object.values(permissions).length;
                          const activePermissions = Object.values(
                            permissions,
                          ).filter((p) => p).length;

                          return (
                            <span
                              key={section}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                activePermissions === totalPermissions
                                  ? "bg-green-100 text-green-800"
                                  : activePermissions > 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                              title={`${getSectionDisplayName(section)}: ${activePermissions}/${totalPermissions} permissões`}
                            >
                              {getSectionDisplayName(section)} (
                              {activePermissions}/{totalPermissions})
                            </span>
                          );
                        },
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar utilizador"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingPermissions(user)}
                        className="text-green-600 hover:text-green-900"
                        title="Gerir permissões"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      {user.role !== "super_admin" && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar utilizador"
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

      {/* Permissions Management Modal */}
      {editingPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Gestão de Permissões
                </h3>
                <p className="text-sm text-gray-600">
                  Utilizador:{" "}
                  <span className="font-medium">{editingPermissions.name}</span>{" "}
                  ({editingPermissions.email})
                </p>
              </div>
              <button
                onClick={() => setEditingPermissions(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Role Warning */}
            {editingPermissions.role === "super_admin" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">
                      Super Administrador
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Este utilizador tem permissões completas no sistema. As
                      alterações aqui podem não ter efeito.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Grid */}
            <div className="space-y-6">
              {Object.entries(editingPermissions.permissions).map(
                ([section, permissions]) => (
                  <div key={section} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-600" />
                        {getSectionDisplayName(section)}
                      </h4>

                      {/* Quick toggle buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            // Enable all permissions for this section
                            Object.keys(permissions).forEach((action) => {
                              togglePermission(
                                section as keyof User["permissions"],
                                action as any,
                                true,
                              );
                            });
                          }}
                          className="flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Todas
                        </button>
                        <button
                          onClick={() => {
                            // Disable all permissions for this section
                            Object.keys(permissions).forEach((action) => {
                              togglePermission(
                                section as keyof User["permissions"],
                                action as any,
                                false,
                              );
                            });
                          }}
                          className="flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Nenhuma
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(permissions).map(
                        ([action, hasPermission]) => (
                          <div
                            key={action}
                            className="flex items-center justify-between p-3 bg-white rounded border"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-3 ${hasPermission ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                              <span className="text-sm font-medium text-gray-700">
                                {getActionDisplayName(action)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  togglePermission(
                                    section as keyof User["permissions"],
                                    action as any,
                                    true,
                                  )
                                }
                                className={`p-1 rounded ${hasPermission ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"}`}
                                title="Permitir"
                              >
                                <Unlock className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() =>
                                  togglePermission(
                                    section as keyof User["permissions"],
                                    action as any,
                                    false,
                                  )
                                }
                                className={`p-1 rounded ${!hasPermission ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"}`}
                                title="Negar"
                              >
                                <Lock className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setEditingPermissions(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdatePermissions}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Permissões</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Troubleshooting Guide Modal */}
      <AuthTroubleshootingGuide
        isOpen={showTroubleshootingGuide}
        onClose={() => setShowTroubleshootingGuide(false)}
      />
    </div>
  );
};
