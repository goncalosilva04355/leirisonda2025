import React, { useState, useEffect } from "react";
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
import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { useDataSync } from "./hooks/useDataSync";

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
  const [currentUser, setCurrentUser] = useState(ADMIN_USER);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("futuras-manutencoes");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSettingsPasswordModal, setShowSettingsPasswordModal] =
    useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsPasswordError, setSettingsPasswordError] = useState("");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedPassword, setAdvancedPassword] = useState("");
  const [advancedPasswordError, setAdvancedPasswordError] = useState("");
  const [isAdvancedUnlocked, setIsAdvancedUnlocked] = useState(false);

  // Data sync hook - manages all data with optional Firebase sync
  const dataSync = useDataSync();
  const {
    pools,
    maintenance,
    futureMaintenance,
    works,
    clients,
    isLoading: syncLoading,
    lastSync,
    error: syncError,
    syncWithFirebase,
    enableSync,
  } = dataSync;

  // Keep local users state for user management
  const [users, setUsers] = useState(initialUsers);
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [interventionSaved, setInterventionSaved] = useState(false);

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

  const handleSaveIntervention = () => {
    setInterventionSaved(true);
    setShowShareModal(true);
  };

  const handleShare = (platform) => {
    // Generate PDF and share logic would go here
    console.log(`Sharing via ${platform}`);
    // For demo purposes, just close modal and go back to piscinas
    setShowShareModal(false);
    setInterventionSaved(false);
    setActiveSection("piscinas");
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

  // Advanced settings functions
  const handleAdvancedPasswordSubmit = (e) => {
    e.preventDefault();
    if (advancedPassword === "19867") {
      setIsAdvancedUnlocked(true);
      setAdvancedPasswordError("");
    } else {
      setAdvancedPasswordError("Palavra-passe incorreta");
    }
  };

  const handleAdvancedSettingsBack = () => {
    setShowAdvancedSettings(false);
    setIsAdvancedUnlocked(false);
    setAdvancedPassword("");
    setAdvancedPasswordError("");
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
    // Check if it's the main user
    const user = users.find(
      (u) => u.id === userId || u.id === parseInt(userId),
    );
    if (user && user.email === "gongonsilva@gmail.com") {
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
                password: userForm.password || u.password,
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
      id: "futuras-manutencoes",
      icon: Waves,
      label: "Piscinas",
      path: "/piscinas",
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
      case "dashboard":
        return (
          <div className="min-h-screen bg-gray-50">
            {/* Dashboard Content - Mobile First Design */}
            <div className="px-4 py-4 space-y-4">
              {/* Header Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-lg shadow-md p-1">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                        alt="Leirisonda Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      Olá, Gonçalo Fonseca
                    </h1>
                    <p className="text-gray-600 text-sm">
                      Bem-vindo ao sistema Leirisonda
                    </p>
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
                      <p className="text-sm text-gray-500">
                        Obras em andamento
                      </p>
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
                <div className="bg-white rounded-lg border-l-4 border-blue-500 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Folhas por Fazer
                      </h3>
                      <p className="text-sm text-gray-500">A processar</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">0</div>
                  </div>
                </div>
              </div>

              {/* Próximas Manutenções */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <button className="p-1 mr-3">
                    <span className="text-gray-600 text-lg">←</span>
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Próximas Manuten��ões
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
                      Manutenç��o Piscinas
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

      case "piscinas":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Waves className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Piscinas
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Gestão de piscinas no sistema
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection("nova-piscina")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Nova Piscina</span>
                  </button>
                </div>
              </div>

              {/* Submenu */}
              <div className="bg-white rounded-lg shadow-sm p-1">
                <div className="grid grid-cols-3 gap-1">
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                    Piscinas
                  </button>
                  <button
                    onClick={() => setActiveSection("manutencoes")}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Manutenções
                  </button>
                  <button
                    onClick={() => setActiveSection("futuras-manutencoes")}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Futuras Manutenções
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Pesquisar piscinas..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Todos os estados</option>
                    <option>Ativa</option>
                    <option>Inativa</option>
                    <option>Em Manutenção</option>
                  </select>
                </div>
              </div>

              {/* Pools List */}
              <div className="space-y-4">
                {pools.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Waves className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhuma piscina registada
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Comece por adicionar a primeira piscina ao sistema
                    </p>
                    <button
                      onClick={() => setActiveSection("nova-piscina")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar Piscina</span>
                    </button>
                  </div>
                ) : (
                  pools.map((pool) => (
                    <div
                      key={pool.id}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {pool.name}
                          </h3>
                          <p className="text-gray-600">{pool.location}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">
                              Cliente: {pool.client}
                            </span>
                            <span className="text-sm text-gray-500">
                              Tipo: {pool.type}
                            </span>
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                pool.status === "Ativa"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {pool.status}
                            </span>
                          </div>
                          {pool.nextMaintenance && (
                            <p className="text-sm text-blue-600 mt-1">
                              Próxima manutenção:{" "}
                              {new Date(
                                pool.nextMaintenance,
                              ).toLocaleDateString("pt-PT")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => dataSync.deletePool(pool.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "manutencoes":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Manutenções
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Histórico de manutenções realizadas
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection("nova-manutencao")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Nova Manutenção</span>
                  </button>
                </div>
              </div>

              {/* Submenu */}
              <div className="bg-white rounded-lg shadow-sm p-1">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setActiveSection("piscinas")}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Piscinas
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                    Manutenções
                  </button>
                  <button
                    onClick={() => setActiveSection("futuras-manutencoes")}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Futuras Manutenções
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Pesquisar manutenções..."
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Todas as piscinas</option>
                  </select>
                  <input
                    type="month"
                    defaultValue="2025-01"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Lista de Manutenções */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Wrench className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma manutenção registada
                  </h3>
                  <p className="text-gray-600 text-sm">
                    As manutenções aparecerão aqui quando forem criadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "futuras-manutencoes":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Futuras Manutenções
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Manutenções agendadas e programadas
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection("nova-manutencao")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agendar Manutenção</span>
                  </button>
                </div>
              </div>

              {/* Submenu */}
              <div className="bg-white rounded-lg shadow-sm p-1">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setActiveSection("piscinas")}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Piscinas
                  </button>
                  <button
                    onClick={() => setActiveSection("manutencoes")}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Manutenções
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                    Futuras Manutenções
                  </button>
                </div>
              </div>

              {/* Future Maintenance List */}
              <div className="space-y-4">
                {futureMaintenance.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhuma manutenção agendada
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      As futuras manutenções aparecerão aqui quando forem
                      agendadas
                    </p>
                    <button
                      onClick={() => setActiveSection("nova-manutencao")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agendar Manutenção</span>
                    </button>
                  </div>
                ) : (
                  futureMaintenance.map((maint) => (
                    <div
                      key={maint.id}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {maint.poolName}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                maint.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : maint.status === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {maint.status === "pending"
                                ? "Agendado"
                                : maint.status === "in_progress"
                                  ? "Em Progresso"
                                  : "Concluído"}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{maint.type}</p>
                          <p className="text-sm text-gray-500 mb-2">
                            {maint.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-blue-600">
                              📅{" "}
                              {new Date(maint.scheduledDate).toLocaleDateString(
                                "pt-PT",
                              )}
                            </span>
                            <span className="text-gray-500">
                              👨‍🔧 {maint.technician}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => dataSync.deleteMaintenance(maint.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "nova-obra":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Nova Obra</h1>
                <p className="text-gray-600 text-sm">
                  Criar uma nova obra no sistema
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-600">
                  Formulário de nova obra em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        );

      case "nova-piscina":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                  Nova Piscina
                </h1>
                <p className="text-gray-600 text-sm">
                  Adicionar uma nova piscina ao sistema
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-600">
                  Formulário de nova piscina em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        );

      case "nova-manutencao":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                  Nova Manutenção
                </h1>
                <p className="text-gray-600 text-sm">
                  Registar uma nova manutenção
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-600">
                  Formulário de nova manutenção em desenvolvimento
                </p>
                <button
                  onClick={handleSaveIntervention}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar Manutenção
                </button>
              </div>
            </div>
          </div>
        );

      case "utilizadores":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                  Utilizadores
                </h1>
                <p className="text-gray-600 text-sm">
                  Gestão de utilizadores do sistema
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-600">
                  Sistema de utilizadores em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        );

      case "configuracoes":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                  Configurações
                </h1>
                <p className="text-gray-600 text-sm">
                  Gerir definições do sistema
                </p>
              </div>

              {/* System Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informações do Sistema
                </h3>
                <div className="grid gap-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Versão</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Utilizador Ativo</span>
                    <span className="font-medium">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Perfil</span>
                    <span className="font-medium capitalize">
                      {currentUser.role.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Modo de Dados</span>
                    <span className="font-medium">Armazenamento Local</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Página não encontrada
              </h1>
              <p className="text-gray-600">
                A seção solicitada não foi encontrada.
              </p>
            </div>
          </div>
        );
    }
  };

  // Share Modal
  if (showShareModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Partilhar Relatório
              </h2>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setInterventionSaved(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Manutenção guardada com sucesso!
                </h3>
                <p className="text-gray-600">
                  Escolha como pretende partilhar o relatório
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleShare("whatsapp")}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">Enviar por WhatsApp</p>
                </div>
              </button>

              <button
                onClick={() => handleShare("email")}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">Enviar por email</p>
                </div>
              </button>

              <button
                onClick={() => handleShare("sms")}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">SMS</p>
                  <p className="text-sm text-gray-500">Enviar por SMS</p>
                </div>
              </button>

              <button
                onClick={() => handleShare("download")}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Save className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Download PDF</p>
                  <p className="text-sm text-gray-500">Baixar arquivo</p>
                </div>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Conteúdo do Relatório:
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Dados da intervenção</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Valores da água</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Produtos químicos utilizados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Trabalho realizado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Fotografias</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Observações e próxima manutenção</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setInterventionSaved(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Agora Não
              </button>
              <button
                onClick={() => handleShare("preview")}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Pré-visualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    if (showAdvancedSettings) {
      if (isAdvancedUnlocked) {
        return (
          <AdvancedSettings
            onBack={handleAdvancedSettingsBack}
            dataSync={{
              pools,
              maintenance,
              works,
              clients,
              lastSync,
              syncWithFirebase,
              enableSync,
            }}
          />
        );
      }

      // Password protection screen
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Área Protegida
              </h1>
              <p className="text-gray-600">
                Insira a palavra-passe para aceder às configurações avançadas
              </p>
            </div>

            <form onSubmit={handleAdvancedPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  value={advancedPassword}
                  onChange={(e) => setAdvancedPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Insira a palavra-passe"
                  required
                />
              </div>

              {advancedPasswordError && (
                <div className="text-red-600 text-sm">
                  {advancedPasswordError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-32 h-20 bg-white rounded-lg shadow-md p-2 mx-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                alt="Leirisonda Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm">{loginError}</div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Entrar
            </button>
          </form>

          {/* Advanced Settings Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAdvancedSettings(true)}
              className="w-full flex items-center justify-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações Avançadas</span>
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Configure sincronização Firebase
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
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
                <p className="text-sm text-gray-500">Gestão de Serviços</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => {
                setActiveSection("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "dashboard"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "nova-obra"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Nova Obra</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("nova-manutencao");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "nova-manutencao"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Wrench className="h-5 w-5" />
              <span>Nova Manutenção</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("futuras-manutencoes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "futuras-manutencoes"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Waves className="h-5 w-5" />
              <span>Piscinas</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("utilizadores");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "utilizadores"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <UserCheck className="h-5 w-5" />
              <span>Utilizadores</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("relatorios");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "relatorios"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Relatórios</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("clientes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "clientes"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Clientes</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("configuracoes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "configuracoes"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </button>
          </nav>

          {/* User Section */}
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-sm text-gray-500">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Terminar Sessão</span>
            </button>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">© 2025 Leirisonda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-80">{renderContent()}</main>
    </div>
  );
}

export default App;
