import {
  Building2,
  Users,
  UserCheck,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const stats = [
  {
    title: "Obras Ativas",
    value: "12",
    change: "+2",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Clientes",
    value: "45",
    change: "+5",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Funcionários",
    value: "8",
    change: "0",
    icon: UserCheck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Receita Mensal",
    value: "€25.4k",
    change: "+12%",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const recentWorks = [
  {
    id: 1,
    title: "Piscina Residencial - Vila Nova",
    client: "João Silva",
    status: "Em Progresso",
    priority: "Alta",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "Manutenção Sistema - Hotel Mar",
    client: "Hotel do Mar Lda",
    status: "Pendente",
    priority: "Média",
    date: "2024-01-18",
  },
  {
    id: 3,
    title: "Instalação Bomba - Condomínio",
    client: "Condomínio Vista Verde",
    status: "Concluída",
    priority: "Baixa",
    date: "2024-01-10",
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Inspeção de rotina - Piscina Municipal",
    date: "Hoje, 14:00",
    worker: "Carlos Santos",
  },
  {
    id: 2,
    title: "Instalação de equipamento - Resort",
    date: "Amanhã, 09:00",
    worker: "Ana Costa",
  },
  {
    id: 3,
    title: "Manutenção preventiva - Hotel",
    date: "20 Jan, 10:30",
    worker: "Miguel Ferreira",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral do sistema Leirisonda
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Última atualização</p>
          <p className="text-sm font-medium">Hoje, 10:30</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Obras Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorks.map((work) => (
                <div
                  key={work.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{work.title}</h4>
                    <p className="text-sm text-gray-600">{work.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{work.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant={
                        work.status === "Concluída"
                          ? "default"
                          : work.status === "Em Progresso"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {work.status}
                    </Badge>
                    <p className="text-xs text-gray-500">{work.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Próximas Tarefas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.date}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Responsável: {task.worker}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-leirisonda-primary hover:bg-leirisonda-blue-light transition-colors">
              <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Nova Obra</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-leirisonda-primary hover:bg-leirisonda-blue-light transition-colors">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Adicionar Cliente
              </p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-leirisonda-primary hover:bg-leirisonda-blue-light transition-colors">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Agendar Visita
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
