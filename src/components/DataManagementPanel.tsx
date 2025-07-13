import React, { useState } from "react";
import { useDataSync } from "../hooks/useDataSync";
import { useDataCleanup } from "../hooks/useDataCleanup";
import { useRealtimeSync, useUsers } from "../hooks/useRealtimeSync";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Database,
  Users,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  Eye,
} from "lucide-react";

export function DataManagementPanel() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "cleanup" | "users" | "sync"
  >("overview");

  // Data sync hooks
  const dataSync = useDataSync();
  const realtimeSync = useRealtimeSync();
  const { users, addUser, loading: usersLoading } = useUsers();

  // Cleanup hooks
  const {
    isLoading: cleanupLoading,
    lastResult,
    error: cleanupError,
    cleanupStats,
    cleanAllData,
    initializeCleanApp,
    ensureUserSync,
    refreshStats,
  } = useDataCleanup();

  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "technician" as "super_admin" | "manager" | "technician",
  });

  // Statistics
  const totalPools = dataSync.pools.length;
  const totalWorks = dataSync.works.length;
  const totalMaintenance = dataSync.maintenance.length;
  const totalUsers = users.length;

  const handleAddUser = async () => {
    if (!newUserData.name || !newUserData.email) return;

    const userData = {
      ...newUserData,
      permissions: {
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
      },
      active: true,
    };

    try {
      await addUser(userData);
      setNewUserData({ name: "", email: "", role: "technician" });

      // Ensure synchronization after adding user
      await ensureUserSync();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Utilizadores
                </p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Piscinas</p>
                <p className="text-2xl font-bold">{totalPools}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Obras</p>
                <p className="text-2xl font-bold">{totalWorks}</p>
              </div>
              <Database className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Manutenções</p>
                <p className="text-2xl font-bold">{totalMaintenance}</p>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado da Aplicação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {cleanupStats.isClean ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aplicação Limpa
                </Badge>
              ) : cleanupStats.localStorageEmpty ? (
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200"
                >
                  <Info className="h-3 w-3 mr-1" />
                  Dados Vazios
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Com Dados
                </Badge>
              )}

              {dataSync.lastSync && (
                <span className="text-sm text-gray-600">
                  Última sync: {dataSync.lastSync.toLocaleTimeString("pt-PT")}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setActiveTab("cleanup")}
                variant="outline"
                size="sm"
              >
                Gerir Dados
              </Button>
              <Button
                onClick={() => setActiveTab("users")}
                variant="outline"
                size="sm"
              >
                Gerir Utilizadores
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCleanup = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Limpeza de Dados
          </CardTitle>
          <CardDescription>
            Remover todas as obras, manutenções e piscinas para começar com
            aplicação limpa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cleanupError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{cleanupError}</AlertDescription>
            </Alert>
          )}

          {lastResult?.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {lastResult.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              onClick={cleanAllData}
              disabled={cleanupLoading}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {cleanupLoading ? "A Limpar..." : "Limpar Todos os Dados"}
            </Button>

            <Button
              onClick={initializeCleanApp}
              disabled={cleanupLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Inicialização Completa Limpa
            </Button>

            <Button
              onClick={refreshStats}
              disabled={cleanupLoading}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Aviso:</strong> Esta operação remove permanentemente todos
              os dados de obras, manutenções e piscinas. Os utilizadores são
              mantidos para garantir sincronização adequada.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Add User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Utilizador
          </CardTitle>
          <CardDescription>
            Novos utilizadores são automaticamente sincronizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={newUserData.name}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Função</label>
              <select
                value={newUserData.role}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    role: e.target.value as
                      | "super_admin"
                      | "manager"
                      | "technician",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="technician">Técnico</option>
                <option value="manager">Gestor</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleAddUser}
            disabled={usersLoading || !newUserData.name || !newUserData.email}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {usersLoading ? "A Adicionar..." : "Adicionar Utilizador"}
          </Button>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Utilizadores Existentes ({totalUsers})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="text-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>A carregar utilizadores...</p>
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum utilizador encontrado
            </p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {user.role === "super_admin"
                        ? "Super Admin"
                        : user.role === "manager"
                          ? "Gestor"
                          : "Técnico"}
                    </Badge>
                    {user.active && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Ativo
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSync = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sincronização
          </CardTitle>
          <CardDescription>
            Estado da sincronização com Firebase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={dataSync.syncWithFirebase}
              disabled={dataSync.isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {dataSync.isLoading ? "A Sincronizar..." : "Sincronizar Agora"}
            </Button>

            <Button
              onClick={ensureUserSync}
              disabled={cleanupLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Verificar Sync Utilizadores
            </Button>
          </div>

          {dataSync.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{dataSync.error}</AlertDescription>
            </Alert>
          )}

          {realtimeSync.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{realtimeSync.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: Database },
    { id: "cleanup", label: "Limpeza", icon: Trash2 },
    { id: "users", label: "Utilizadores", icon: Users },
    { id: "sync", label: "Sincronização", icon: RefreshCw },
  ] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestão de Dados Leirisonda</h1>
        <p className="text-gray-600 mt-1">
          Gestão de dados, utilizadores e sincronização da aplicação
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "cleanup" && renderCleanup()}
      {activeTab === "users" && renderUsers()}
      {activeTab === "sync" && renderSync()}
    </div>
  );
}

export default DataManagementPanel;
