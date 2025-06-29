import React, { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  FileText,
  Share,
  Download,
  Mail,
  MessageCircle,
  Copy,
  Printer,
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
  BarChart3,
  Users,
  Activity,
  Zap,
  Shield,
  Target,
  Award,
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
      algicida: "Prevenção de algas",
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

  // Get water quality analysis with details
  const getWaterAnalysis = (waterValues: any) => {
    const ph = waterValues.ph;
    const chlorine = waterValues.chlorine;
    const temperature = waterValues.temperature;
    const alkalinity = waterValues.alkalinity;
    const salt = waterValues.salt;

    return {
      ph: {
        value: ph || "N/A",
        ideal: "7.0 - 7.4",
        status:
          ph >= 7.0 && ph <= 7.4
            ? "excellent"
            : ph >= 6.8 && ph <= 7.6
              ? "acceptable"
              : "poor",
        advice:
          ph < 7.0 ? "Adicionar pH+" : ph > 7.4 ? "Adicionar pH-" : "Perfeito",
      },
      chlorine: {
        value: chlorine ? `${chlorine} ppm` : "N/A",
        ideal: "1.0 - 2.5 ppm",
        status:
          chlorine >= 1.0 && chlorine <= 2.5
            ? "excellent"
            : chlorine >= 0.8 && chlorine <= 3.0
              ? "acceptable"
              : "poor",
        advice:
          chlorine < 1.0
            ? "Adicionar cloro"
            : chlorine > 2.5
              ? "Reduzir cloro"
              : "Perfeito",
      },
      orp: {
        value: waterValues.orp ? `${waterValues.orp} mv` : "N/A",
        ideal: "650 - 750 mv",
        status:
          waterValues.orp >= 650 && waterValues.orp <= 750
            ? "excellent"
            : waterValues.orp >= 600 && waterValues.orp <= 800
              ? "acceptable"
              : "poor",
        advice:
          waterValues.orp < 650
            ? "Aumentar ORP"
            : waterValues.orp > 750
              ? "Reduzir ORP"
              : "Perfeito",
      },
      temperature: {
        value: temperature ? `${temperature}°C` : "N/A",
        ideal: "24 - 28°C",
        status:
          temperature >= 24 && temperature <= 28 ? "excellent" : "informative",
        advice: "Temperatura informativa",
      },
      alkalinity: {
        value: alkalinity ? `${alkalinity} ppm` : "N/A",
        ideal: "80 - 120 ppm",
        status:
          alkalinity >= 80 && alkalinity <= 120 ? "excellent" : "acceptable",
        advice:
          alkalinity < 80
            ? "Aumentar alcalinidade"
            : alkalinity > 120
              ? "Reduzir alcalinidade"
              : "Perfeito",
      },
      salt: {
        value: salt ? `${salt} gr/lt` : "N/A",
        ideal: "3.0 - 4.0 gr/lt",
        status: salt >= 3.0 && salt <= 4.0 ? "excellent" : "acceptable",
        advice:
          salt < 3.0
            ? "Adicionar sal"
            : salt > 4.0
              ? "Reduzir sal"
              : "Perfeito",
      },
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "acceptable":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "poor":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-50 border-green-200";
      case "acceptable":
        return "bg-yellow-50 border-yellow-200";
      case "poor":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  // Helper function to process and include photos in PDF
  const createPhotoGallery = (photos: string[], title: string) => {
    if (!photos || photos.length === 0) return "";

    const photosHTML = photos
      .map(
        (photo, index) => `
        <div class="photo-item">
          <img src="${photo}" alt="${title} ${index + 1}" class="photo-img" crossorigin="anonymous" />
          <div class="photo-caption">${title} ${index + 1}</div>
        </div>
      `,
      )
      .join("");

    return `
      <div class="pdf-section">
        <div class="pdf-section-header">
          <div class="pdf-section-title">📸 ${title}</div>
        </div>
        <div class="pdf-section-content">
          <div class="pdf-photo-gallery">
            ${photosHTML}
          </div>
        </div>
      </div>
    `;
  };

  const createInterventionContent = () => {
    if (!intervention) return "";

    const waterAnalysis = getWaterAnalysis(intervention.waterValues);
    const qualityStatus = getWaterQualityStatus(intervention.waterValues);

    return `
      <!-- Modern Header -->
      <div class="pdf-header-modern">
        <div class="pdf-header-left">
          <h1 class="pdf-main-title">Relatório de Intervenção</h1>
          <h2 class="pdf-subtitle">${maintenance.poolName}</h2>
          <div class="pdf-date">📅 ${format(new Date(intervention.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}</div>
        </div>
        <div class="pdf-header-right">
          <div class="pdf-ref-number">REF: ${format(new Date(intervention.date), "yyyyMMdd", { locale: pt })}-${maintenance.poolName.replace(/\s+/g, "").substring(0, 3).toUpperCase()}</div>
          <div class="pdf-status-badge ${qualityStatus.color.replace(/text-/, "color-").replace(/bg-/, "bg-")}">${qualityStatus.label}</div>
        </div>
      </div>

      <!-- Pool Information Card -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">🏊‍♂️ Informações da Piscina</div>
        </div>
        <div class="section-content">
          <div class="pdf-info-grid">
            <div class="pdf-info-item">
              <span class="pdf-info-label">Nome:</span>
              <span class="pdf-info-value">${maintenance.poolName}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Cliente:</span>
              <span class="pdf-info-value">${maintenance.clientName}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Morada:</span>
              <span class="pdf-info-value">${maintenance.address}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Tipo:</span>
              <span class="pdf-info-value">${getPoolTypeLabel(maintenance.poolType)}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Volume:</span>
              <span class="pdf-info-value">${maintenance.waterCubicage || "N/A"} m³</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Estado:</span>
              <span class="pdf-info-value pdf-status-active">${maintenance.status === "ativa" ? "Ativa" : "Inativa"}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Intervention Details Card -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">📋 Detalhes da Intervenção</div>
        </div>
        <div class="section-content">
          <div class="pdf-info-grid">
            <div class="pdf-info-item">
              <span class="pdf-info-label">Data:</span>
              <span class="pdf-info-value">${format(new Date(intervention.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Horário:</span>
              <span class="pdf-info-value">${intervention.timeStart} - ${intervention.timeEnd}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Duração:</span>
              <span class="pdf-info-value pdf-duration">${calculateDuration(intervention.timeStart, intervention.timeEnd)}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Técnicos:</span>
              <span class="pdf-info-value">${intervention.technicians.join(", ")}</span>
            </div>
            ${
              intervention.vehicles && intervention.vehicles.length > 0
                ? `
            <div class="pdf-info-item">
              <span class="pdf-info-label">Viaturas:</span>
              <span class="pdf-info-value">${intervention.vehicles.join(", ")}</span>
            </div>`
                : ""
            }
          </div>
        </div>
      </div>

      <!-- Water Analysis Card -->
      <div class="pdf-card pdf-card-analysis">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">🧪 Análise Completa da Água</h3>
          <div class="pdf-overall-status ${qualityStatus.color.replace(/text-/, "color-").replace(/bg-/, "bg-")}">${qualityStatus.label}</div>
        </div>
        <div class="pdf-card-content">
          <div class="pdf-water-grid">
            ${Object.entries(waterAnalysis)
              .map(
                ([key, data]) => `
              <div class="pdf-water-item ${getStatusColor(data.status)
                .replace(/bg-/, "pdf-bg-")
                .replace(/border-/, "pdf-border-")}">
                <div class="pdf-water-header">
                  <span class="pdf-water-param">${key.toUpperCase()}</span>
                  ${getStatusIcon(data.status)
                    .type.render()
                    .replace(
                      /class="[^"]*"/,
                      `class="pdf-status-icon pdf-status-${data.status}"`,
                    )}
                </div>
                <div class="pdf-water-value">${data.value}</div>
                <div class="pdf-water-ideal">Ideal: ${data.ideal}</div>
                <div class="pdf-water-advice">${data.advice}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Work Performed Card -->
      ${
        Object.values(intervention.workPerformed).some((v) => v)
          ? `
      <div class="pdf-card pdf-card-work">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">🔧 Trabalho Realizado</h3>
        </div>
        <div class="pdf-card-content">
          <div class="pdf-work-categories">
            ${
              ["filtros", "preFiltero", "filtroAreiaVidro"].some(
                (key) =>
                  intervention.workPerformed[
                    key as keyof typeof intervention.workPerformed
                  ],
              )
                ? `
            <div class="pdf-work-category">
              <h4 class="pdf-category-title">💧 Sistema de Filtração</h4>
              <div class="pdf-work-items">
                ${Object.entries(intervention.workPerformed)
                  .filter(
                    ([key, value]) =>
                      value &&
                      ["filtros", "preFiltero", "filtroAreiaVidro"].includes(
                        key,
                      ),
                  )
                  .map(
                    ([key]) => `
                    <div class="pdf-work-item pdf-work-completed">
                      <span class="pdf-work-check">✅</span>
                      <span class="pdf-work-text">${workLabels[key as keyof typeof workLabels] || key}</span>
                    </div>
                  `,
                  )
                  .join("")}
              </div>
            </div>`
                : ""
            }

            ${
              [
                "enchimentoAutomatico",
                "linhaAgua",
                "limpezaFundo",
                "limpezaParedes",
                "limpezaSkimmers",
                "verificacaoEquipamentos",
                "aspiracao",
                "escovagem",
                "limpezaFiltros",
                "tratamentoAlgas",
              ].some(
                (key) =>
                  intervention.workPerformed[
                    key as keyof typeof intervention.workPerformed
                  ],
              )
                ? `
            <div class="pdf-work-category">
              <h4 class="pdf-category-title">🏊‍♂️ Sistemas da Piscina</h4>
              <div class="pdf-work-items">
                ${Object.entries(intervention.workPerformed)
                  .filter(
                    ([key, value]) =>
                      value &&
                      [
                        "enchimentoAutomatico",
                        "linhaAgua",
                        "limpezaFundo",
                        "limpezaParedes",
                        "limpezaSkimmers",
                        "verificacaoEquipamentos",
                        "aspiracao",
                        "escovagem",
                        "limpezaFiltros",
                        "tratamentoAlgas",
                      ].includes(key),
                  )
                  .map(
                    ([key]) => `
                    <div class="pdf-work-item pdf-work-completed">
                      <span class="pdf-work-check">✅</span>
                      <span class="pdf-work-text">${workLabels[key as keyof typeof workLabels] || key}</span>
                    </div>
                  `,
                  )
                  .join("")}
              </div>
            </div>`
                : ""
            }

            ${
              intervention.workPerformed.outros
                ? `
            <div class="pdf-work-category">
              <h4 class="pdf-category-title">📋 Trabalho Adicional</h4>
              <div class="pdf-work-items">
                <div class="pdf-work-item pdf-work-additional">
                  <span class="pdf-work-check">📝</span>
                  <span class="pdf-work-text">${intervention.workPerformed.outros}</span>
                </div>
              </div>
            </div>`
                : ""
            }
          </div>
        </div>
      </div>`
          : ""
      }

      <!-- Chemical Products Card -->
      ${
        intervention.chemicalProducts &&
        intervention.chemicalProducts.length > 0
          ? `
      <div class="pdf-card pdf-card-chemicals">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">🧴 Produtos Químicos Aplicados</h3>
          <div class="pdf-product-count">${intervention.chemicalProducts.length} produto${intervention.chemicalProducts.length !== 1 ? "s" : ""}</div>
        </div>
        <div class="pdf-card-content">
          <div class="pdf-chemicals-grid">
            ${intervention.chemicalProducts
              .map(
                (product) => `
              <div class="pdf-chemical-item">
                <div class="pdf-chemical-header">
                  <span class="pdf-chemical-name">${product.productName}</span>
                  <span class="pdf-chemical-quantity">${product.quantity} ${product.unit}</span>
                </div>
                <div class="pdf-chemical-purpose">${getProductPurpose(product.productName)}</div>
                ${product.observations ? `<div class="pdf-chemical-notes">${product.observations}</div>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>`
          : ""
      }

      <!-- Pool Photos Section -->
      ${maintenance.photos && maintenance.photos.length > 0 ? createPhotoGallery(maintenance.photos, "Fotos da Piscina") : ""}

      <!-- Intervention Photos Section -->
      ${intervention.photos && intervention.photos.length > 0 ? createPhotoGallery(intervention.photos, "Fotos da Intervenção") : ""}

      <!-- Problems Section -->
      ${
        intervention.problems && intervention.problems.length > 0
          ? `
      <div class="pdf-card pdf-card-problems">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">⚠️ Problemas Identificados</h3>
        </div>
        <div class="pdf-card-content">
          ${intervention.problems
            .map(
              (problem) => `
            <div class="pdf-problem-item ${problem.resolved ? "pdf-problem-resolved" : "pdf-problem-pending"}">
              <div class="pdf-problem-status">${problem.resolved ? "✅ Resolvido" : "❌ Pendente"}</div>
              <div class="pdf-problem-description">${problem.description}</div>
              ${problem.priority ? `<div class="pdf-problem-priority">Prioridade: ${problem.priority}</div>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- Observations Card -->
      ${
        intervention.observations
          ? `
      <div class="pdf-card pdf-card-observations">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">📝 Observações do Técnico</h3>
        </div>
        <div class="pdf-card-content">
          <div class="pdf-observations-content">${intervention.observations}</div>
        </div>
      </div>`
          : ""
      }

      <!-- Summary Card -->
      <div class="pdf-card pdf-card-summary">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">📊 Resumo da Intervenção</h3>
        </div>
        <div class="pdf-card-content">
          <div class="pdf-summary-grid">
            <div class="pdf-summary-item">
              <div class="pdf-summary-icon">💧</div>
              <div class="pdf-summary-details">
                <div class="pdf-summary-label">Estado da Água</div>
                <div class="pdf-summary-value ${qualityStatus.color.replace(/text-/, "color-").replace(/bg-/, "bg-")}">${qualityStatus.label}</div>
              </div>
            </div>
            <div class="pdf-summary-item">
              <div class="pdf-summary-icon">🧴</div>
              <div class="pdf-summary-details">
                <div class="pdf-summary-label">Produtos Aplicados</div>
                <div class="pdf-summary-value">${intervention.chemicalProducts ? intervention.chemicalProducts.length : 0}</div>
              </div>
            </div>
            <div class="pdf-summary-item">
              <div class="pdf-summary-icon">🔧</div>
              <div class="pdf-summary-details">
                <div class="pdf-summary-label">Trabalhos Realizados</div>
                <div class="pdf-summary-value">${Object.values(intervention.workPerformed).filter((v) => v).length}</div>
              </div>
            </div>
            <div class="pdf-summary-item">
              <div class="pdf-summary-icon">📅</div>
              <div class="pdf-summary-details">
                <div class="pdf-summary-label">Próxima Visita</div>
                <div class="pdf-summary-value">${intervention.nextVisit ? format(new Date(intervention.nextVisit), "dd/MM/yyyy", { locale: pt }) : "A definir"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const createMaintenanceContent = () => {
    const currentDate = new Date().toLocaleDateString("pt-PT");

    // Sort interventions by date (most recent first)
    const sortedInterventions = [...(maintenance.interventions || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Calculate statistics
    const totalInterventions = sortedInterventions.length;
    const last30Days = sortedInterventions.filter(
      (i) => new Date(i.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).length;

    const pendingProblems = sortedInterventions
      .flatMap((i) => i.problems || [])
      .filter((p) => !p.resolved);

    // Most active technicians
    const technicianFrequency: Record<string, number> = {};
    sortedInterventions.forEach((i) => {
      i.technicians.forEach((tech) => {
        technicianFrequency[tech] = (technicianFrequency[tech] || 0) + 1;
      });
    });
    const mostActiveTechnician = Object.entries(technicianFrequency).sort(
      ([, a], [, b]) => b - a,
    )[0];

    // Chemical products analysis
    const allProducts = sortedInterventions.flatMap(
      (i) => i.chemicalProducts || [],
    );
    const productFrequency: Record<string, number> = {};
    allProducts.forEach((p) => {
      productFrequency[p.productName] =
        (productFrequency[p.productName] || 0) + 1;
    });
    const mostUsedProduct = Object.entries(productFrequency).sort(
      ([, a], [, b]) => b - a,
    )[0];

    // Water quality trend (last 5 interventions with pH and chlorine data)
    const waterQualityTrend = sortedInterventions
      .filter((i) => i.waterValues.ph > 0 && i.waterValues.chlorine > 0)
      .slice(0, 5);

    return `
      <!-- Modern Header for Maintenance Report -->
      <div class="pdf-header-modern">
        <div class="pdf-header-left">
          <h1 class="pdf-main-title">Relatório de Manutenção</h1>
          <h2 class="pdf-subtitle">${maintenance.poolName}</h2>
          <div class="pdf-date">📅 Relatório geral da piscina</div>
        </div>
        <div class="pdf-header-right">
          <div class="pdf-ref-number">REF: MANUT-${format(new Date(), "yyyyMMdd", { locale: pt })}-${maintenance.poolName.replace(/\s+/g, "").substring(0, 3).toUpperCase()}</div>
          <div class="pdf-status-badge bg-blue-100 color-blue-800">${totalInterventions} Intervenções</div>
        </div>
      </div>

      <!-- Pool Information Card -->
      <div class="pdf-card pdf-card-primary">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">🏊‍♂️ Informações da Piscina</h3>
        </div>
        <div class="pdf-card-content">
          <div class="pdf-info-grid">
            <div class="pdf-info-item">
              <span class="pdf-info-label">Nome:</span>
              <span class="pdf-info-value">${maintenance.poolName}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Cliente:</span>
              <span class="pdf-info-value">${maintenance.clientName}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Contacto:</span>
              <span class="pdf-info-value">${maintenance.clientPhone || "N/A"}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Email:</span>
              <span class="pdf-info-value">${maintenance.clientEmail || "N/A"}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Morada:</span>
              <span class="pdf-info-value">${maintenance.address}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Tipo:</span>
              <span class="pdf-info-value">${getPoolTypeLabel(maintenance.poolType)}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Volume:</span>
              <span class="pdf-info-value">${maintenance.waterCubicage || "N/A"} m³</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Estado:</span>
              <span class="pdf-info-value pdf-status-active">${maintenance.status === "ativa" ? "Ativa" : "Inativa"}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Card -->
      <div class="pdf-card pdf-card-stats">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">📊 Estatísticas Gerais</h3>
        </div>
        <div class="pdf-card-content">
          <div class="pdf-stats-grid">
            <div class="pdf-stat-item pdf-stat-primary">
              <div class="pdf-stat-icon">📈</div>
              <div class="pdf-stat-details">
                <div class="pdf-stat-value">${totalInterventions}</div>
                <div class="pdf-stat-label">Total de Intervenções</div>
              </div>
            </div>
            <div class="pdf-stat-item pdf-stat-secondary">
              <div class="pdf-stat-icon">📅</div>
              <div class="pdf-stat-details">
                <div class="pdf-stat-value">${last30Days}</div>
                <div class="pdf-stat-label">Últimos 30 Dias</div>
              </div>
            </div>
            <div class="pdf-stat-item ${pendingProblems.length > 0 ? "pdf-stat-warning" : "pdf-stat-success"}">
              <div class="pdf-stat-icon">${pendingProblems.length > 0 ? "⚠️" : "✅"}</div>
              <div class="pdf-stat-details">
                <div class="pdf-stat-value">${pendingProblems.length}</div>
                <div class="pdf-stat-label">Problemas Pendentes</div>
              </div>
            </div>
            <div class="pdf-stat-item pdf-stat-info">
              <div class="pdf-stat-icon">👨‍🔧</div>
              <div class="pdf-stat-details">
                <div class="pdf-stat-value">${mostActiveTechnician ? mostActiveTechnician[0] : "N/A"}</div>
                <div class="pdf-stat-label">Técnico Mais Ativo</div>
              </div>
            </div>
          </div>
          ${
            mostUsedProduct
              ? `
          <div class="pdf-additional-stats">
            <div class="pdf-highlight-stat">
              <span class="pdf-highlight-label">🧴 Produto mais utilizado:</span>
              <span class="pdf-highlight-value">${mostUsedProduct[0]} (${mostUsedProduct[1]} aplicações)</span>
            </div>
          </div>`
              : ""
          }
        </div>
      </div>

      <!-- Water Quality Trend -->
      ${
        waterQualityTrend.length > 0
          ? `
      <div class="pdf-card pdf-card-trend">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">🧪 Tendência da Qualidade da Água</h3>
          <div class="pdf-trend-subtitle">Últimas ${waterQualityTrend.length} análises</div>
        </div>
        <div class="pdf-card-content">
          <div class="pdf-trend-grid">
            ${waterQualityTrend
              .map((intervention, index) => {
                const waterAnalysis = getWaterAnalysis(
                  intervention.waterValues,
                );
                const overallQuality = getWaterQualityStatus(
                  intervention.waterValues,
                );
                return `
                <div class="pdf-trend-item ${overallQuality.color.replace(/text-/, "color-").replace(/bg-/, "bg-")}">
                  <div class="pdf-trend-date">${format(new Date(intervention.date), "dd/MM", { locale: pt })}</div>
                  <div class="pdf-trend-values">
                    <div class="pdf-trend-value">
                      <span class="pdf-trend-param">pH</span>
                      <span class="pdf-trend-data">${waterAnalysis.ph.value}</span>
                    </div>
                    <div class="pdf-trend-value">
                      <span class="pdf-trend-param">Cl</span>
                      <span class="pdf-trend-data">${waterAnalysis.chlorine.value}</span>
                    </div>
                    <div class="pdf-trend-value">
                      <span class="pdf-trend-param">T°</span>
                      <span class="pdf-trend-data">${waterAnalysis.temperature.value}</span>
                    </div>
                  </div>
                  <div class="pdf-trend-status">${overallQuality.label}</div>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
      </div>`
          : ""
      }

      <!-- Pending Problems -->
      ${
        pendingProblems.length > 0
          ? `
      <div class="pdf-card pdf-card-problems">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">⚠️ Problemas Pendentes de Resolução</h3>
          <div class="pdf-problems-count">${pendingProblems.length} problema${pendingProblems.length !== 1 ? "s" : ""}</div>
        </div>
        <div class="pdf-card-content">
          ${pendingProblems
            .map((problem, index) => {
              const relatedIntervention = sortedInterventions.find((i) =>
                i.problems?.some((p) => p.description === problem.description),
              );
              return `
              <div class="pdf-problem-item pdf-problem-pending">
                <div class="pdf-problem-header">
                  <span class="pdf-problem-status">❌ Não Resolvido</span>
                  <span class="pdf-problem-date">${relatedIntervention ? format(new Date(relatedIntervention.date), "dd/MM/yyyy", { locale: pt }) : "Data desconhecida"}</span>
                </div>
                <div class="pdf-problem-description">${problem.description}</div>
                ${problem.priority ? `<div class="pdf-problem-priority">Prioridade: ${problem.priority}</div>` : ""}
              </div>
            `;
            })
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- Complete Interventions History -->
      ${
        sortedInterventions.length > 0
          ? `
      <div class="pdf-card pdf-card-history">
        <div class="pdf-card-header">
          <h3 class="pdf-card-title">📅 Histórico Completo de Intervenções</h3>
          <div class="pdf-history-count">${totalInterventions} intervenção${totalInterventions !== 1 ? "ões" : ""} registrada${totalInterventions !== 1 ? "s" : ""}</div>
        </div>
        <div class="pdf-card-content">
          ${sortedInterventions
            .map((intervention, index) => {
              const waterAnalysis = getWaterAnalysis(intervention.waterValues);
              const qualityStatus = getWaterQualityStatus(
                intervention.waterValues,
              );
              return `
              <div class="pdf-intervention-card">
                <div class="pdf-intervention-header">
                  <div class="pdf-intervention-title">
                    <span class="pdf-intervention-number">#${String(index + 1).padStart(2, "0")}</span>
                    <span class="pdf-intervention-date">${format(new Date(intervention.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}</span>
                  </div>
                  <div class="pdf-intervention-meta">
                    <span class="pdf-intervention-time">⏰ ${intervention.timeStart} - ${intervention.timeEnd}</span>
                    <span class="pdf-intervention-duration">(${calculateDuration(intervention.timeStart, intervention.timeEnd)})</span>
                  </div>
                </div>

                <div class="pdf-intervention-body">
                  <div class="pdf-intervention-section">
                    <h5 class="pdf-section-subtitle">👨‍🔧 Equipa</h5>
                    <div class="pdf-technicians">${intervention.technicians.join(", ")}</div>
                  </div>

                  <div class="pdf-intervention-section">
                    <h5 class="pdf-section-subtitle">🧪 Análise da Água</h5>
                    <div class="pdf-water-mini-grid">
                      ${Object.entries(waterAnalysis)
                        .filter(([key, data]) => data.value !== "N/A")
                        .map(
                          ([key, data]) => `
                        <div class="pdf-water-mini-item ${getStatusColor(
                          data.status,
                        )
                          .replace(/bg-/, "pdf-bg-")
                          .replace(/border-/, "pdf-border-")}">
                          <span class="pdf-water-mini-param">${key.toUpperCase()}</span>
                          <span class="pdf-water-mini-value">${data.value}</span>
                        </div>
                      `,
                        )
                        .join("")}
                    </div>
                    <div class="pdf-water-status ${qualityStatus.color.replace(/text-/, "color-").replace(/bg-/, "bg-")}">${qualityStatus.label}</div>
                  </div>

                  ${
                    Object.values(intervention.workPerformed).some((v) => v)
                      ? `
                  <div class="pdf-intervention-section">
                    <h5 class="pdf-section-subtitle">🔧 Trabalho Realizado</h5>
                    <div class="pdf-work-mini-grid">
                      ${Object.entries(intervention.workPerformed)
                        .filter(([key, value]) => value && key !== "outros")
                        .map(
                          ([key]) => `
                          <span class="pdf-work-mini-badge">✓ ${workLabels[key as keyof typeof workLabels] || key}</span>
                        `,
                        )
                        .join("")}
                      ${intervention.workPerformed.outros ? `<span class="pdf-work-mini-badge pdf-work-additional-badge">📝 ${intervention.workPerformed.outros}</span>` : ""}
                    </div>
                  </div>`
                      : ""
                  }

                  ${
                    intervention.chemicalProducts &&
                    intervention.chemicalProducts.length > 0
                      ? `
                  <div class="pdf-intervention-section">
                    <h5 class="pdf-section-subtitle">🧴 Produtos Aplicados</h5>
                    <div class="pdf-chemicals-mini-list">
                      ${intervention.chemicalProducts
                        .map(
                          (product) => `
                        <div class="pdf-chemical-mini-item">
                          <span class="pdf-chemical-mini-name">${product.productName}</span>
                          <span class="pdf-chemical-mini-qty">${product.quantity} ${product.unit}</span>
                        </div>
                      `,
                        )
                        .join("")}
                    </div>
                  </div>`
                      : ""
                  }

                  ${
                    intervention.problems && intervention.problems.length > 0
                      ? `
                  <div class="pdf-intervention-section">
                    <h5 class="pdf-section-subtitle">⚠️ Problemas</h5>
                    <div class="pdf-problems-mini-list">
                      ${intervention.problems
                        .map(
                          (problem) => `
                        <div class="pdf-problem-mini-item ${problem.resolved ? "pdf-problem-mini-resolved" : "pdf-problem-mini-pending"}">
                          <span class="pdf-problem-mini-status">${problem.resolved ? "✅" : "❌"}</span>
                          <span class="pdf-problem-mini-desc">${problem.description}</span>
                        </div>
                      `,
                        )
                        .join("")}
                    </div>
                  </div>`
                      : ""
                  }

                  ${
                    intervention.photos && intervention.photos.length > 0
                      ? `
                  <div class="pdf-intervention-section">
                    <h5 class="pdf-section-subtitle">📸 Fotos (${intervention.photos.length})</h5>
                    <div class="pdf-photos-mini-grid">
                      ${intervention.photos
                        .slice(0, 4)
                        .map(
                          (photo, photoIndex) => `
                        <img src="${photo}" alt="Foto ${photoIndex + 1}" class="pdf-photo-mini" crossorigin="anonymous" />
                      `,
                        )
                        .join("")}
                      ${intervention.photos.length > 4 ? `<div class="pdf-photos-more">+${intervention.photos.length - 4}</div>` : ""}
                    </div>
                  </div>`
                      : ""
                  }

                  ${
                    intervention.observations
                      ? `
                  <div class="pdf-intervention-section">
                    <h5 class="pdf-section-subtitle">📝 Observações</h5>
                    <div class="pdf-observations-mini">${intervention.observations}</div>
                  </div>`
                      : ""
                  }
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- Pool Photos Section -->
      ${maintenance.photos && maintenance.photos.length > 0 ? createPhotoGallery(maintenance.photos, "Fotos da Piscina") : ""}
    `;
  };

  const generatePDFReport = async (shareMethod?: string, retryCount = 0) => {
    setIsGenerating(true);

    try {
      const content = intervention
        ? createInterventionContent()
        : createMaintenanceContent();

      const pdfData = {
        title: intervention
          ? `Relatório de Intervenção - ${maintenance.poolName}`
          : `Relatório de Manutenção - ${maintenance.poolName}`,
        subtitle: intervention
          ? `Intervenção de ${format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })}`
          : `Relatório geral da piscina`,
        date: intervention
          ? format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })
          : new Date().toLocaleDateString("pt-PT"),
        additionalInfo: `Cliente: ${maintenance.clientName} • Tipo: ${getPoolTypeLabel(maintenance.poolType)} • Volume: ${maintenance.waterCubicage || "N/A"} m³`,
      };

      const modernPDFStyles = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
          }

          .pdf-header-modern {
            background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
            color: white;
            padding: 32px;
            margin-bottom: 24px;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .pdf-main-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .pdf-subtitle {
            font-size: 18px;
            font-weight: 500;
            opacity: 0.9;
            margin-bottom: 8px;
          }

          .pdf-date {
            font-size: 14px;
            opacity: 0.8;
          }

          .pdf-ref-number {
            font-size: 12px;
            opacity: 0.8;
            margin-bottom: 8px;
          }

          .pdf-status-badge {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
          }

          .pdf-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }

          .pdf-card-header {
            background: #f8fafc;
            padding: 20px 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .pdf-card-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
          }

          .pdf-card-content {
            padding: 24px;
          }

          .pdf-card-primary .pdf-card-header { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); }
          .pdf-card-secondary .pdf-card-header { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); }
          .pdf-card-analysis .pdf-card-header { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); }
          .pdf-card-work .pdf-card-header { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }
          .pdf-card-chemicals .pdf-card-header { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); }
          .pdf-card-problems .pdf-card-header { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); }
          .pdf-card-observations .pdf-card-header { background: linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%); }
          .pdf-card-summary .pdf-card-header { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); }
          .pdf-card-stats .pdf-card-header { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); }
          .pdf-card-trend .pdf-card-header { background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); }
          .pdf-card-history .pdf-card-header { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }

          .pdf-info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .pdf-info-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
          }

          .pdf-info-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 120px;
          }

          .pdf-info-value {
            font-weight: 500;
            color: #1f2937;
            text-align: right;
          }

          .pdf-status-active {
            color: #059669;
            font-weight: 600;
          }

          .pdf-duration {
            color: #0ea5e9;
            font-weight: 600;
          }

          .pdf-overall-status {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .pdf-water-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }

          .pdf-water-item {
            padding: 16px;
            border-radius: 8px;
            border: 2px solid;
            text-align: center;
          }

          .pdf-water-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .pdf-water-param {
            font-weight: 700;
            font-size: 12px;
            color: #374151;
          }

          .pdf-water-value {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 4px;
            color: #1f2937;
          }

          .pdf-water-ideal {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 4px;
          }

          .pdf-water-advice {
            font-size: 10px;
            font-weight: 600;
            color: #374151;
          }

          .pdf-bg-green-50 { background-color: #f0fdf4; }
          .pdf-border-green-200 { border-color: #bbf7d0; }
          .pdf-bg-yellow-50 { background-color: #fefce8; }
          .pdf-border-yellow-200 { border-color: #fde047; }
          .pdf-bg-red-50 { background-color: #fef2f2; }
          .pdf-border-red-200 { border-color: #fecaca; }
          .pdf-bg-blue-50 { background-color: #eff6ff; }
          .pdf-border-blue-200 { border-color: #bfdbfe; }

          .pdf-work-categories {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .pdf-work-category {
            background: #f9fafb;
            border-radius: 8px;
            padding: 16px;
          }

          .pdf-category-title {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
          }

          .pdf-work-items {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .pdf-work-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
          }

          .pdf-work-completed {
            background: #dcfce7;
            color: #166534;
          }

          .pdf-work-additional {
            background: #dbeafe;
            color: #1e40af;
            grid-column: 1 / -1;
          }

          .pdf-work-check {
            font-size: 14px;
          }

          .pdf-chemicals-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .pdf-chemical-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
          }

          .pdf-chemical-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .pdf-chemical-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 14px;
          }

          .pdf-chemical-quantity {
            font-weight: 500;
            color: #6366f1;
            font-size: 12px;
            background: #eef2ff;
            padding: 4px 8px;
            border-radius: 4px;
          }

          .pdf-chemical-purpose {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }

          .pdf-chemical-notes {
            font-size: 11px;
            color: #374151;
            font-style: italic;
          }

          .pdf-product-count {
            font-size: 12px;
            color: #6b7280;
            background: white;
            padding: 4px 12px;
            border-radius: 12px;
          }

          .pdf-photo-gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }

          .pdf-photo-item {
            text-align: center;
          }

          .pdf-photo-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
          }

          .pdf-photo-caption {
            font-size: 11px;
            color: #6b7280;
            margin-top: 8px;
          }

          .pdf-problem-item {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
          }

          .pdf-problem-pending {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
          }

          .pdf-problem-resolved {
            background: #f0fdf4;
            border-left: 4px solid #22c55e;
          }

          .pdf-problem-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .pdf-problem-status {
            font-size: 12px;
            font-weight: 600;
          }

          .pdf-problem-date {
            font-size: 11px;
            color: #6b7280;
          }

          .pdf-problem-description {
            font-size: 13px;
            color: #374151;
            margin-bottom: 4px;
          }

          .pdf-problem-priority {
            font-size: 11px;
            font-weight: 600;
            color: #f59e0b;
          }

          .pdf-observations-content {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.6;
            color: #374151;
          }

          .pdf-summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .pdf-summary-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }

          .pdf-summary-icon {
            font-size: 24px;
            flex-shrink: 0;
          }

          .pdf-summary-details {
            flex: 1;
          }

          .pdf-summary-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }

          .pdf-summary-value {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }

          .pdf-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .pdf-stat-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }

          .pdf-stat-primary { background: #dbeafe; border-color: #3b82f6; }
          .pdf-stat-secondary { background: #f0f9ff; border-color: #0ea5e9; }
          .pdf-stat-success { background: #dcfce7; border-color: #22c55e; }
          .pdf-stat-warning { background: #fef3c7; border-color: #f59e0b; }
          .pdf-stat-info { background: #f0f9ff; border-color: #6366f1; }

          .pdf-stat-icon {
            font-size: 20px;
            flex-shrink: 0;
          }

          .pdf-stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            line-height: 1;
          }

          .pdf-stat-label {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
          }

          .pdf-additional-stats {
            margin-top: 16px;
            padding: 16px;
            background: #f0fdf4;
            border-radius: 8px;
            border: 1px solid #bbf7d0;
          }

          .pdf-highlight-stat {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .pdf-highlight-label {
            font-size: 13px;
            color: #166534;
            font-weight: 500;
          }

          .pdf-highlight-value {
            font-size: 13px;
            color: #1f2937;
            font-weight: 600;
          }

          .pdf-trend-subtitle {
            font-size: 12px;
            color: #6b7280;
          }

          .pdf-trend-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
          }

          .pdf-trend-item {
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid;
          }

          .pdf-trend-date {
            font-size: 11px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }

          .pdf-trend-values {
            margin-bottom: 8px;
          }

          .pdf-trend-value {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          }

          .pdf-trend-param {
            font-size: 10px;
            color: #6b7280;
            font-weight: 500;
          }

          .pdf-trend-data {
            font-size: 11px;
            font-weight: 600;
            color: #1f2937;
          }

          .pdf-trend-status {
            font-size: 10px;
            font-weight: 600;
          }

          .pdf-problems-count, .pdf-history-count {
            font-size: 12px;
            color: #6b7280;
            background: white;
            padding: 4px 12px;
            border-radius: 12px;
          }

          .pdf-intervention-card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 16px;
            overflow: hidden;
          }

          .pdf-intervention-header {
            background: white;
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
          }

          .pdf-intervention-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 4px;
          }

          .pdf-intervention-number {
            background: #3b82f6;
            color: white;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
          }

          .pdf-intervention-date {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
          }

          .pdf-intervention-meta {
            font-size: 12px;
            color: #6b7280;
          }

          .pdf-intervention-time {
            margin-right: 8px;
          }

          .pdf-intervention-duration {
            font-weight: 500;
            color: #3b82f6;
          }

          .pdf-intervention-body {
            padding: 16px;
          }

          .pdf-intervention-section {
            margin-bottom: 16px;
          }

          .pdf-section-subtitle {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e5e7eb;
          }

          .pdf-technicians {
            font-size: 13px;
            color: #1f2937;
            font-weight: 500;
          }

          .pdf-water-mini-grid {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 8px;
          }

          .pdf-water-mini-item {
            padding: 6px 10px;
            border-radius: 6px;
            border: 1px solid;
            text-align: center;
            min-width: 60px;
          }

          .pdf-water-mini-param {
            display: block;
            font-size: 9px;
            font-weight: 600;
            color: #374151;
          }

          .pdf-water-mini-value {
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: #1f2937;
          }

          .pdf-water-status {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
          }

          .pdf-work-mini-grid {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .pdf-work-mini-badge {
            font-size: 10px;
            background: #dcfce7;
            color: #166534;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 500;
          }

          .pdf-work-additional-badge {
            background: #dbeafe;
            color: #1e40af;
          }

          .pdf-chemicals-mini-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .pdf-chemical-mini-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            padding: 6px 8px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
          }

          .pdf-chemical-mini-name {
            font-weight: 500;
            color: #1f2937;
          }

          .pdf-chemical-mini-qty {
            font-weight: 600;
            color: #6366f1;
            font-size: 10px;
          }

          .pdf-problems-mini-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .pdf-problem-mini-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            padding: 6px 8px;
            border-radius: 4px;
          }

          .pdf-problem-mini-resolved {
            background: #dcfce7;
            color: #166534;
          }

          .pdf-problem-mini-pending {
            background: #fef2f2;
            color: #dc2626;
          }

          .pdf-problem-mini-status {
            font-size: 12px;
          }

          .pdf-problem-mini-desc {
            flex: 1;
          }

          .pdf-photos-mini-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }

          .pdf-photo-mini {
            width: 100%;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
          }

          .pdf-photos-more {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            color: #6b7280;
            font-size: 10px;
            font-weight: 600;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
          }

          .pdf-observations-mini {
            font-size: 11px;
            color: #374151;
            background: #fffbeb;
            padding: 8px;
            border-radius: 4px;
            border-left: 3px solid #f59e0b;
          }

          /* Color utilities */
          .bg-green-100 { background-color: #dcfce7; }
          .color-green-800 { color: #166534; }
          .bg-yellow-100 { background-color: #fef3c7; }
          .color-yellow-800 { color: #92400e; }
          .bg-red-100 { background-color: #fee2e2; }
          .color-red-800 { color: #991b1b; }
          .bg-blue-100 { background-color: #dbeafe; }
          .color-blue-800 { color: #1e40af; }

          @media print {
            .pdf-card { page-break-inside: avoid; }
            .pdf-intervention-card { page-break-inside: avoid; }
            .pdf-work-category { page-break-inside: avoid; }
          }
        </style>
      `;

      const htmlContent = PDFGenerator.createModernReportHTML({
        type: "maintenance",
        title: pdfData.title,
        subtitle: pdfData.subtitle,
        date: pdfData.date,
        content: content,
        additionalInfo: pdfData.additionalInfo,
      });

      const filename = `${intervention ? "intervencao" : "manutencao"}_${maintenance.poolName.replace(/\s+/g, "_")}_${format(new Date(), "yyyyMMdd", { locale: pt })}.pdf`;

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

  const handleShare = async (method: string) => {
    await generatePDFReport();
  };

  const renderInterventionPreview = () => {
    if (!intervention) return null;

    const waterAnalysis = getWaterAnalysis(intervention.waterValues);
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

        {/* Pool Info Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Informações da Piscina
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-semibold">{maintenance.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Localização</p>
                  <p className="font-semibold">{maintenance.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Waves className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-semibold">
                    {getPoolTypeLabel(maintenance.poolType)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Volume</p>
                  <p className="font-semibold">
                    {maintenance.waterCubicage || "N/A"} m³
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intervention Details Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Detalhes da Intervenção
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Horário</p>
                  <p className="font-semibold">
                    {intervention.timeStart} - {intervention.timeEnd}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    Duração:{" "}
                    {calculateDuration(
                      intervention.timeStart,
                      intervention.timeEnd,
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Técnicos</p>
                  <p className="font-semibold">
                    {intervention.technicians.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Water Analysis Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Análise da Água
              </div>
              <Badge className={qualityStatus.color}>
                <QualityIcon className="h-4 w-4 mr-1" />
                {qualityStatus.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(waterAnalysis).map(([key, data]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(data.status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm uppercase tracking-wide">
                      {key}
                    </span>
                    {getStatusIcon(data.status)}
                  </div>
                  <div className="text-2xl font-bold mb-1">{data.value}</div>
                  <div className="text-xs text-gray-600 mb-1">
                    Ideal: {data.ideal}
                  </div>
                  <div className="text-xs font-medium">{data.advice}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Performed Card */}
        {Object.values(intervention.workPerformed).some((v) => v) && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Trabalho Realizado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Filtration System */}
                {["filtros", "preFiltero", "filtroAreiaVidro"].some(
                  (key) =>
                    intervention.workPerformed[
                      key as keyof typeof intervention.workPerformed
                    ],
                ) && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      Sistema de Filtração
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(intervention.workPerformed)
                        .filter(
                          ([key, value]) =>
                            value &&
                            [
                              "filtros",
                              "preFiltero",
                              "filtroAreiaVidro",
                            ].includes(key),
                        )
                        .map(([key]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">
                              {workLabels[key as keyof typeof workLabels] ||
                                key}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Pool Systems */}
                {[
                  "enchimentoAutomatico",
                  "linhaAgua",
                  "limpezaFundo",
                  "limpezaParedes",
                  "limpezaSkimmers",
                  "verificacaoEquipamentos",
                  "aspiracao",
                  "escovagem",
                  "limpezaFiltros",
                  "tratamentoAlgas",
                ].some(
                  (key) =>
                    intervention.workPerformed[
                      key as keyof typeof intervention.workPerformed
                    ],
                ) && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                      <Waves className="h-4 w-4 text-blue-500" />
                      Sistemas da Piscina
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(intervention.workPerformed)
                        .filter(
                          ([key, value]) =>
                            value &&
                            [
                              "enchimentoAutomatico",
                              "linhaAgua",
                              "limpezaFundo",
                              "limpezaParedes",
                              "limpezaSkimmers",
                              "verificacaoEquipamentos",
                              "aspiracao",
                              "escovagem",
                              "limpezaFiltros",
                              "tratamentoAlgas",
                            ].includes(key),
                        )
                        .map(([key]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">
                              {workLabels[key as keyof typeof workLabels] ||
                                key}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Additional Work */}
                {intervention.workPerformed.outros && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                      <FileText className="h-4 w-4 text-blue-500" />
                      Trabalho Adicional
                    </h4>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          {intervention.workPerformed.outros}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chemical Products Card */}
        {intervention.chemicalProducts &&
          intervention.chemicalProducts.length > 0 && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5" />
                    Produtos Químicos
                  </div>
                  <Badge variant="secondary">
                    {intervention.chemicalProducts.length} produto
                    {intervention.chemicalProducts.length !== 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {intervention.chemicalProducts.map((product, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-800">
                          {product.productName}
                        </h5>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800"
                        >
                          {product.quantity} {product.unit}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {getProductPurpose(product.productName)}
                      </p>
                      {product.observations && (
                        <p className="text-xs text-gray-500 italic">
                          {product.observations}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Photos */}
        {(intervention.photos && intervention.photos.length > 0) ||
        (maintenance.photos && maintenance.photos.length > 0) ? (
          <Card>
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Galeria de Fotos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {intervention.photos && intervention.photos.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Fotos da Intervenção ({intervention.photos.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {intervention.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Intervenção ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {maintenance.photos && maintenance.photos.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Fotos da Piscina ({maintenance.photos.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {maintenance.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Piscina ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Problems */}
        {intervention.problems && intervention.problems.length > 0 && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Problemas Identificados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {intervention.problems.map((problem, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      problem.resolved
                        ? "bg-green-50 border-green-400"
                        : "bg-red-50 border-red-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {problem.resolved ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          problem.resolved ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {problem.resolved ? "RESOLVIDO" : "PENDENTE"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">
                      {problem.description}
                    </p>
                    {problem.priority && (
                      <p className="text-xs text-orange-600 font-medium mt-1">
                        Prioridade: {problem.priority}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Observations */}
        {intervention.observations && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Observações do Técnico
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {intervention.observations}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumo da Intervenção
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Estado da Água</div>
                <div
                  className={`font-bold text-sm ${qualityStatus.color.replace("bg-", "text-").replace("text-", "text-")}`}
                >
                  {qualityStatus.label}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Beaker className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Produtos</div>
                <div className="font-bold text-lg">
                  {intervention.chemicalProducts
                    ? intervention.chemicalProducts.length
                    : 0}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Settings className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Trabalhos</div>
                <div className="font-bold text-lg">
                  {
                    Object.values(intervention.workPerformed).filter((v) => v)
                      .length
                  }
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Próxima Visita</div>
                <div className="font-bold text-sm">
                  {intervention.nextVisit
                    ? format(new Date(intervention.nextVisit), "dd/MM", {
                        locale: pt,
                      })
                    : "A definir"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMaintenancePreview = () => {
    // Sort interventions by date (most recent first)
    const sortedInterventions = [...(maintenance.interventions || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Calculate statistics
    const totalInterventions = sortedInterventions.length;
    const last30Days = sortedInterventions.filter(
      (i) => new Date(i.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).length;

    const pendingProblems = sortedInterventions
      .flatMap((i) => i.problems || [])
      .filter((p) => !p.resolved);

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
                {totalInterventions} Intervenções
              </Badge>
            </div>
          </div>
        </Card>

        {/* Pool Info Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Informações da Piscina
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-semibold">{maintenance.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Contacto</p>
                  <p className="font-semibold">
                    {maintenance.clientPhone || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">
                    {maintenance.clientEmail || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Localização</p>
                  <p className="font-semibold">{maintenance.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Waves className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-semibold">
                    {getPoolTypeLabel(maintenance.poolType)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Volume</p>
                  <p className="font-semibold">
                    {maintenance.waterCubicage || "N/A"} m³
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Intervenções
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalInterventions}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Últimos 30 Dias
                  </p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {last30Days}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Problemas Pendentes
                  </p>
                  <p
                    className={`text-3xl font-bold ${pendingProblems.length > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {pendingProblems.length}
                  </p>
                </div>
                {pendingProblems.length > 0 ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Interventions */}
        {sortedInterventions.length > 0 && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Últimas Intervenções
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {sortedInterventions.slice(0, 5).map((intervention, index) => {
                  const waterAnalysis = getWaterAnalysis(
                    intervention.waterValues,
                  );
                  const qualityStatus = getWaterQualityStatus(
                    intervention.waterValues,
                  );
                  const QualityIcon = qualityStatus.icon;

                  return (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            #{String(index + 1).padStart(2, "0")}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {format(
                                new Date(intervention.date),
                                "dd 'de' MMMM 'de' yyyy",
                                { locale: pt },
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {intervention.timeStart} - {intervention.timeEnd}{" "}
                              (
                              {calculateDuration(
                                intervention.timeStart,
                                intervention.timeEnd,
                              )}
                              )
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${qualityStatus.color} flex items-center gap-1`}
                        >
                          <QualityIcon className="h-3 w-3" />
                          {qualityStatus.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            ����‍🔧 Técnicos
                          </p>
                          <p className="text-sm font-medium">
                            {intervention.technicians.join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            🧪 Análise
                          </p>
                          <div className="flex gap-2">
                            {Object.entries(waterAnalysis)
                              .filter(([key, data]) => data.value !== "N/A")
                              .slice(0, 3)
                              .map(([key, data]) => (
                                <span
                                  key={key}
                                  className={`text-xs px-2 py-1 rounded ${getStatusColor(data.status)}`}
                                >
                                  {key.toUpperCase()}: {data.value}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            🔧 Trabalhos
                          </p>
                          <p className="text-sm font-medium">
                            {
                              Object.values(intervention.workPerformed).filter(
                                (v) => v,
                              ).length
                            }{" "}
                            atividade
                            {Object.values(intervention.workPerformed).filter(
                              (v) => v,
                            ).length !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      </div>

                      {intervention.observations && (
                        <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Observações:</span>{" "}
                            {intervention.observations}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {sortedInterventions.length > 5 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      ... e mais {sortedInterventions.length - 5} intervenções
                      no relatório PDF completo
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Problems */}
        {pendingProblems.length > 0 && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Problemas Pendentes ({pendingProblems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {pendingProblems.map((problem, index) => (
                  <div
                    key={index}
                    className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-xs font-semibold text-red-700">
                        PENDENTE
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">
                      {problem.description}
                    </p>
                    {problem.priority && (
                      <p className="text-xs text-orange-600 font-medium mt-1">
                        Prioridade: {problem.priority}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pool Photos */}
        {maintenance.photos && maintenance.photos.length > 0 && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Fotos da Piscina ({maintenance.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {maintenance.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Piscina ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Droplets className="mr-2 h-6 w-6 text-blue-600" />
            Relatório de {intervention ? "Intervenção" : "Manutenção"} -{" "}
            {maintenance.poolName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Preview */}
          <div className="lg:col-span-3">
            {intervention
              ? renderInterventionPreview()
              : renderMaintenancePreview()}
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações do Relatório
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Piscina</p>
                    <p className="font-semibold">{maintenance.poolName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cliente</p>
                    <p className="font-semibold">{maintenance.clientName}</p>
                  </div>
                  {intervention && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Data da Intervenção
                      </p>
                      <p className="font-semibold">
                        {format(new Date(intervention.date), "dd/MM/yyyy", {
                          locale: pt,
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tipo de Relatório
                    </p>
                    <p className="font-semibold">
                      {intervention
                        ? "Intervenção Específica"
                        : "Relatório Geral"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gerar & Partilhar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => generatePDFReport("download")}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isGenerating ? "A gerar..." : "Descarregar PDF"}
                  </Button>

                  <Separator />

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => generatePDFReport("email")}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                    >
                      <Mail className="mr-1 h-3 w-3" />
                      Email
                    </Button>
                    <Button
                      onClick={() => generatePDFReport("whatsapp")}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                    >
                      <MessageCircle className="mr-1 h-3 w-3" />
                      WhatsApp
                    </Button>
                  </div>

                  <Button
                    onClick={() => generatePDFReport("copy")}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Copiar Link
                  </Button>
                </CardContent>
              </Card>

              {isGenerating && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          Gerando PDF...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Incluindo todas as fotos e informações detalhadas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
