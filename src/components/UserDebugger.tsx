import React, { useState, useEffect } from "react";
import { Users, Search, Eye, Trash2, Database } from "lucide-react";
// Firestore imports disabled - using local storage only

export const UserDebugger: React.FC = () => {
  const [users, setUsers] = useState({
    mockUsers: [],
    firebaseUsers: [],
    currentUser: null,
  });
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);

    // Load mock users from localStorage
    const mockUsersData = localStorage.getItem("mock-users");
    const mockUsers = mockUsersData ? JSON.parse(mockUsersData) : [];

    const currentUserData = localStorage.getItem("mock-current-user");
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

    // Load Firebase users if available
    let firebaseUsers = [];
    if (db) {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        firebaseUsers = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.warn("Could not load Firebase users:", error);
      }
    }

    setUsers({
      mockUsers,
      firebaseUsers,
      currentUser,
    });
    setLoading(false);
  };

  const clearMockUsers = () => {
    localStorage.removeItem("mock-users");
    localStorage.removeItem("mock-current-user");
    loadUsers();
  };

  const testLogin = async (email: string, password: string = "123456") => {
    const { authService } = await import("../services/authService");
    const result = await authService.login(email, password);

    if (result.success) {
      alert(`✅ Login com ${email} funcionou!`);
    } else {
      alert(`❌ Login com ${email} falhou: ${result.error}`);
    }
  };

  const forceMigration = async () => {
    const { mockAuthService } = await import("../services/mockAuthService");
    mockAuthService.reloadUsers();
    loadUsers();
    alert("Migração forçada realizada!");
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="fixed top-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-md max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm flex items-center">
          <Users className="w-4 h-4 mr-1" />
          Debug Utilizadores
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            {loading ? "..." : "Atualizar"}
          </button>
          <button
            onClick={forceMigration}
            className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
          >
            Migrar
          </button>
        </div>
      </div>

      {/* Current User */}
      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
        <strong>Utilizador Atual:</strong>
        {users.currentUser ? (
          <div className="mt-1">
            <div>Nome: {users.currentUser.name}</div>
            <div>Email: {users.currentUser.email}</div>
            <div>Tipo: {users.currentUser.role}</div>
          </div>
        ) : (
          <div className="text-gray-500 mt-1">Nenhum utilizador logado</div>
        )}
      </div>

      {/* Mock Users */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <strong className="text-xs">
            Mock Users ({users.mockUsers.length}):
          </strong>
          <button
            onClick={clearMockUsers}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Limpar
          </button>
        </div>
        {users.mockUsers.map((user: any, index) => (
          <div
            key={index}
            className="p-2 border border-gray-200 rounded mb-1 text-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <div>
                  <strong>{user.name}</strong>
                </div>
                <div className="text-gray-600">{user.email}</div>
                <div className="text-gray-500">{user.role}</div>
                <div className="text-red-500">
                  Pass: {user.password || "❌ SEM PASSWORD"}
                </div>
              </div>
              <button
                onClick={() => testLogin(user.email, user.password || "123456")}
                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Test
              </button>
            </div>
          </div>
        ))}
        {users.mockUsers.length === 0 && (
          <div className="text-gray-500 text-xs">Nenhum utilizador mock</div>
        )}
      </div>

      {/* Firebase Users */}
      <div>
        <strong className="text-xs">
          Firebase Users ({users.firebaseUsers.length}):
        </strong>
        {users.firebaseUsers.map((user: any, index) => (
          <div
            key={index}
            className="p-2 border border-gray-200 rounded mb-1 mt-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <div>
                  <strong>{user.name}</strong>
                </div>
                <div className="text-gray-600">{user.email}</div>
                <div className="text-gray-500">{user.role}</div>
              </div>
              <button
                onClick={() => testLogin(user.email)}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Test
              </button>
            </div>
          </div>
        ))}
        {users.firebaseUsers.length === 0 && (
          <div className="text-gray-500 text-xs mt-2">
            Nenhum utilizador Firebase
          </div>
        )}
      </div>
    </div>
  );
};
