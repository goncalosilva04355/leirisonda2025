import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Phone,
  User,
  Car,
  Camera,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Work } from "@shared/types";
import { Button } from "@/components/ui/button";
import { WorkReport } from "@/components/WorkReport";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { useAuth } from "@/components/AuthProvider";

export function WorkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { works, deleteWork } = useFirebaseSync();
  const { user } = useAuth();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWork();
  }, [id, works]);

  const loadWork = () => {
    if (!id) return;

    // Use dados do Firebase sync em primeiro lugar
    const foundWork = works.find((w) => w.id === id);
    if (foundWork) {
      setWork(foundWork);
    } else {
      // Fallback para localStorage se não encontrar no Firebase
      const storedWorks = localStorage.getItem("leirisonda_works");
      if (storedWorks) {
        const localWorks: Work[] = JSON.parse(storedWorks);
        const localWork = localWorks.find((w) => w.id === id);
        setWork(localWork || null);
      } else {
        setWork(null);
      }
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!work) {
      console.error("❌ Erro: Obra não encontrada para eliminação");
      alert("Erro: Obra não encontrada");
      return;
    }

    try {
      console.log(
        `🗑️ INICIANDO ELIMINAÇÃO da obra: ${work.id} (${work.clientName})`,
      );

      // Verificar se o utilizador tem permissões
      if (!user?.permissions.canDeleteWorks) {
        console.error("❌ Erro: Utilizador sem permissão para eliminar obras");
        alert("Erro: Não tem permissão para eliminar obras");
        return;
      }

      // Verificar se a obra existe nos dados locais
      const storedWorks = localStorage.getItem("works");
      let localWorks: Work[] = [];
      if (storedWorks) {
        localWorks = JSON.parse(storedWorks);
      }

      const workExists = localWorks.find((w) => w.id === work.id);
      console.log(`📋 Obra existe localmente: ${workExists ? "SIM" : "NÃO"}`);

      // Backup da obra antes de eliminar
      const workBackup = { ...work };
      console.log(`💾 Backup da obra criado: ${workBackup.workSheetNumber}`);

      // Eliminar usando Firebase sync
      console.log("🔥 Chamando deleteWork via Firebase sync...");
      await deleteWork(work.id);

      console.log("✅ Obra eliminada com sucesso via Firebase sync");

      // Verificar se foi realmente eliminada localmente
      const updatedWorks = localStorage.getItem("works");
      if (updatedWorks) {
        const updatedWorksList: Work[] = JSON.parse(updatedWorks);
        const stillExists = updatedWorksList.find((w) => w.id === work.id);
        console.log(
          `🔍 Verificação pós-eliminação: obra ainda existe = ${stillExists ? "SIM" : "NÃO"}`,
        );

        if (stillExists) {
          console.warn("⚠️ ATENÇÃO: Obra ainda existe após eliminação!");
          // Forçar eliminação local se necessário
          const filteredWorks = updatedWorksList.filter(
            (w) => w.id !== work.id,
          );
          localStorage.setItem("works", JSON.stringify(filteredWorks));
          console.log("🔧 Eliminação forçada localmente aplicada");
        }
      }

      console.log("🎉 OBRA ELIMINADA COM SUCESSO - Redirecionando...");

      // Mostrar mensagem de sucesso
      alert(`Obra "${work.clientName}" eliminada com sucesso!`);

      // Navegar de volta à lista
      navigate("/works");
    } catch (error) {
      console.error("❌ ERRO CRÍTICO ao eliminar obra:", error);
      console.error("📄 Detalhes do erro:", {
        message: error instanceof Error ? error.message : "Erro desconhecido",
        workId: work.id,
        workName: work.clientName,
        userPermissions: user?.permissions,
      });

      // Mostrar erro amigável ao utilizador
      alert(
        `Erro ao eliminar obra: ${error instanceof Error ? error.message : "Erro desconhecido"}. Tente novamente.`,
      );
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pendente":
        return {
          label: "Pendente",
          color: "text-red-600",
          bg: "bg-red-100",
          icon: AlertTriangle,
        };
      case "em_progresso":
        return {
          label: "Em Progresso",
          color: "text-orange-600",
          bg: "bg-orange-100",
          icon: Clock,
        };
      case "concluida":
        return {
          label: "Concluída",
          color: "text-green-600",
          bg: "bg-green-100",
          icon: CheckCircle,
        };
      default:
        return {
          label: status,
          color: "text-gray-600",
          bg: "bg-gray-100",
          icon: AlertTriangle,
        };
    }
  };

  const getWorkTypeLabel = (type: string) => {
    switch (type) {
      case "piscina":
        return "Piscina";
      case "manutencao":
        return "Manutenção";
      case "avaria":
        return "Avaria";
      case "montagem":
        return "Montagem";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Obra não encontrada
        </h3>
        <p className="text-gray-600 mb-4">
          A obra que procura pode ter sido removida ou não existe.
        </p>
        <Button asChild>
          <Link to="/works">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Lista
          </Link>
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(work.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/works">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {work.clientName}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-gray-600">
              {work.workSheetNumber} • {getWorkTypeLabel(work.type)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <WorkReport work={work} />

          <Link to={`/edit-work/${work.id}`}>
            <Button className="btn-primary">
              <Edit className="mr-2 h-4 w-4" />
              Editar Obra
            </Button>
          </Link>
          {user?.permissions.canDeleteWorks && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem a certeza que deseja apagar esta obra? Esta ação não
                    pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Apagar Obra
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Work Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="font-medium text-gray-900">
                      {work.clientName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Contacto</p>
                    <p className="font-medium text-gray-900">{work.contact}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Morada</p>
                    <p className="font-medium text-gray-900">{work.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Folha de Obra</p>
                    <p className="font-medium text-gray-900">
                      {work.workSheetNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalhes da Obra
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Hora de Entrada</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(work.entryTime), "dd/MM/yyyy HH:mm", {
                        locale: pt,
                      })}
                    </p>
                  </div>
                </div>
                {work.exitTime && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Hora de Saída</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(work.exitTime), "dd/MM/yyyy HH:mm", {
                          locale: pt,
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Viaturas Utilizadas</p>
                    <p className="font-medium text-gray-900">
                      {work.vehicles.length > 0
                        ? work.vehicles.join(", ")
                        : "Não especificadas"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Técnicos</p>
                    <p className="font-medium text-gray-900">
                      {work.technicians.length > 0
                        ? work.technicians.join(", ")
                        : "Não atribuídos"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {work.observations && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                <p className="text-gray-700">{work.observations}</p>
              </div>
            )}

            {work.workPerformed && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Trabalho Realizado
                </h4>
                <p className="text-gray-700">{work.workPerformed}</p>
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Fotografias ({work.photos.length})
              </h3>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/edit-work/${work.id}`}>
                  <Camera className="w-4 h-4 mr-2" />
                  Adicionar Fotos
                </Link>
              </Button>
            </div>

            {work.photos.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">
                  Ainda não foram adicionadas fotografias
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/edit-work/${work.id}`}>
                    Adicionar Primeira Foto
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {work.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.url}
                      alt={`Fotografia ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to={`/edit-work/${work.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Obra
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to={`/edit-work/${work.id}`}>
                  <Camera className="w-4 h-4 mr-2" />
                  Gerir Fotografias
                </Link>
              </Button>
            </div>
          </div>

          {/* Work Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cronologia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Obra criada</p>
                  <p className="text-gray-600">
                    {format(new Date(work.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: pt,
                    })}
                  </p>
                </div>
              </div>
              {work.updatedAt !== work.createdAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      Última atualização
                    </p>
                    <p className="text-gray-600">
                      {format(new Date(work.updatedAt), "dd/MM/yyyy HH:mm", {
                        locale: pt,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
