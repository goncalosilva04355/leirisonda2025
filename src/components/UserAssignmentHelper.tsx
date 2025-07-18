import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  active: boolean;
}

interface UserAssignmentHelperProps {
  assignedUsers: Array<{ id: string; name: string }>;
  onAssignUser: (user: { id: string; name: string }) => void;
  onRemoveUser: (index: number) => void;
  disabled?: boolean;
}

export const UserAssignmentHelper: React.FC<UserAssignmentHelperProps> = ({
  assignedUsers,
  onAssignUser,
  onRemoveUser,
  disabled = false,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load users from localStorage
  const loadUsers = () => {
    setIsLoading(true);
    try {
      const savedUsers = localStorage.getItem("app-users");
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        // Filter only active users that can be assigned to works
        let availableUsers = parsedUsers.filter(
          (user: User) => user.active && user.role !== "technician",
        );

        // Ensure Gonçalo Fonseca is always available for assignment
        const goncaloExists = availableUsers.some(
          (user: User) =>
            user.email === "gongonsilva@gmail.com" ||
            user.name === "Gonçalo Fonseca",
        );

        if (!goncaloExists) {
          // Add Gonçalo Fonseca as a default assignable user
          availableUsers.push({
            id: "1",
            name: "Gonçalo Fonseca",
            email: "gongonsilva@gmail.com",
            active: true,
            role: "super_admin",
          } as User);
        }

        setUsers(availableUsers);
      } else {
        // If no users saved, ensure Gonçalo is available
        setUsers([
          {
            id: "1",
            name: "Gonçalo Fonseca",
            email: "gongonsilva@gmail.com",
            active: true,
            role: "super_admin",
          } as User,
        ]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      // Fallback: at least provide Gonçalo as assignable
      setUsers([
        {
          id: "1",
          name: "Gonçalo Fonseca",
          email: "gongonsilva@gmail.com",
          active: true,
          role: "super_admin",
        } as User,
      ]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();

    // Listen for user updates
    const handleUsersUpdated = () => {
      loadUsers();
    };

    window.addEventListener("usersUpdated", handleUsersUpdated);
    return () => window.removeEventListener("usersUpdated", handleUsersUpdated);
  }, []);

  // Filter available users (not already assigned)
  const availableUsers = users.filter((user) => {
    const isAssigned = assignedUsers.some(
      (assigned) => assigned.id === user.id,
    );
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return !isAssigned && matchesSearch;
  });

  const handleUserSelect = (user: User) => {
    onAssignUser({ id: user.id, name: user.name });
    setSearchTerm("");
    setShowDropdown(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Administrador";
      case "user":
        return "Utilizador";
      default:
        return "Utilizador";
    }
  };

  return (
    <div className="space-y-4">
      {/* User Search and Assignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Utilizadores Atribuídos
        </label>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {users.length} disponíveis
            </span>
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
              {assignedUsers.length} atribuídos
            </span>
          </div>

          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onFocus={() => setShowDropdown(searchTerm.length > 0)}
              placeholder="Pesquisar utilizador para atribuir..."
              disabled={disabled}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Dropdown */}
          {showDropdown && availableUsers.length > 0 && !disabled && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}
                  >
                    {getRoleDisplayName(user.role)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No users message */}
          {showDropdown && availableUsers.length === 0 && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
              {users.length === 0 ? (
                <div className="flex flex-col items-center space-y-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <div className="text-sm">
                    <div className="font-medium">
                      Nenhum utilizador encontrado
                    </div>
                    <div className="text-xs">
                      Vá às Configurações → Gestão de Utilizadores para criar
                      utilizadores
                    </div>
                  </div>
                </div>
              ) : (
                "Nenhum utilizador corresponde à pesquisa ou todos já estão atribuídos"
              )}
            </div>
          )}
        </div>

        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* Assigned Users List */}
      {assignedUsers.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Utilizadores Atribuídos ({assignedUsers.length})
          </h4>
          <div className="space-y-2">
            {assignedUsers.map((assignedUser, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {assignedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-900">
                    {assignedUser.name}
                  </span>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemoveUser(index)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                    title="Remover utilizador"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
          <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Nenhum utilizador atribuído</p>
          <p className="text-xs text-gray-400">
            Use o campo de pesquisa acima para atribuir utilizadores
          </p>
        </div>
      )}

      {/* Quick Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Dica:</h4>
        <p className="text-xs text-blue-700">
          Digite parte do nome ou email do utilizador para encontrá-lo
          rapidamente. Apenas utilizadores ativos e com permissões adequadas
          aparecerão na lista.
        </p>
      </div>
    </div>
  );
};
