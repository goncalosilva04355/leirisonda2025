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
import { authService, UserProfile } from "../services/authService";
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
    delete: "Eliminar",
  };

  const roleDescriptions = {
    super_admin: "Super Administrador - Acesso total",
    admin: "Administrador - Acesso de gestão completo",
    manager: "Gestor - Acesso limitado à gestão",
    technician: "Técnico - Acesso operacional",
  };

  const handlePermissionChange = (
    module: string,
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

    // Auto-set permissions based on role
    const defaultPermissions = getDefaultPermissions(newRole);
    setPermissions(defaultPermissions);
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
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        };
      case "manager":
        return {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
          utilizadores: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: true, edit: false, delete: false },
          clientes: { view: true, create: true, edit: true, delete: false },
        };
      default: // technician
        return {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(user.uid, permissions, role);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <div>
                <h3 className="text-lg font-bold">Editar Permissões</h3>
                <p className="text-blue-100 text-sm">
                  {user.name} ({user.email})
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-blue-100 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Função do Utilizador
            </label>
            <div className="space-y-2">
              {(
                Object.keys(roleDescriptions) as Array<
                  keyof typeof roleDescriptions
                >
              ).map((roleKey) => (
                <label
                  key={roleKey}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleKey}
                    checked={role === roleKey}
                    onChange={(e) =>
                      handleRoleChange(e.target.value as UserProfile["role"])
                    }
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium">
                      {roleDescriptions[roleKey]}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Permissões Detalhadas
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Módulo
                    </th>
                    {Object.entries(actionNames).map(([action, name]) => (
                      <th
                        key={action}
                        className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b"
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {Object.entries(moduleNames).map(([module, name]) => (
                    <tr
                      key={module}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {name}
                      </td>
                      {Object.keys(actionNames).map((action) => (
                        <td key={action} className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={permissions[module]?.[action] || false}
                            onChange={(e) =>
                              handlePermissionChange(
                                module,
                                action,
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warning for Super Admin */}
          {role === "super_admin" && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> Super Administradores têm acesso
                  total ao sistema, incluindo gestão de utilizadores.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>A guardar...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
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

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      let firebaseSuccess = false;

      // Try to load from Firebase first if it's available
      if (db && typeof isFirestoreReady === "function" && isFirestoreReady()) {
        try {
          // Attempt to create collection reference and get data
          const usersCollection = collection(db, "users");
          const usersSnapshot = await getDocs(usersCollection);
          const firebaseUsers = usersSnapshot.docs.map((doc) => ({
            ...doc.data(),
            uid: doc.id,
          })) as UserProfile[];
          setUsers(firebaseUsers);
          firebaseSuccess = true;
          // console.log("✅ Users loaded from Firebase successfully");
        } catch (firestoreError) {
          console.warn(
            "⚠️ Firebase/Firestore error, falling back to local storage:",
            firestoreError,
          );
        }
      }

      if (!firebaseSuccess) {
        // Fallback to local storage users
        // console.log("📱 Loading users from local storage...");

        // Try multiple localStorage sources
        let localUsers: UserProfile[] = [];

        // First try mock-users
        const mockUsers = localStorage.getItem("mock-users");
        if (mockUsers) {
          try {
            const parsedUsers = JSON.parse(mockUsers);
            localUsers = Object.values(parsedUsers).map((user: any) => ({
              uid: user.uid || user.id,
              email: user.email,
              name: user.name,
              role: user.role || "user",
              permissions: getDefaultPermissions(user.role || "user"),
              active: user.active !== false,
              createdAt: user.createdAt || new Date().toISOString(),
            })) as UserProfile[];
          } catch (e) {
            // console.warn("Error parsing mock-users:", e);
          }
        }

        // If no mock users, try regular users
        if (localUsers.length === 0) {
          const users = localStorage.getItem("users");
          if (users) {
            try {
              const parsedUsers = JSON.parse(users);
              localUsers = (
                Array.isArray(parsedUsers)
                  ? parsedUsers
                  : Object.values(parsedUsers)
              ).map((user: any) => ({
                uid: user.uid || user.id,
                email: user.email,
                name: user.name,
                role: user.role || "user",
                permissions: getDefaultPermissions(user.role || "user"),
                active: user.active !== false,
                createdAt: user.createdAt || new Date().toISOString(),
              })) as UserProfile[];
            } catch (e) {
              console.warn("Error parsing users:", e);
            }
          }
        }

        // If still no users, create a default admin user
        if (localUsers.length === 0) {
          localUsers = [
            {
              uid: "default-admin",
              email: "admin@leirisonda.com",
              name: "Administrador",
              role: "super_admin",
              permissions: getDefaultPermissions("super_admin"),
              active: true,
              createdAt: new Date().toISOString(),
            },
          ];
          console.log("Created default admin user");
        }

        setUsers(localUsers);
        console.log(`✅ Loaded ${localUsers.length} users from local storage`);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Erro ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
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
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        };
      case "manager":
        return {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
          utilizadores: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: true, edit: false, delete: false },
          clientes: { view: true, create: true, edit: true, delete: false },
        };
      default:
        return {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
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

  const handleSavePermissions = async (
    userId: string,
    permissions: UserProfile["permissions"],
    role: UserProfile["role"],
  ) => {
    try {
      if (db) {
        // Update in Firebase
        const userDoc = doc(db, "users", userId);
        await updateDoc(userDoc, {
          permissions,
          role,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Update in localStorage
        const mockUsers = localStorage.getItem("mock-users");
        if (mockUsers) {
          const parsedUsers = JSON.parse(mockUsers);
          if (parsedUsers[userId]) {
            parsedUsers[userId] = {
              ...parsedUsers[userId],
              permissions,
              role,
              updatedAt: new Date().toISOString(),
            };
            localStorage.setItem("mock-users", JSON.stringify(parsedUsers));
          }
        }
      }

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.uid === userId ? { ...user, permissions, role } : user,
        ),
      );

      setEditingUser(null);
      setSuccessMessage("Permissões atualizadas com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error updating permissions:", err);
      setError("Erro ao atualizar permissões");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este utilizador?")) return;

    try {
      if (db) {
        // Delete from Firebase
        await deleteDoc(doc(db, "users", userId));
      } else {
        // Delete from localStorage
        const mockUsers = localStorage.getItem("mock-users");
        if (mockUsers) {
          const parsedUsers = JSON.parse(mockUsers);
          delete parsedUsers[userId];
          localStorage.setItem("mock-users", JSON.stringify(parsedUsers));
        }
      }

      // Update local state
      setUsers((prev) => prev.filter((user) => user.uid !== userId));
      setSuccessMessage("Utilizador eliminado com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Erro ao eliminar utilizador");
      setTimeout(() => setError(null), 3000);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Administrador";
      case "manager":
        return "Gestor";
      default:
        return "Técnico";
    }
  };

  const countPermissions = (permissions: UserProfile["permissions"]) => {
    let count = 0;
    Object.values(permissions).forEach((module) => {
      Object.values(module).forEach((permission) => {
        if (permission) count++;
      });
    });
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">A carregar utilizadores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Gestão de Utilizadores
            </h3>
            <p className="text-gray-600 text-sm">
              Gerir permissões e acessos dos utilizadores
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
          <button
            onClick={() => {
              // Navigate to register form
              window.location.hash = "register";
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Utilizador</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Users List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">
            Utilizadores Registados ({users.length})
          </h4>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum utilizador encontrado</p>
            <p className="text-sm">
              Os utilizadores aparecerão aqui quando forem criados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilizador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissões
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
                  <tr key={user.uid} className="hover:bg-gray-50">
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
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                      >
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {countPermissions(user.permissions)}/24 permissões
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
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      {user.role !== "super_admin" && (
                        <button
                          onClick={() => handleDeleteUser(user.uid)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Eliminar</span>
                        </button>
                      )}
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
