import React, { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  FileText,
  Download,
  Mail,
  MessageCircle,
  Copy,
  Droplets,
  User,
  MapPin,
  Clock,
  Calendar,
  Thermometer,
  Beaker,
  Settings,
  Camera,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Info,
  Eye,
  Phone,
  Mail as MailIcon,
  Home,
  Waves,
} from "lucide-react";
import { PoolMaintenance, MaintenanceIntervention } from "@shared/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PDFGenerator } from "@/lib/pdf-generator";

interface MaintenanceReportProps {
  maintenance: PoolMaintenance;
  intervention?: MaintenanceIntervention;
  onClose?: () => void;
}

export function MaintenanceReport({
  maintenance,
  intervention,
  onClose,
}: MaintenanceReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Define work labels at component level to be accessible everywhere
  const workLabels = {
    filtros: "Limpeza de Filtros",
    preFiltero: "Pré-filtro",
    filtroAreiaVidro: "Filtro Areia/Vidro",
    enchimentoAutomatico: "Enchimento Automático",
    linhaAgua: "Linha de Água",
    limpezaFundo: "Limpeza do Fundo",
    limpezaParedes: "Limpeza das Paredes",
    limpezaSkimmers: "Limpeza dos Skimmers",
    verificacaoEquipamentos: "Verificação de Equipamentos",
    aspiracao: "Aspiração",
    escovagem: "Escovagem",
    limpezaFiltros: "Limpeza de Filtros",
    tratamentoAlgas: "Tratamento de Algas",
  };

  const getPoolTypeLabel = (type: string) => {
    const labels = {
      outdoor: "Exterior",
      indoor: "Interior",
      spa: "Spa",
      olympic: "Olímpica",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getWaterQualityStatus = (waterValues: any) => {
    const ph = waterValues.ph;
    const chlorine = waterValues.chlorine;
    if (ph >= 7.0 && ph <= 7.4 && chlorine >= 1.0 && chlorine <= 2.0) {
      return {
        label: "Excelente",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    } else if (ph >= 6.8 && ph <= 7.6 && chlorine >= 0.8 && chlorine <= 2.5) {
      return {
        label: "Aceitável",
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Requer Atenção",
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
    };
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  const getProductPurpose = (productName: string) => {
    const purposes: Record<string, string> = {
      cloro: "Desinfeção da água",
      "ph+": "Aumentar pH",
      "ph-": "Diminuir pH",
      algicida: "Prevenç��o de algas",
      floculante: "Clarificação da água",
      cal: "Ajuste de alcalinidade",
      sal: "Eletrólise salina",
      estabilizador: "Proteção do cloro",
      clarificante: "Limpeza da água",
      choque: "Tratamento choque",
    };

    for (const [key, purpose] of Object.entries(purposes)) {
      if (productName.toLowerCase().includes(key)) {
        return purpose;
      }
    }
    return "Tratamento geral";
  };

  const createInterventionContent = () => {
    if (!intervention) return "";

    // Enhanced content with timestamp to force refresh
    const timestamp = new Date().toISOString();

    return `
      <!-- Pool Information - Updated ${timestamp} -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">🏊‍♂️ Informações Completas da Piscina</div>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-card">
              <div class="label">Nome da Piscina</div>
              <div class="value">${maintenance.poolName}</div>
            </div>
            <div class="info-card">
              <div class="label">Cliente</div>
              <div class="value">${maintenance.clientName}</div>
            </div>
            <div class="info-card">
              <div class="label">Contacto Cliente</div>
              <div class="value">${maintenance.clientPhone || "N/A"}</div>
            </div>
            <div class="info-card">
              <div class="label">Email Cliente</div>
              <div class="value">${maintenance.clientEmail || "N/A"}</div>
            </div>
            <div class="info-card">
              <div class="label">Morada Completa</div>
              <div class="value">${maintenance.address}</div>
            </div>
            <div class="info-card">
              <div class="label">Tipo de Piscina</div>
              <div class="value">${getPoolTypeLabel(maintenance.poolType)}</div>
            </div>
            <div class="info-card">
              <div class="label">Volume de Água</div>
              <div class="value">${maintenance.waterCubicage || "N/A"} m³</div>
            </div>
            <div class="info-card">
              <div class="label">Estado da Piscina</div>
              <div class="value">${maintenance.status === "ativa" ? "✅ Ativa" : "❌ Inativa"}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Intervention Details -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">📋 Detalhes Completos da Intervenção</div>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-card">
              <div class="label">Data da Intervenção</div>
              <div class="value">${format(new Date(intervention.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}</div>
            </div>
            <div class="info-card">
              <div class="label">Horário de Trabalho</div>
              <div class="value">${intervention.timeStart} - ${intervention.timeEnd}</div>
            </div>
            <div class="info-card">
              <div class="label">Duração Total</div>
              <div class="value">${calculateDuration(intervention.timeStart, intervention.timeEnd)}</div>
            </div>
            <div class="info-card">
              <div class="label">Técnicos Responsáveis</div>
              <div class="value">${intervention.technicians.join(", ")}</div>
            </div>
            <div class="info-card">
              <div class="label">Número de Técnicos</div>
              <div class="value">${intervention.technicians.length} técnico${intervention.technicians.length > 1 ? "s" : ""}</div>
            </div>
            ${
              intervention.vehicles && intervention.vehicles.length > 0
                ? `
            <div class="info-card">
              <div class="label">Viaturas Utilizadas</div>
              <div class="value">${intervention.vehicles.join(", ")}</div>
            </div>
            <div class="info-card">
              <div class="label">Número de Viaturas</div>
              <div class="value">${intervention.vehicles.length} viatura${intervention.vehicles.length > 1 ? "s" : ""}</div>
            </div>`
                : `
            <div class="info-card">
              <div class="label">Viaturas</div>
              <div class="value">Nenhuma viatura registada</div>
            </div>`
            }
          </div>
        </div>
      </div>

      <!-- Water Analysis -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">🧪 Análise da Água</div>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-card">
              <div class="label">pH</div>
              <div class="value">${intervention.waterValues.ph || "N/A"}</div>
              <div style="font-size: 10px; color: #666;">Ideal: 7.0 - 7.4</div>
            </div>
            <div class="info-card">
              <div class="label">Cloro</div>
              <div class="value">${intervention.waterValues.chlorine || "N/A"} ppm</div>
              <div style="font-size: 10px; color: #666;">Ideal: 1.0 - 2.5 ppm</div>
            </div>
            <div class="info-card">
              <div class="label">ORP</div>
              <div class="value">${intervention.waterValues.orp || "N/A"} mv</div>
              <div style="font-size: 10px; color: #666;">Ideal: 650 - 750 mv</div>
            </div>
            <div class="info-card">
              <div class="label">Temperatura</div>
              <div class="value">${intervention.waterValues.temperature || "N/A"}°C</div>
              <div style="font-size: 10px; color: #666;">Ideal: 24 - 28°C</div>
            </div>
            <div class="info-card">
              <div class="label">Sal</div>
              <div class="value">${intervention.waterValues.salt || "N/A"} gr/lt</div>
              <div style="font-size: 10px; color: #666;">Ideal: 3.0 - 4.0 gr/lt</div>
            </div>
            ${
              intervention.waterValues.alkalinity
                ? `
            <div class="info-card">
              <div class="label">Alcalinidade</div>
              <div class="value">${intervention.waterValues.alkalinity} ppm</div>
              <div style="font-size: 10px; color: #666;">Ideal: 80 - 120 ppm</div>
            </div>`
                : ""
            }
          </div>
        </div>
      </div>

      <!-- Work Performed -->
      ${
        Object.values(intervention.workPerformed).some((v) => v)
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">🔧 Trabalho Realizado</div>
        </div>
        <div class="section-content">
          ${Object.entries(intervention.workPerformed)
            .filter(([key, value]) => value && key !== "outros")
            .map(
              ([key]) =>
                `<div style="margin-bottom: 8px;">✅ ${workLabels[key as keyof typeof workLabels] || key}</div>`,
            )
            .join("")}
          ${intervention.workPerformed.outros ? `<div style="margin-bottom: 8px;">📝 ${intervention.workPerformed.outros}</div>` : ""}
        </div>
      </div>`
          : ""
      }

      <!-- Chemical Products -->
      ${
        intervention.chemicalProducts &&
        intervention.chemicalProducts.length > 0
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">🧴 Produtos Químicos Aplicados</div>
        </div>
        <div class="section-content">
          ${intervention.chemicalProducts
            .map(
              (product) => `
            <div style="margin-bottom: 12px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
              <strong>${product.productName}</strong> - ${product.quantity} ${product.unit}<br>
              <small style="color: #666;">Finalidade: ${getProductPurpose(product.productName)}</small>
              ${product.observations ? `<br><small>Obs: ${product.observations}</small>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- Photos -->
      ${
        intervention.photos && intervention.photos.length > 0
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">📸 Fotos da Intervenção (${intervention.photos.length})</div>
        </div>
        <div class="section-content">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            ${intervention.photos
              .slice(0, 6)
              .map(
                (photo, index) => `
              <img src="${photo}" alt="Foto ${index + 1}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;" crossorigin="anonymous" />
            `,
              )
              .join("")}
          </div>
          ${intervention.photos.length > 6 ? `<p style="margin-top: 10px; font-size: 12px; color: #666;">... e mais ${intervention.photos.length - 6} fotos</p>` : ""}
        </div>
      </div>`
          : ""
      }

      <!-- Observations -->
      ${
        intervention.observations
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">📝 Observações</div>
        </div>
        <div class="section-content">
          <div style="background: #fffbeb; padding: 12px; border-left: 4px solid #f59e0b; border-radius: 4px;">
            ${intervention.observations}
          </div>
        </div>
      </div>`
          : ""
      }

      <!-- Comprehensive Summary -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">📊 Resumo Completo da Intervenção</div>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-card">
              <div class="label">Status da Água</div>
              <div class="value">${getWaterQualityStatus(intervention.waterValues).label}</div>
            </div>
            <div class="info-card">
              <div class="label">Trabalhos Realizados</div>
              <div class="value">${Object.values(intervention.workPerformed).filter((v) => v).length} tarefas</div>
            </div>
            <div class="info-card">
              <div class="label">Produtos Aplicados</div>
              <div class="value">${intervention.chemicalProducts ? intervention.chemicalProducts.length : 0} produtos</div>
            </div>
            <div class="info-card">
              <div class="label">Fotos Registadas</div>
              <div class="value">${intervention.photos ? intervention.photos.length : 0} fotos</div>
            </div>
            <div class="info-card">
              <div class="label">Relatório Gerado</div>
              <div class="value">${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</div>
            </div>
            <div class="info-card">
              <div class="label">Versão do Relatório</div>
              <div class="value">v${format(new Date(), "yyyyMMdd.HHmm", { locale: pt })}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const createMaintenanceContent = () => {
    const sortedInterventions = [...(maintenance.interventions || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const totalInterventions = sortedInterventions.length;
    const last30Days = sortedInterventions.filter(
      (i) => new Date(i.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).length;

    const pendingProblems = sortedInterventions
      .flatMap((i) => i.problems || [])
      .filter((p) => !p.resolved);

    return `
      <!-- Pool Information -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">🏊‍♂️ Informações da Piscina</div>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-card">
              <div class="label">Nome</div>
              <div class="value">${maintenance.poolName}</div>
            </div>
            <div class="info-card">
              <div class="label">Cliente</div>
              <div class="value">${maintenance.clientName}</div>
            </div>
            <div class="info-card">
              <div class="label">Contacto</div>
              <div class="value">${maintenance.clientPhone || "N/A"}</div>
            </div>
            <div class="info-card">
              <div class="label">Email</div>
              <div class="value">${maintenance.clientEmail || "N/A"}</div>
            </div>
            <div class="info-card">
              <div class="label">Morada</div>
              <div class="value">${maintenance.address}</div>
            </div>
            <div class="info-card">
              <div class="label">Tipo</div>
              <div class="value">${getPoolTypeLabel(maintenance.poolType)}</div>
            </div>
            <div class="info-card">
              <div class="label">Volume</div>
              <div class="value">${maintenance.waterCubicage || "N/A"} m³</div>
            </div>
            <div class="info-card">
              <div class="label">Estado</div>
              <div class="value">${maintenance.status === "ativa" ? "Ativa" : "Inativa"}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">📊 Estatísticas</div>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-card">
              <div class="label">Total Intervenções</div>
              <div class="value">${totalInterventions}</div>
            </div>
            <div class="info-card">
              <div class="label">Últimos 30 Dias</div>
              <div class="value">${last30Days}</div>
            </div>
            <div class="info-card">
              <div class="label">Problemas Pendentes</div>
              <div class="value">${pendingProblems.length}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Interventions -->
      ${
        sortedInterventions.length > 0
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">📅 Últimas Intervenções</div>
        </div>
        <div class="section-content">
          ${sortedInterventions
            .slice(0, 5)
            .map(
              (intervention, index) => `
            <div style="margin-bottom: 15px; padding: 12px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #0ea5e9;">
              <strong>${format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })}</strong> - ${intervention.timeStart} às ${intervention.timeEnd}<br>
              <small>Técnicos: ${intervention.technicians.join(", ")}</small><br>
              <small>pH: ${intervention.waterValues.ph || "N/A"} • Cloro: ${intervention.waterValues.chlorine || "N/A"} • ORP: ${intervention.waterValues.orp || "N/A"} • Sal: ${intervention.waterValues.salt || "N/A"}</small>
              ${intervention.observations ? `<br><small><em>Obs: ${intervention.observations}</em></small>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- Pending Problems -->
      ${
        pendingProblems.length > 0
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">⚠️ Problemas Pendentes</div>
        </div>
        <div class="section-content">
          ${pendingProblems
            .map(
              (problem) => `
            <div style="margin-bottom: 10px; padding: 10px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
              ❌ ${problem.description}
              ${problem.priority ? `<br><small>Prioridade: ${problem.priority}</small>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }
    `;
  };

  const generatePDFReport = async (shareMethod?: string) => {
    setIsGenerating(true);

    try {
      // Force fresh content generation with current timestamp
      const currentTimestamp = new Date().toISOString();
      console.log(`📋 Gerando relatório atualizado em: ${currentTimestamp}`);

      const content = intervention
        ? createInterventionContent()
        : createMaintenanceContent();

      const pdfData = {
        title: intervention
          ? `Relatório de Intervenção Atualizado - ${maintenance.poolName}`
          : `Relatório de Manutenção Completo - ${maintenance.poolName}`,
        subtitle: intervention
          ? `Intervenção de ${format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })} • Atualizado: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: pt })}`
          : `Relatório geral da piscina • Atualizado: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: pt })}`,
        date: intervention
          ? format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })
          : new Date().toLocaleDateString("pt-PT"),
        additionalInfo: `Cliente: ${maintenance.clientName} • Tipo: ${getPoolTypeLabel(maintenance.poolType)} • Volume: ${maintenance.waterCubicage || "N/A"} m³ • Versão: ${format(new Date(), "yyyyMMdd-HHmm", { locale: pt })}`,
      };

      const htmlContent = PDFGenerator.createModernReportHTML({
        type: "maintenance",
        title: pdfData.title,
        subtitle: pdfData.subtitle,
        date: pdfData.date,
        content: content,
        additionalInfo: pdfData.additionalInfo,
      });

      const filename = `${intervention ? "intervencao" : "manutencao"}_${maintenance.poolName.replace(/\s+/g, "_")}_${format(new Date(), "yyyyMMdd-HHmmss", { locale: pt })}.pdf`;

      console.log(`📥 Fazendo download: ${filename}`);
      await PDFGenerator.downloadPDF(htmlContent, {
        title: pdfData.title,
        filename: filename,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Erro ao gerar PDF: " +
          (error instanceof Error ? error.message : "Erro desconhecido"),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const renderInterventionPreview = () => {
    if (!intervention) return null;

    const qualityStatus = getWaterQualityStatus(intervention.waterValues);
    const QualityIcon = qualityStatus.icon;

    return (
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Droplets className="h-6 w-6" />
                  {maintenance.poolName}
                </h2>
                <p className="text-blue-100 mt-1">
                  Intervenção de{" "}
                  {format(
                    new Date(intervention.date),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: pt },
                  )}
                </p>
              </div>
              <Badge
                className={`${qualityStatus.color} flex items-center gap-1`}
              >
                <QualityIcon className="h-4 w-4" />
                {qualityStatus.label}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Content cards - simplified for preview */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Resumo da Intervenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Data:</span>{" "}
                {format(new Date(intervention.date), "dd/MM/yyyy", {
                  locale: pt,
                })}
              </div>
              <div>
                <span className="font-medium">Duração:</span>{" "}
                {calculateDuration(
                  intervention.timeStart,
                  intervention.timeEnd,
                )}
              </div>
              <div>
                <span className="font-medium">Técnicos:</span>{" "}
                {intervention.technicians.join(", ")}
              </div>
              <div>
                <span className="font-medium">Estado Água:</span>{" "}
                {qualityStatus.label}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <span className="font-medium">pH:</span>{" "}
                {intervention.waterValues.ph || "N/A"}
              </div>
              <div>
                <span className="font-medium">Cloro:</span>{" "}
                {intervention.waterValues.chlorine || "N/A"} ppm
              </div>
              <div>
                <span className="font-medium">ORP:</span>{" "}
                {intervention.waterValues.orp || "N/A"} mv
              </div>
              <div>
                <span className="font-medium">Sal:</span>{" "}
                {intervention.waterValues.salt || "N/A"} gr/lt
              </div>
              <div>
                <span className="font-medium">Temp:</span>{" "}
                {intervention.waterValues.temperature || "N/A"}°C
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMaintenancePreview = () => {
    const sortedInterventions = [...(maintenance.interventions || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return (
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Waves className="h-6 w-6" />
                  {maintenance.poolName}
                </h2>
                <p className="text-indigo-100 mt-1">
                  Relatório Geral de Manutenção
                </p>
              </div>
              <Badge className="bg-white text-indigo-600">
                <Activity className="h-4 w-4 mr-1" />
                {sortedInterventions.length} Intervenções
              </Badge>
            </div>
          </div>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Resumo Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Cliente:</span>{" "}
                {maintenance.clientName}
              </div>
              <div>
                <span className="font-medium">Tipo:</span>{" "}
                {getPoolTypeLabel(maintenance.poolType)}
              </div>
              <div>
                <span className="font-medium">Volume:</span>{" "}
                {maintenance.waterCubicage || "N/A"} m³
              </div>
              <div>
                <span className="font-medium">Total Intervenções:</span>{" "}
                {sortedInterventions.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 border-0"
        >
          <FileText className="mr-2 h-4 w-4" />
          Relatório PDF Profissional
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Droplets className="mr-2 h-6 w-6 text-blue-600" />
            Relatório de {intervention ? "Intervenção" : "Manutenção"} -{" "}
            {maintenance.poolName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          {intervention
            ? renderInterventionPreview()
            : renderMaintenancePreview()}

          {/* Actions */}
          <div className="flex justify-center">
            <Button
              onClick={() => generatePDFReport("download")}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Download className="mr-2 h-4 w-4" />
              {isGenerating ? "A gerar PDF..." : "Descarregar PDF Completo"}
            </Button>
          </div>

          {isGenerating && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                Gerando PDF com todas as informações...
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
