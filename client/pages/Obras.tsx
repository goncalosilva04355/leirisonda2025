import { useState } from "react";
import { Plus, Search, Filter, MapPin, Calendar, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const obras = [
  {
    id: 1,
    title: "Piscina Residencial Premium",
    client: "João Silva",
    location: "Leiria",
    status: "Em Progresso",
    priority: "Alta",
    startDate: "2024-01-10",
    endDate: "2024-02-15",
    progress: 65,
    budget: 25000,
    spent: 16250,
  },
  {
    id: 2,
    title: "Sistema de Filtração Hotel",
    client: "Hotel do Mar Lda",
    location: "Marinha Grande",
    status: "Pendente",
    priority: "Média",
    startDate: "2024-01-20",
    endDate: "2024-02-28",
    progress: 0,
    budget: 45000,
    spent: 0,
  },
  {
    id: 3,
    title: "Manutenção Piscina Municipal",
    client: "Câmara Municipal",
    location: "Leiria",
    status: "Concluída",
    priority: "Baixa",
    startDate: "2023-12-01",
    endDate: "2024-01-05",
    progress: 100,
    budget: 8500,
    spent: 8200,
  },
];

export default function Obras() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");

  const filteredObras = obras.filter((obra) => {
    const matchesSearch =
      obra.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Todas" || obra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "default";
      case "Em Progresso":
        return "secondary";
      case "Pendente":
        return "outline";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "text-red-600 bg-red-50";
      case "Média":
        return "text-yellow-600 bg-yellow-50";
      case "Baixa":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Obras</h1>
          <p className="text-gray-600 mt-1">
            Gestão de todas as obras em curso
          </p>
        </div>
        <Button className="bg-leirisonda-primary hover:bg-leirisonda-header-blue">
          <Plus className="h-4 w-4 mr-2" />
          Nova Obra
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar obras ou clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-leirisonda-primary"
              >
                <option value="Todas">Todas</option>
                <option value="Em Progresso">Em Progresso</option>
                <option value="Pendente">Pendente</option>
                <option value="Concluída">Concluída</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Obras List */}
      <div className="grid gap-6">
        {filteredObras.map((obra) => (
          <Card key={obra.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2">{obra.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{obra.client}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{obra.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {obra.startDate} - {obra.endDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(obra.status)}>
                    {obra.status}
                  </Badge>
                  <Badge className={getPriorityColor(obra.priority)}>
                    {obra.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm text-gray-600">
                      {obra.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-leirisonda-primary h-2 rounded-full transition-all"
                      style={{ width: `${obra.progress}%` }}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Orçamento</span>
                    <span className="text-sm text-gray-600">
                      €{obra.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(obra.spent / obra.budget) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Gasto: €{obra.spent.toLocaleString()} (
                    {Math.round((obra.spent / obra.budget) * 100)}%)
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredObras.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma obra encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou criar uma nova obra.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
