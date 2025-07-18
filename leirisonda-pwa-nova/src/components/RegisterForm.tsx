import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { robustLoginService } from "../services/robustLoginService";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onCancel?: () => void;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "super_admin" | "admin" | "manager" | "technician";
  permissions: {
    [module: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

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
  super_admin: "Super Administrador - Acesso total ao sistema",
  admin: "Administrador - Acesso de gestão completo",
  manager: "Gestor - Acesso de gestão limitado",
  technician: "Técnico - Acesso operacional",
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onCancel,
}) => {
  const [userForm, setUserForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "technician",
    permissions: getDefaultPermissions("technician"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function getDefaultPermissions(role: string) {
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
          obras: { view: true, create: true, edit: true, delete: true },
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
  }

  const handleRoleChange = (newRole: UserForm["role"]) => {
    setUserForm((prev) => ({
      ...prev,
      role: newRole,
      permissions: getDefaultPermissions(newRole),
    }));
  };

  const handlePermissionChange = (
    module: string,
    action: string,
    value: boolean,
  ) => {
    setUserForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: value,
        },
      },
    }));
  };

  const validateForm = () => {
    if (!userForm.name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }

    if (!userForm.email.trim()) {
      setError("Email é obrigatório");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      setError("Email inválido");
      return false;
    }

    if (!userForm.password) {
      setError("Password é obrigatória");
      return false;
    }

    if (userForm.password.length < 6) {
      setError("Password deve ter pelo menos 6 caracteres");
      return false;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setError("As passwords não coincidem");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Register user with robustLoginService
      const result = await robustLoginService.register(
        userForm.email,
        userForm.password,
        userForm.name,
        userForm.role,
        userForm.permissions,
      );

      if (result.success) {
        setSuccess("Utilizador criado com sucesso!");
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        setError(result.error || "Erro ao criar utilizador");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Erro inesperado ao criar utilizador");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6" />
              <div>
                <h3 className="text-lg font-bold">Criar Novo Utilizador</h3>
                <p className="text-blue-100 text-sm">
                  Preencha os dados e defina as permissões
                </p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-blue-100 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[70vh]"
        >
          {/* Messages */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Informações Básicas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: joao@leirisonda.pt"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({ ...userForm, password: e.target.value })
                      }
                      className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={userForm.confirmPassword}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Repetir password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Função do Utilizador
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(
                  Object.keys(roleDescriptions) as Array<
                    keyof typeof roleDescriptions
                  >
                ).map((roleKey) => (
                  <label
                    key={roleKey}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      userForm.role === roleKey
                        ? getRoleBadgeColor(roleKey) + " border-current"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={roleKey}
                      checked={userForm.role === roleKey}
                      onChange={(e) =>
                        handleRoleChange(e.target.value as UserForm["role"])
                      }
                      className="text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {roleDescriptions[roleKey].split(" - ")[0]}
                      </div>
                      <div className="text-sm opacity-75">
                        {roleDescriptions[roleKey].split(" - ")[1]}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Permissions Matrix */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Permissões Personalizadas
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
                              checked={
                                userForm.permissions[module]?.[action] || false
                              }
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
            {userForm.role === "super_admin" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
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
        </form>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>A criar...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Criar Utilizador</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
