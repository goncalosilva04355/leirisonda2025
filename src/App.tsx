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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState(initialUsers);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Leirisonda
            </h2>
            <p className="text-gray-600">Sistema de Gestão de Obras</p>
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
            © 2024 Leirisonda. Todos os direitos reservados.
          </div>
        </div>
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
          <div className="leirisonda-main">
            <div className="dashboard-hero">
              <h1 className="text-4xl font-bold mb-4">
                Bem-vindo ao Sistema Leirisonda
              </h1>
              <p className="text-lg text-white/90">
                Sistema de gestão de obras e manutenção de piscinas
              </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid mb-8">
              <div className="stat-card-leirisonda stat-card-primary">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-sm text-gray-600">Obras Ativas</p>
                  </div>
                </div>
              </div>

              <div className="stat-card-leirisonda stat-card-success">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Wrench className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">8</h3>
                    <p className="text-sm text-gray-600">Manutenções</p>
                  </div>
                </div>
              </div>

              <div className="stat-card-leirisonda stat-card-secondary">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Waves className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">24</h3>
                    <p className="text-sm text-gray-600">Piscinas</p>
                  </div>
                </div>
              </div>

              <div className="stat-card-leirisonda stat-card-warning">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">156</h3>
                    <p className="text-sm text-gray-600">Clientes</p>
                  </div>
                </div>
              </div>

              <div className="stat-card-leirisonda stat-card-primary">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">6</h3>
                    <p className="text-sm text-gray-600">Utilizadores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
              <div className="space-y-6">
                <div className="card-leirisonda">
                  <h2 className="text-xl font-semibold mb-4">
                    Atividade Recente
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Nova obra iniciada - Piscina Quinta da Marinha
                        </p>
                        <p className="text-xs text-gray-500">há 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Manutenção completada - Casa Sr. Silva
                        </p>
                        <p className="text-xs text-gray-500">há 4 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Novo cliente registado - Maria Santos
                        </p>
                        <p className="text-xs text-gray-500">há 1 dia</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-leirisonda">
                  <h2 className="text-xl font-semibold mb-4">
                    Próximas Tarefas
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        Inspeção piscina - Hotel Atlantic
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Amanhã
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        Manutenção quinzenal - Condomínio Sol
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Sexta-feira
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        Orçamento nova piscina - Villa Cascais
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Próxima semana
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card-leirisonda">
                  <h2 className="text-xl font-semibold mb-4">Resumo do Mês</h2>
                  <div className="space-y-4">
                    <div className="section-leirisonda-blue">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Receita</span>
                        <span className="text-lg font-bold">€12.450</span>
                      </div>
                    </div>
                    <div className="section-leirisonda">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Obras Concluídas
                        </span>
                        <span className="text-lg font-bold">18</span>
                      </div>
                    </div>
                    <div className="section-leirisonda">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Novos Clientes
                        </span>
                        <span className="text-lg font-bold">7</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-leirisonda">
                  <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveSection("nova-obra")}
                      className="btn-leirisonda w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Obra
                    </button>
                    <button
                      onClick={() => setActiveSection("nova-manutencao")}
                      className="btn-leirisonda btn-leirisonda-secondary w-full"
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Nova Manutenção
                    </button>
                    <button
                      onClick={() => setActiveSection("nova-piscina")}
                      className="btn-leirisonda w-full"
                    >
                      <Waves className="h-4 w-4 mr-2" />
                      Nova Piscina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="leirisonda-layout">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-5 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
              <p className="text-sm text-gray-500">Gestão de Obras</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`nav-item-leirisonda ${isActive ? "active" : ""}`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Terminar Sessão</span>
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              © 2024 Leirisonda
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="lg:ml-72 bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Bem-vindo, {currentUser?.name || "Utilizador"}
            </p>
            <p className="text-xs text-gray-500">Sistema de Gestão de Obras</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-72">{renderContent()}</main>

      {/* Sidebar overlay for mobile */}
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
