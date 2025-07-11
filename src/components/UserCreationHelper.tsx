import React, { useState } from "react";
import { UserPlus, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { robustLoginService } from "../services/robustLoginService";
import UserSyncManager from "../utils/userSyncManager";

interface UserCreationHelperProps {
  email?: string;
  onUserCreated?: () => void;
}

export const UserCreationHelper: React.FC<UserCreationHelperProps> = ({
  email = "",
  onUserCreated,
}) => {
  const [formData, setFormData] = useState({
    email: email,
    password: "",
    name: "",
    role: "technician" as "super_admin" | "manager" | "technician",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const createUser = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      setMessage({
        type: "error",
        text: "Por favor, preencha todos os campos obrigatórios",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // First check if user already exists
      const existingUser = UserSyncManager.userExists(formData.email);

      if (existingUser.inLocal || existingUser.inMock) {
        setMessage({
          type: "info",
          text: "Utilizador já existe no sistema. A sincronizar...",
        });

        // Force sync to ensure consistency
        UserSyncManager.performFullSync();

        setMessage({
          type: "success",
          text: "Utilizador sincronizado com sucesso!",
        });

        if (onUserCreated) onUserCreated();
        return;
      }

      // Create new user
      const result = await authService.register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
      );

      if (result.success) {
        setMessage({
          type: "success",
          text: "✅ Utilizador criado com sucesso! Pode agora fazer login.",
        });

        // Clear form
        setFormData({
          email: "",
          password: "",
          name: "",
          role: "technician",
        });

        if (onUserCreated) onUserCreated();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Erro ao criar utilizador",
        });
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      setMessage({
        type: "error",
        text: `Erro inesperado: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const syncAllUsers = () => {
    setLoading(true);
    setMessage(null);

    try {
      const result = UserSyncManager.performFullSync();
      setMessage({
        type: "success",
        text: `✅ Sincronização concluída! ${result.localUsers} utilizadores locais, ${result.mockUsers} utilizadores mock.`,
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Erro na sincronização: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Criação de Utilizador
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="utilizador@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do utilizador"
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
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Função
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                role: e.target.value as
                  | "super_admin"
                  | "manager"
                  | "technician",
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="technician">Técnico</option>
            <option value="manager">Gestor</option>
            <option value="super_admin">Super Administrador</option>
          </select>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 border border-green-200"
                : message.type === "error"
                  ? "bg-red-50 border border-red-200"
                  : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div
              className={`flex items-center text-sm ${
                message.type === "success"
                  ? "text-green-700"
                  : message.type === "error"
                    ? "text-red-700"
                    : "text-blue-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={createUser}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            {loading ? "A criar..." : "Criar Utilizador"}
          </button>

          <button
            onClick={syncAllUsers}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar
          </button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <strong>Nota:</strong> Este utilizador será criado no sistema local e
          sincronizado automaticamente com outros dispositivos quando possível.
        </div>
      </div>
    </div>
  );
};

export default UserCreationHelper;
