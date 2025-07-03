import React, { useState } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Plus,
  Wrench,
  Waves,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
} from "lucide-react";

// Mock authentication and user data
const ADMIN_USER = {
  email: "gongonsilva@gmail.com",
  password: "19867gsf",
  name: "Gonçalo Fonseca",
  role: "super_admin",
};

// Mock users database
const initialUsers = [
  {
    id: 1,
    name: "Gonçalo Fonseca",
    email: "gongonsilva@gmail.com",
    role: "super_admin",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: true },
      manutencoes: { view: true, create: true, edit: true, delete: true },
      piscinas: { view: true, create: true, edit: true, delete: true },
      utilizadores: { view: true, create: true, edit: true, delete: true },
      relatorios: { view: true, create: true, edit: true, delete: true },
      clientes: { view: true, create: true, edit: true, delete: true },
    },
    active: true,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Maria Silva",
    email: "maria.silva@leirisonda.pt",
    role: "manager",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: true, edit: true, delete: false },
      utilizadores: { view: true, create: false, edit: false, delete: false },
      relatorios: { view: true, create: true, edit: false, delete: false },
      clientes: { view: true, create: true, edit: true, delete: false },
    },
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "João Santos",
    email: "joao.santos@leirisonda.pt",
    role: "technician",
    permissions: {
      obras: { view: true, create: false, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: false, edit: true, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      clientes: { view: true, create: false, edit: false, delete: false },
    },
    active: true,
    createdAt: "2024-02-01",
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporarily hidden login page
  const [currentUser, setCurrentUser] = useState(ADMIN_USER);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState(initialUsers);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSettingsPasswordModal, setShowSettingsPasswordModal] =
    useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsPasswordError, setSettingsPasswordError] = useState("");

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // User form state
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "technician",
    permissions: {
      obras: { view: false, create: false, edit: false, delete: false },
      manutencoes: { view: false, create: false, edit: false, delete: false },
      piscinas: { view: false, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: false, create: false, edit: false, delete: false },
      clientes: { view: false, create: false, edit: false, delete: false },
    },
    active: true,
  });

  // Settings functions
  const handleSettingsPasswordSubmit = (e) => {
    e.preventDefault();
    if (settingsPassword === "19867") {
      setShowSettingsPasswordModal(false);
      setShowSettingsPage(true);
      setSettingsPassword("");
      setSettingsPasswordError("");
    } else {
      setSettingsPasswordError("Palavra-passe incorreta");
    }
  };

  const closeSettings = () => {
    setShowSettingsPage(false);
    setShowSettingsPasswordModal(false);
    setSettingsPassword("");
    setSettingsPasswordError("");
  };

  // Authentication functions
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginForm.email === ADMIN_USER.email &&
      loginForm.password === ADMIN_USER.password
    ) {
      setIsAuthenticated(true);
      setCurrentUser(ADMIN_USER);
      setLoginError("");
    } else {
      setLoginError("Credenciais inválidas");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ email: "", password: "" });
    setActiveSection("dashboard");
  };

  // User management functions
  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "technician",
      permissions: {
        obras: { view: false, create: false, edit: false, delete: false },
        manutencoes: { view: false, create: false, edit: false, delete: false },
        piscinas: { view: false, create: false, edit: false, delete: false },
        utilizadores: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        relatorios: { view: false, create: false, edit: false, delete: false },
        clientes: { view: false, create: false, edit: false, delete: false },
      },
      active: true,
    });
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permissions: { ...user.permissions },
      active: user.active,
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = (userId) => {
    if (userId === 1) {
      alert("Não pode eliminar o utilizador principal!");
      return;
    }
    if (confirm("Tem a certeza que quer eliminar este utilizador?")) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...userForm,
                password: userForm.password || u.password, // Only update password if provided
              }
            : u,
        ),
      );
    } else {
      // Add new user
      const newUser = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        ...userForm,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
    }

    setShowUserForm(false);
  };

  const handlePermissionChange = (module, permission, value) => {
    setUserForm({
      ...userForm,
      permissions: {
        ...userForm.permissions,
        [module]: {
          ...userForm.permissions[module],
          [permission]: value,
        },
      },
    });
  };

  const setRolePermissions = (role) => {
    let permissions = {};

    switch (role) {
      case "super_admin":
        permissions = {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        };
        break;
      case "manager":
        permissions = {
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
        break;
      case "technician":
        permissions = {
          obras: { view: true, create: false, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: true, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        };
        break;
      case "viewer":
        permissions = {
          obras: { view: true, create: false, edit: false, delete: false },
          manutencoes: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
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
        break;
      default:
        permissions = userForm.permissions;
    }

    setUserForm({
      ...userForm,
      role,
      permissions,
    });
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-32 h-20 mb-6 flex items-center justify-center bg-white rounded-lg shadow-md p-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                alt="Leirisonda Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o seu email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Palavra-passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite a sua palavra-passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Entrar
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-gray-400">
            © 2025 Leirisonda. Todos os direitos reservados.
          </div>
        </div>

        {/* Settings Icon */}
        <button
          onClick={() => setShowSettingsPasswordModal(true)}
          className="fixed bottom-4 left-4 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center opacity-30 hover:opacity-60 transition-opacity"
        >
          <Settings className="h-4 w-4 text-gray-600" />
        </button>

        {/* Settings Password Modal */}
        {showSettingsPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Definições do Sistema
                </h2>
                <button
                  onClick={() => setShowSettingsPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleSettingsPasswordSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Palavra-passe de administrador
                  </label>
                  <input
                    type="password"
                    value={settingsPassword}
                    onChange={(e) => {
                      setSettingsPassword(e.target.value);
                      setSettingsPasswordError("");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a palavra-passe"
                    autoFocus
                  />
                  {settingsPasswordError && (
                    <p className="text-red-600 text-sm mt-1">
                      {settingsPasswordError}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSettingsPasswordModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Page */}
        {showSettingsPage && (
          <div className="fixed inset-0 bg-white z-50">
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={closeSettings}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5 text-gray-600" />
                      </button>
                      <h1 className="text-xl font-semibold text-gray-900">
                        Definições do Sistema
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Content */}
              <div className="px-4 py-6 space-y-6">
                {/* Database Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Base de Dados
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL da Base de Dados
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="postgresql://..."
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Testar Ligação
                    </button>
                  </div>
                </div>

                {/* Sync Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Sincronização
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Sincronização automática
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intervalo de sincronização (minutos)
                      </label>
                      <input
                        type="number"
                        defaultValue="15"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações do Sistema
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Versão:</span>
                      <span className="font-medium">2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última atualização:</span>
                      <span className="font-medium">03/07/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado da ligação:</span>
                      <span className="text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                </div>

                {/* Backup Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Cópia de Segurança
                  </h2>
                  <div className="space-y-4">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Criar Backup Manual
                    </button>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Backup automático diário
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "nova-obra", icon: Plus, label: "Nova Obra", path: "/obras/nova" },
    {
      id: "nova-manutencao",
      icon: Wrench,
      label: "Nova Manutenção",
      path: "/manutencao/nova",
    },
    {
      id: "nova-piscina",
      icon: Waves,
      label: "Nova Piscina",
      path: "/piscinas/nova",
    },
    {
      id: "utilizadores",
      icon: UserCheck,
      label: "Utilizadores",
      path: "/utilizadores",
    },
    {
      id: "relatorios",
      icon: BarChart3,
      label: "Relatórios",
      path: "/relatorios",
    },
    { id: "clientes", icon: Users, label: "Clientes", path: "/clientes" },
    {
      id: "configuracoes",
      icon: Settings,
      label: "Configurações",
      path: "/configuracoes",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "nova-obra":
        return (
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-3xl font-bold mb-2">Nova Obra</h1>
              <p className="text-white/90">Criar uma nova obra no sistema</p>
            </div>
            <div className="card-leirisonda">
              <h2 className="text-lg font-semibold mb-4">Detalhes da Obra</h2>
              <p className="text-gray-600">
                Formulário para criar uma nova obra será implementado aqui.
              </p>
            </div>
          </div>
        );
      case "nova-manutencao":
        return (
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-3xl font-bold mb-2">Nova Manutenção</h1>
              <p className="text-white/90">Registar uma nova manutenção</p>
            </div>
            <div className="card-leirisonda">
              <h2 className="text-lg font-semibold mb-4">
                Detalhes da Manutenção
              </h2>
              <p className="text-gray-600">
                Formulário para registar uma nova manutenção será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "nova-piscina":
        return (
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-3xl font-bold mb-2">Nova Piscina</h1>
              <p className="text-white/90">Registar uma nova piscina</p>
            </div>
            <div className="card-leirisonda">
              <h2 className="text-lg font-semibold mb-4">
                Detalhes da Piscina
              </h2>
              <p className="text-gray-600">
                Formulário para registar uma nova piscina será implementado
                aqui.
              </p>
            </div>
          </div>
        );
      case "utilizadores":
        return (
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Gestão de Utilizadores
                  </h1>
                  <p className="text-white/90">
                    Gerir utilizadores e suas permissões
                  </p>
                </div>
                <button
                  onClick={handleAddUser}
                  className="btn-leirisonda mt-4 sm:mt-0"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Utilizador
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="card-leirisonda">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Nome
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Função
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Estado
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Criado
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-medium">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === "super_admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "manager"
                                  ? "bg-blue-100 text-blue-800"
                                  : user.role === "technician"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role === "super_admin"
                              ? "Super Admin"
                              : user.role === "manager"
                                ? "Gestor"
                                : user.role === "technician"
                                  ? "Técnico"
                                  : "Visualizador"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              user.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                user.active ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            {user.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">
                          {user.createdAt}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {user.id !== 1 && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Eliminar"
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

            {/* User Form Modal */}
            {showUserForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {editingUser ? "Editar Utilizador" : "Novo Utilizador"}
                      </h3>
                      <button
                        onClick={() => setShowUserForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveUser} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          required
                          value={userForm.name}
                          onChange={(e) =>
                            setUserForm({ ...userForm, name: e.target.value })
                          }
                          className="input-leirisonda"
                          placeholder="Digite o nome completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={userForm.email}
                          onChange={(e) =>
                            setUserForm({ ...userForm, email: e.target.value })
                          }
                          className="input-leirisonda"
                          placeholder="Digite o email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Palavra-passe{" "}
                          {editingUser && "(deixar vazio para manter atual)"}
                        </label>
                        <input
                          type="password"
                          required={!editingUser}
                          value={userForm.password}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              password: e.target.value,
                            })
                          }
                          className="input-leirisonda"
                          placeholder={
                            editingUser
                              ? "Nova palavra-passe"
                              : "Digite a palavra-passe"
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Função
                        </label>
                        <select
                          value={userForm.role}
                          onChange={(e) => setRolePermissions(e.target.value)}
                          className="input-leirisonda"
                        >
                          <option value="viewer">Visualizador</option>
                          <option value="technician">Técnico</option>
                          <option value="manager">Gestor</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="active"
                        checked={userForm.active}
                        onChange={(e) =>
                          setUserForm({ ...userForm, active: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <label
                        htmlFor="active"
                        className="text-sm font-medium text-gray-700"
                      >
                        Utilizador ativo
                      </label>
                    </div>

                    {/* Permissions */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Permissões Detalhadas
                      </h4>

                      <div className="space-y-4">
                        {Object.entries(userForm.permissions).map(
                          ([module, perms]) => (
                            <div
                              key={module}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <h5 className="font-medium text-gray-900 mb-3 capitalize">
                                {module === "utilizadores"
                                  ? "Utilizadores"
                                  : module === "relatorios"
                                    ? "Relatórios"
                                    : module === "manutencoes"
                                      ? "Manutenções"
                                      : module}
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(perms).map(
                                  ([permission, value]) => (
                                    <label
                                      key={permission}
                                      className="flex items-center space-x-2"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) =>
                                          handlePermissionChange(
                                            module,
                                            permission,
                                            e.target.checked,
                                          )
                                        }
                                        className="rounded border-gray-300"
                                      />
                                      <span className="text-sm text-gray-700 capitalize">
                                        {permission === "view"
                                          ? "Ver"
                                          : permission === "create"
                                            ? "Criar"
                                            : permission === "edit"
                                              ? "Editar"
                                              : "Eliminar"}
                                      </span>
                                    </label>
                                  ),
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="btn-leirisonda">
                        <Save className="h-4 w-4 mr-2" />
                        {editingUser ? "Atualizar" : "Criar"} Utilizador
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gray-50">
            {/* Dashboard Content - Mobile First Design */}
            <div className="px-4 py-4 space-y-4">
              {/* Header Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Olá, Gonçalo Fonseca
                    </h1>
                    <p className="text-sm text-gray-500">
                      quinta-feira, 03 de julho • 23:19
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 text-sm font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="space-y-3">
                {/* Pendentes */}
                <div className="bg-white rounded-lg border-l-4 border-red-500 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pendentes
                      </h3>
                      <p className="text-sm text-gray-500">
                        Necessitam atenção
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">0</div>
                  </div>
                </div>

                {/* Em Progresso */}
                <div className="bg-white rounded-lg border-l-4 border-orange-500 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Em Progresso
                      </h3>
                      <p className="text-sm text-gray-500">A decorrer</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">0</div>
                  </div>
                </div>

                {/* Concluídas */}
                <div className="bg-white rounded-lg border-l-4 border-green-500 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Concluídas
                      </h3>
                      <p className="text-sm text-gray-500">Finalizadas</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">0</div>
                  </div>
                </div>

                {/* Folhas por Fazer */}
                <div className="bg-white rounded-lg border-l-4 border-red-500 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Folhas por Fazer
                      </h3>
                      <p className="text-sm text-gray-500">Por preencher</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">0</div>
                  </div>
                </div>
              </div>

              {/* Próximas Piscinas */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <button className="p-1 mr-3">
                    <span className="text-gray-600 text-lg">←</span>
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Próximas Piscinas
                  </h2>
                </div>

                <div className="p-4 space-y-3">
                  {/* Piscina Magnolia 1 */}
                  <div className="border-l-4 border-cyan-500 bg-cyan-50 rounded-r-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Waves className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Piscina Magnolia
                          </h3>
                          <div className="flex items-center space-x-1 text-gray-600 text-sm">
                            <span>📍</span>
                            <span>Vieira de Leiria</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500 text-sm">
                            <span>📅</span>
                            <span>Em 28 dias</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Próxima: 31/07/2025
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="bg-cyan-200 text-cyan-800 text-xs px-2 py-1 rounded-full font-medium">
                          Agendada
                        </span>
                        <button className="p-1 text-gray-400">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Piscina Magnolia 2 */}
                  <div className="border-l-4 border-cyan-500 bg-cyan-50 rounded-r-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Waves className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Piscina Magnolia
                          </h3>
                          <div className="flex items-center space-x-1 text-gray-600 text-sm">
                            <span>📍</span>
                            <span>Vieira de Leiria</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500 text-sm">
                            <span>📅</span>
                            <span>Em 28 dias</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Próxima: 31/07/2025
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="bg-cyan-200 text-cyan-800 text-xs px-2 py-1 rounded-full font-medium">
                          Agendada
                        </span>
                        <button className="p-1 text-gray-400">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="h-4 w-4 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Ações Rápidas
                  </h2>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setActiveSection("nova-obra")}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Nova Obra</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("nova-manutencao")}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Wrench className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      Manutenção Piscinas
                    </span>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      Todas as Obras
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveSection("utilizadores")}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <UserPlus className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      Novo Utilizador
                    </span>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-blue-600">🔄</span>
                    </div>
                    <span className="font-medium text-blue-900">
                      Diagnóstico de Sincronização
                    </span>
                  </button>
                </div>
              </div>

              {/* Pesquisar Obras */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600">🔍</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pesquisar Obras
                  </h2>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cliente, folha obra, morada..."
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 placeholder-gray-400 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Status Bar */}
          <div className="px-4 py-2 bg-gray-100 text-xs text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="w-1 h-3 bg-cyan-400 rounded-full"></div>
              <span>23:19</span>
              <span className="ml-4">📅 Em 27 dias</span>
              <span className="text-xs">Próxima: 30/07/2025</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>••••</span>
              <span>📶</span>
              <div className="w-6 h-3 bg-red-500 rounded-sm text-white text-center text-xs">
                6
              </div>
            </div>
          </div>

          {/* Logo Header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-10 bg-white rounded-lg shadow-md p-1">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gestão de Obras</p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="px-6 py-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <span>←</span>
              <span>Voltar</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1">
            <button
              onClick={() => {
                setActiveSection("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "dashboard"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("nova-obra");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-left"
            >
              <Plus className="h-5 w-5" />
              <span>Nova Obra</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("nova-manutencao");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-left"
            >
              <Wrench className="h-5 w-5" />
              <span>Manutenção Piscinas</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("nova-piscina");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-left"
            >
              <Plus className="h-5 w-5" />
              <span>Nova Piscina</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("utilizadores");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-left"
            >
              <UserCheck className="h-5 w-5" />
              <span>Utilizadores</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-left">
              <Plus className="h-5 w-5" />
              <span>Criar Utilizador</span>
            </button>
          </nav>

          {/* User Profile */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">G</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Gonçalo Fonseca</p>
                <p className="text-sm text-gray-500">gongonsilva@gmail.com</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App */}
      <div className="min-h-screen">
        {/* Top Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-12 h-6 bg-white rounded shadow-sm p-1">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="w-8"></div>
          </div>
        </div>

        {/* Main Content */}
        <main className="lg:ml-72">{renderContent()}</main>

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:bg-white lg:border-r lg:border-gray-200">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-6 py-5 border-b border-gray-200">
              <div className="w-20 h-12 mr-3 bg-white rounded-lg shadow-md p-1">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gestão de Obras</p>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`nav-item-leirisonda ${isActive ? "active" : ""}`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="px-4 py-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Terminar Sessão</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                © 2025 Leirisonda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
