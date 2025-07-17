// COMPONENTE ATUALIZADO PARA REST API - SEM SDK FIREBASE
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Users,
  Briefcase,
  Waves,
  Settings,
  Download,
  Upload,
  Database,
  Smartphone,
} from "lucide-react";
import { useUniversalDataSyncFixed } from "../hooks/useUniversalDataSyncFixed";

export const SharedDataManager: React.FC = () => {
  const dataSync = useUniversalDataSyncFixed();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    obras: dataSync.obras.length,
    manutencoes: dataSync.manutencoes.length,
    piscinas: dataSync.piscinas.length,
    clientes: dataSync.clientes.length,
    total: dataSync.totalItems,
  };

  const exportData = () => {
    const data = {
      obras: dataSync.obras,
      manutencoes: dataSync.manutencoes,
      piscinas: dataSync.piscinas,
      clientes: dataSync.clientes,
      exported: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leirisonda-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Import data back to the system
        if (data.obras) dataSync.setObras(data.obras);
        if (data.manutencoes) dataSync.setManutencoes(data.manutencoes);
        if (data.piscinas) dataSync.setPiscinas(data.piscinas);
        if (data.clientes) dataSync.setClientes(data.clientes);

        console.log("✅ Dados importados com sucesso");
      } catch (error) {
        console.error("❌ Erro ao importar dados:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Gestor de Dados Partilhados
          </CardTitle>
          <CardDescription>
            Gestão centralizada de todos os dados da aplicação usando REST API
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sync">Sincronização</TabsTrigger>
          <TabsTrigger value="export">Importar/Exportar</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Obras</p>
                    <p className="text-2xl font-bold">{stats.obras}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Piscinas
                    </p>
                    <p className="text-2xl font-bold">{stats.piscinas}</p>
                  </div>
                  <Waves className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Manutenções
                    </p>
                    <p className="text-2xl font-bold">{stats.manutencoes}</p>
                  </div>
                  <Settings className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Clientes
                    </p>
                    <p className="text-2xl font-bold">{stats.clientes}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estado dos Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total de registos:</span>
                  <Badge variant="outline">{stats.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Última sincronização:</span>
                  <Badge variant="outline">
                    {dataSync.lastSync
                      ? new Date(dataSync.lastSync).toLocaleString("pt-PT")
                      : "Nunca"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Estado:</span>
                  <Badge variant={dataSync.isLoading ? "secondary" : "default"}>
                    {dataSync.isLoading ? "Sincronizando..." : "Pronto"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sincronização com REST API</CardTitle>
              <CardDescription>
                Estado da sincronização com Firestore via REST API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={dataSync.forceSyncAll}
                  disabled={dataSync.isLoading}
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  {dataSync.isLoading
                    ? "Sincronizando..."
                    : "Sincronizar Agora"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Recarregar Dados
                </Button>
              </div>

              {dataSync.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{dataSync.error}</p>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p>✅ Sistema usando REST API direta</p>
                <p>🌐 Conectividade: Firestore REST API</p>
                <p>💾 Backup local: localStorage</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar/Exportar Dados</CardTitle>
              <CardDescription>
                Backup e restauro de dados em formato JSON
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={exportData}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar Dados
                </Button>

                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    style={{ display: "none" }}
                    id="file-import"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-import")?.click()
                    }
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Importar Dados
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  💡 O export inclui todos os dados: obras, piscinas,
                  manutenções e clientes
                </p>
                <p>📄 Formato: JSON compatível com importação</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-6 w-6" />
                Otimização Mobile
              </CardTitle>
              <CardDescription>
                Funcionalidades específicas para dispositivos móveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">💾 Armazenamento Local</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Dados salvos localmente</li>
                    <li>Funciona offline</li>
                    <li>Sincronização automática</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🌐 Conectividade</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>REST API otimizada</li>
                    <li>Sem dependência do SDK</li>
                    <li>Backup automático na nuvem</li>
                  </ul>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>📱 Interface otimizada para mobile</p>
                <p>⚡ Performance melhorada sem SDK</p>
                <p>🔄 Sincronização eficiente</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SharedDataManager;
