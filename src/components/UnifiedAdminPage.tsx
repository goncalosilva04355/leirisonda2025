import React, { useState, useEffect } from "react";
import {
  Settings,
  Users,
  UserPlus,
  Edit,
  Trash2,
  Save,
  X,
  Shield,
  Database,
  BarChart3,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Mail,
  Key,
  User,
  Bell,
  Waves,
  Building2,
  Wrench,
  FileText,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import jsPDF from "jspdf";
import { AuthorizedUser } from "../config/authorizedUsers";
import { useAuthorizedUsers } from "../hooks/useAuthorizedUsers";
import { safeLocalStorage } from "../utils/storageUtils";

interface UnifiedAdminPageProps {
  currentUser: any;
  onBack: () => void;
  // Data para relatórios
  pools: any[];
  works: any[];
  maintenance: any[];
  clients: any[];
  users: any[];
  // Settings
  enablePhoneDialer: boolean;
  enableMapsRedirect: boolean;
  togglePhoneDialer: (enabled: boolean) => void;
  toggleMapsRedirect: (enabled: boolean) => void;
  // Data cleanup
  handleDataCleanup: () => void;
  cleanupLoading: boolean;
  cleanupError: string | null;
}

export const UnifiedAdminPage: React.FC<UnifiedAdminPageProps> = ({
  currentUser,
  onBack,
  pools,
  works,
  maintenance,
  clients,
  users,
  enablePhoneDialer,
  enableMapsRedirect,
  togglePhoneDialer,
  toggleMapsRedirect,
  handleDataCleanup,
  cleanupLoading,
  cleanupError,
}) => {
  const [activeTab, setActiveTab] = useState("configuracoes");
  const {
    users: authorizedUsers,
    updateUsers,
    isLoading,
  } = useAuthorizedUsers();

  // User management states
  const [editingUser, setEditingUser] = useState<AuthorizedUser | null>(null);
  const [newUser, setNewUser] = useState<
    AuthorizedUser & { password?: string }
  >({
    email: "",
    name: "",
    role: "technician",
    password: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string>("");

  // Garantir que há pelo menos o utilizador padrão
  useEffect(() => {
    if (!isLoading && authorizedUsers.length === 0) {
      console.log("⚠️ Inicializando utilizador padrão...");
      const defaultUsers = [
        {
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "super_admin" as const,
        },
      ];
      updateUsers(defaultUsers);
    }
  }, [isLoading, authorizedUsers.length, updateUsers]);

  // User management functions
  const handleAddUser = async () => {
    setErrors("");

    if (!newUser.email || !newUser.name || !newUser.password) {
      setErrors("Todos os campos são obrigatórios");
      return;
    }

    if (newUser.password.length < 3) {
      setErrors("A password deve ter pelo menos 3 caracteres");
      return;
    }

    const emailExists = authorizedUsers.some(
      (user) => user.email === newUser.email,
    );
    if (emailExists) {
      setErrors("Já existe um utilizador com este email");
      return;
    }

    try {
      const userToAdd = {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };

      // Adicionar aos utilizadores autorizados
      const updatedUsers = [...authorizedUsers, userToAdd];
      await updateUsers(updatedUsers);

      // Adicionar aos utilizadores da aplicação com password
      const existingAppUsers = JSON.parse(
        safeLocalStorage.getItem("app-users") || "[]",
      );
      const newAppUser = {
        id: Date.now(),
        email: newUser.email,
        name: newUser.name,
        password: newUser.password,
        role: newUser.role,
        active: true,
        permissions: getDefaultPermissions(newUser.role),
        createdAt: new Date().toISOString(),
      };

      existingAppUsers.push(newAppUser);
      safeLocalStorage.setItem("app-users", JSON.stringify(existingAppUsers));

      // Reset form
      setNewUser({ email: "", name: "", role: "technician", password: "" });
      setShowAddForm(false);

      // Trigger update event
      window.dispatchEvent(new CustomEvent("usersUpdated"));

      console.log("✅ Utilizador criado com sucesso:", userToAdd);
    } catch (error) {
      console.error("❌ Erro ao criar utilizador:", error);
      setErrors("Erro ao criar utilizador. Tente novamente.");
    }
  };

  const handleDeleteUser = async (userToDelete: AuthorizedUser) => {
    if (userToDelete.email === "gongonsilva@gmail.com") {
      alert("Não é possível eliminar o super administrador principal");
      return;
    }

    if (
      confirm(
        `Tem a certeza que deseja eliminar o utilizador ${userToDelete.name}?`,
      )
    ) {
      try {
        const updatedUsers = authorizedUsers.filter(
          (user) => user.email !== userToDelete.email,
        );
        await updateUsers(updatedUsers);

        // Remover também dos utilizadores da aplicação
        const existingAppUsers = JSON.parse(
          safeLocalStorage.getItem("app-users") || "[]",
        );
        const filteredAppUsers = existingAppUsers.filter(
          (user: any) => user.email !== userToDelete.email,
        );
        safeLocalStorage.setItem("app-users", JSON.stringify(filteredAppUsers));

        // Trigger update event
        window.dispatchEvent(new CustomEvent("usersUpdated"));

        console.log("✅ Utilizador eliminado:", userToDelete.email);
      } catch (error) {
        console.error("❌ Erro ao eliminar utilizador:", error);
        alert("Erro ao eliminar utilizador");
      }
    }
  };

  const getDefaultPermissions = (role: string) => {
    const basePermissions = {
      obras: { view: false, create: false, edit: false, delete: false },
      manutencoes: { view: false, create: false, edit: false, delete: false },
      piscinas: { view: false, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: false, create: false, edit: false, delete: false },
      clientes: { view: false, create: false, edit: false, delete: false },
    };

    switch (role) {
      case "super_admin":
        return Object.fromEntries(
          Object.entries(basePermissions).map(([key, _]) => [
            key,
            { view: true, create: true, edit: true, delete: true },
          ]),
        );
      case "admin":
        return Object.fromEntries(
          Object.entries(basePermissions).map(([key, _]) => [
            key,
            {
              view: true,
              create: true,
              edit: true,
              delete: key !== "utilizadores",
            },
          ]),
        );
      case "manager":
        return {
          ...basePermissions,
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: false, delete: false },
          clientes: { view: true, create: true, edit: false, delete: false },
          relatorios: { view: true, create: false, edit: false, delete: false },
        };
      case "technician":
        return {
          ...basePermissions,
          obras: { view: true, create: false, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: false, delete: false },
        };
      default:
        return basePermissions;
    }
  };

  // Generate PDF Report
  const generatePDFReport = (type: string) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const marginLeft = 20;
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.text("Leirisonda - Relatório", marginLeft, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`Tipo: ${type}`, marginLeft, yPosition);
    yPosition += 5;
    pdf.text(
      `Data: ${new Date().toLocaleDateString("pt-PT")}`,
      marginLeft,
      yPosition,
    );
    yPosition += 5;
    pdf.text(`Utilizador: ${currentUser?.name}`, marginLeft, yPosition);
    yPosition += 15;

    let data: any[] = [];
    let title = "";

    switch (type) {
      case "piscinas":
        title = "Relatório de Piscinas";
        data = pools;
        break;
      case "obras":
        title = "Relatório de Obras";
        data = works;
        break;
      case "manutencoes":
        title = "Relatório de Manutenções";
        data = maintenance;
        break;
      case "clientes":
        title = "Relatório de Clientes";
        data = clients;
        break;
      case "geral":
        title = "Relatório Geral";
        break;
    }

    pdf.setFontSize(16);
    pdf.text(title, marginLeft, yPosition);
    yPosition += 15;

    if (type === "geral") {
      pdf.setFontSize(12);
      pdf.text(`Total de Piscinas: ${pools.length}`, marginLeft, yPosition);
      yPosition += 7;
      pdf.text(`Total de Obras: ${works.length}`, marginLeft, yPosition);
      yPosition += 7;
      pdf.text(
        `Total de Manutenções: ${maintenance.length}`,
        marginLeft,
        yPosition,
      );
      yPosition += 7;
      pdf.text(`Total de Clientes: ${clients.length}`, marginLeft, yPosition);
      yPosition += 15;
    } else {
      pdf.setFontSize(10);
      pdf.text(`Total de registos: ${data.length}`, marginLeft, yPosition);
      yPosition += 10;

      data.slice(0, 20).forEach((item, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        let text = "";
        switch (type) {
          case "piscinas":
            text = `${index + 1}. ${item.name} - ${item.client} (${item.location})`;
            break;
          case "obras":
            text = `${index + 1}. ${item.title} - ${item.client} - ${item.status}`;
            break;
          case "manutencoes":
            text = `${index + 1}. ${item.poolName} - ${item.technician} - ${new Date(item.scheduledDate).toLocaleDateString()}`;
            break;
          case "clientes":
            text = `${index + 1}. ${item.name} - ${item.email} - ${item.phone}`;
            break;
        }

        pdf.text(text, marginLeft, yPosition);
        yPosition += 7;
      });

      if (data.length > 20) {
        yPosition += 5;
        pdf.text(
          `... e mais ${data.length - 20} registos`,
          marginLeft,
          yPosition,
        );
      }
    }

    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(
        `Página ${i} de ${pageCount} - Gerado em ${new Date().toLocaleString("pt-PT")}`,
        marginLeft,
        pdf.internal.pageSize.height - 10,
      );
    }

    pdf.save(
      `leirisonda-${type}-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const tabs = [
    { id: "configuracoes", name: "Configurações", icon: Settings },
    { id: "utilizadores", name: "Utilizadores", icon: Users },
    { id: "relatorios", name: "Relatórios", icon: BarChart3 },
    { id: "sistema", name: "Sistema", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Administração & Configurações
                </h1>
                <p className="text-gray-600 text-sm">
                  Gestão completa do sistema, utilizadores e relatórios
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Configurações Tab */}
            {activeTab === "configuracoes" && (
              <div className="space-y-6">
                {/* System Information */}
                <div className="bg-gray-50 rounded-lg p-6">
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
                      <span className="font-medium">{currentUser?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Perfil</span>
                      <span className="font-medium capitalize">
                        {currentUser?.role?.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Modo de Dados</span>
                      <span className="font-medium">Armazenamento Local</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Interaction Settings */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Smartphone className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Interação Mobile
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Configure o comportamento de cliques em contactos e moradas
                  </p>

                  <div className="space-y-4">
                    {/* Phone Dialer Setting */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          📞
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-blue-900">
                              Marcação Automática
                            </h4>
                            <button
                              onClick={() =>
                                togglePhoneDialer(!enablePhoneDialer)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                enablePhoneDialer
                                  ? "bg-blue-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  enablePhoneDialer
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-blue-700 text-sm mb-3">
                            Quando ativado, clicar num número de telefone abrirá
                            diretamente o marcador do telefone.
                          </p>
                          <p className="text-blue-600 text-xs">
                            Estado:{" "}
                            {enablePhoneDialer ? "✅ Ativo" : "⭕ Inativo"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Maps Redirect Setting */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          🗺️
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-green-900">
                              Navegação Maps
                            </h4>
                            <button
                              onClick={() =>
                                toggleMapsRedirect(!enableMapsRedirect)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                enableMapsRedirect
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  enableMapsRedirect
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-green-700 text-sm mb-3">
                            Quando ativado, clicar numa morada abrirá o Google
                            Maps para navegação.
                          </p>
                          <p className="text-green-600 text-xs">
                            Estado:{" "}
                            {enableMapsRedirect ? "✅ Ativo" : "⭕ Inativo"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Utilizadores Tab */}
            {activeTab === "utilizadores" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Gestão de Utilizadores
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Criar, editar e gerir utilizadores do sistema
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Novo Utilizador</span>
                  </button>
                </div>

                {/* Add User Form */}
                {showAddForm && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-blue-900">
                        Adicionar Novo Utilizador
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewUser({
                            email: "",
                            name: "",
                            role: "technician",
                            password: "",
                          });
                          setErrors("");
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {errors && (
                      <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        {errors}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="João Silva"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="joao@exemplo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                password: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-2">
                          Função
                        </label>
                        <select
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              role: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="technician">Técnico</option>
                          <option value="manager">Gestor</option>
                          <option value="admin">Administrador</option>
                          {currentUser?.role === "super_admin" && (
                            <option value="super_admin">
                              Super Administrador
                            </option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewUser({
                            email: "",
                            name: "",
                            role: "technician",
                            password: "",
                          });
                          setErrors("");
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddUser}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Criar Utilizador</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Users List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Utilizadores Registados ({authorizedUsers.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {authorizedUsers.map((user, index) => (
                      <div key={user.email} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === "super_admin"
                                  ? "bg-red-100 text-red-800"
                                  : user.role === "super_admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : user.role === "manager"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role === "super_admin"
                                ? "Super Admin"
                                : user.role === "manager"
                                  ? "Gestor"
                                  : "Técnico"}
                            </span>
                            {user.email !== "gongonsilva@gmail.com" && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Eliminar utilizador"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Relatórios Tab */}
            {activeTab === "relatorios" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Relatórios
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Gere relatórios detalhados em PDF
                  </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Waves className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-blue-900">
                          {pools.length}
                        </p>
                        <p className="text-sm text-blue-700">Piscinas</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-900">
                          {works.length}
                        </p>
                        <p className="text-sm text-green-700">Obras</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Wrench className="h-8 w-8 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold text-yellow-900">
                          {maintenance.length}
                        </p>
                        <p className="text-sm text-yellow-700">Manutenções</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-purple-900">
                          {clients.length}
                        </p>
                        <p className="text-sm text-purple-700">Clientes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Generation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      type: "geral",
                      title: "Relatório Geral",
                      icon: BarChart3,
                      color: "blue",
                    },
                    {
                      type: "piscinas",
                      title: "Relatório de Piscinas",
                      icon: Waves,
                      color: "blue",
                    },
                    {
                      type: "obras",
                      title: "Relatório de Obras",
                      icon: Building2,
                      color: "green",
                    },
                    {
                      type: "manutencoes",
                      title: "Relatório de Manutenções",
                      icon: Wrench,
                      color: "yellow",
                    },
                    {
                      type: "clientes",
                      title: "Relatório de Clientes",
                      icon: Users,
                      color: "purple",
                    },
                  ].map((report) => {
                    const Icon = report.icon;
                    return (
                      <div
                        key={report.type}
                        className="bg-white rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div
                            className={`w-10 h-10 bg-${report.color}-100 rounded-lg flex items-center justify-center`}
                          >
                            <Icon
                              className={`h-6 w-6 text-${report.color}-600`}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {report.title}
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={() => generatePDFReport(report.type)}
                          className={`w-full px-4 py-2 bg-${report.color}-600 text-white rounded-lg hover:bg-${report.color}-700 transition-colors flex items-center justify-center space-x-2`}
                        >
                          <Download className="h-4 w-4" />
                          <span>Gerar PDF</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sistema Tab */}
            {activeTab === "sistema" && currentUser?.role === "super_admin" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Gestão de Sistema
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Ferramentas avançadas de administração do sistema
                  </p>
                </div>

                {/* Data Management */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Trash2 className="h-6 w-6 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Gestão de Dados
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Elimine todos os dados de obras, manutenções e piscinas para
                    começar com uma aplicação limpa. Os utilizadores são
                    mantidos.
                  </p>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900 mb-2">
                          Limpar Dados do Sistema
                        </h4>
                        <p className="text-red-700 text-sm mb-3">
                          Esta ação eliminará permanentemente:
                        </p>
                        <ul className="text-red-700 text-sm space-y-1 mb-4">
                          <li>• Todas as obras ({works.length} registos)</li>
                          <li>
                            • Todas as manutenções ({maintenance.length}{" "}
                            registos)
                          </li>
                          <li>• Todas as piscinas ({pools.length} registos)</li>
                          <li>• Dados do Firebase e armazenamento local</li>
                        </ul>
                        <p className="text-red-700 text-sm font-medium mb-3">
                          ⚠️ ATENÇÃO: Esta operação é irreversível!
                        </p>
                        <button
                          onClick={handleDataCleanup}
                          disabled={cleanupLoading}
                          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>
                            {cleanupLoading
                              ? "A Eliminar..."
                              : "Eliminar Todos os Dados"}
                          </span>
                        </button>
                        {cleanupError && (
                          <p className="text-red-600 text-sm mt-2">
                            {cleanupError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAdminPage;
