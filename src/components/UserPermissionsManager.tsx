import React, { useState, useEffect } from "react";
import {
  Users,
  Edit3,
  Shield,
  Eye,
  Plus,
  Trash2,
  Save,
  X,
  Check,
  AlertTriangle,
  UserCheck,
  Settings,
} from "lucide-react";
// import { authService, UserProfile } from "../services/authService"; // Removed
type UserProfile = {
  id?: string;
  name: string;
  email: string;
  role: string;
  createdAt?: any;
  updatedAt?: any;
  permissions?: any;
  uid?: string;
  active?: boolean;
};
import { useUsers } from "../hooks/useFirestore";

interface PermissionsEditorProps {
  user: UserProfile;
  onSave: (
    userId: string,
    permissions: UserProfile["permissions"],
    role: UserProfile["role"],
  ) => void;
  onCancel: () => void;
}

const PermissionsEditor: React.FC<PermissionsEditorProps> = ({
  user,
  onSave,
  onCancel,
}) => {
  const [permissions, setPermissions] = useState(user.permissions);
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const moduleNames = {
    obras: "Obras",
    manutencoes: "Manutenções",
    piscinas: "Piscinas",
    utilizadores: "Utilizadores",
    relatorios: "Relatórios",
    clientes: "Clientes",
  };

  const actionNames = {
    view: "Ver",
    create: "Criar",
    edit: "Editar",
    delete: "Apagar",
  };

  const roleNames = {
    user: "Utilizador",
    admin: "Administrador",
    super_admin: "Super Administrador",
    manager: "Gestor",
    tech: "Técnico",
  };

  const handlePermissionChange = (
    module: keyof UserProfile["permissions"],
    action: string,
    value: boolean,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value,
      },
    }));
  };

  const handleRoleChange = (newRole: UserProfile["role"]) => {
    setRole(newRole);
    // Auto-update permissions based on role
    setPermissions(getDefaultPermissions(newRole));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(user.uid, permissions, role);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Editar Permissões - {user.name}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Função
            </label>
            <select
              value={role}
              onChange={(e) =>
                handleRoleChange(e.target.value as UserProfile["role"])
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {Object.entries(roleNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Permissions Grid */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Permissões por Módulo
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      M��dulo
                    </th>
                    {Object.entries(actionNames).map(([action, label]) => (
                      <th
                        key={action}
                        className="border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(moduleNames).map(([module, label]) => (
                    <tr key={module}>
                      <td className="border border-gray-200 px-3 py-2 font-medium">
                        {label}
                      </td>
                      {Object.keys(actionNames).map((action) => (
                        <td
                          key={action}
                          className="border border-gray-200 px-3 py-2 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={
                              permissions[
                                module as keyof UserProfile["permissions"]
                              ]?.[action] || false
                            }
                            onChange={(e) =>
                              handlePermissionChange(
                                module as keyof UserProfile["permissions"],
                                action,
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

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
        manutencoes: { view: true, create: true, edit: true, delete: false },
        piscinas: { view: true, create: true, edit: true, delete: false },
        utilizadores: { view: true, create: true, edit: false, delete: false },
        relatorios: { view: true, create: true, edit: true, delete: false },
        clientes: { view: true, create: true, edit: true, delete: false },
      };
    case "manager":
      return {
        obras: { view: true, create: true, edit: true, delete: true },
        manutencoes: { view: true, create: true, edit: true, delete: false },
        piscinas: { view: true, create: false, edit: true, delete: false },
        utilizadores: { view: true, create: false, edit: false, delete: false },
        relatorios: { view: true, create: true, edit: true, delete: false },
        clientes: { view: true, create: false, edit: true, delete: false },
      };
    case "tech":
      return {
        obras: { view: true, create: false, edit: true, delete: false },
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
    default: // user
      return {
        obras: { view: true, create: false, edit: false, delete: false },
        manutencoes: { view: true, create: false, edit: false, delete: false },
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

export const UserPermissionsManager: React.FC = () => {
  const {
    documents: users,
    loading,
    error: firestoreError,
    update,
    save,
    deleteDoc,
    refresh,
  } = useUsers();
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Inicializar usuários padrão se não existirem
  useEffect(() => {
    if (!loading && users.length === 0) {
      // Criar usuário admin padrão
      const defaultAdmin = {
        email: "admin@leirisonda.com",
        name: "Administrador",
        role: "super_admin" as const,
        permissions: getDefaultPermissions("super_admin"),
        active: true,
      };

      save(defaultAdmin).then((docId) => {
        if (docId) {
          console.log("✅ Usuário admin padrão criado");
        }
      });
    }
  }, [loading, users.length, save]);

  const handleSavePermissions = async (
    userId: string,
    permissions: UserProfile["permissions"],
    role: UserProfile["role"],
  ) => {
    try {
      const success = await update(userId, { permissions, role });

      if (success) {
        setSuccessMessage("Permissões atualizadas com sucesso!");
        setEditingUser(null);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError("Erro ao atualizar permissões");
      }
    } catch (err: any) {
      console.error("Error updating permissions:", err);
      setError(err.message || "Erro ao atualizar permissões");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja apagar este utilizador?")) return;

    try {
      const success = await deleteDoc(userId);

      if (success) {
        setSuccessMessage("Utilizador apagado com sucesso!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError("Erro ao apagar utilizador");
      }
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setError(err.message || "Erro ao apagar utilizador");
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <span className="ml-2">A carregar utilizadores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Gestão de Utilizadores
        </h2>
        <button
          onClick={() => refresh()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <UserCheck className="h-4 w-4" />
          Atualizar
        </button>
      </div>

      {/* Error/Success Messages */}
      {(error || firestoreError || successMessage) && (
        <div className="space-y-2">
          {(error || firestoreError) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-700">{error || firestoreError}</span>
              </div>
              <button
                onClick={clearMessages}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-700">{successMessage}</span>
              </div>
              <button
                onClick={clearMessages}
                className="text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Utilizadores ({users.length})
          </h3>
        </div>

        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum utilizador encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilizador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id || user.uid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Settings className="h-4 w-4" />
                        Permissões
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id || user.uid)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Apagar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permissions Editor Modal */}
      {editingUser && (
        <PermissionsEditor
          user={editingUser}
          onSave={handleSavePermissions}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};
