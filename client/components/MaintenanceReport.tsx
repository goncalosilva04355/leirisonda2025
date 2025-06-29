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
      return "✅ Qualidade Excelente";
    } else if (ph >= 6.8 && ph <= 7.6 && chlorine >= 0.8 && chlorine <= 2.5) {
      return "��️ Qualidade Aceitável";
    } else {
      return "❌ Qualidade Inadequada";
    }
  };

  const generateReportContent = () => {
    const reportDate = format(new Date(), "dd/MM/yyyy", { locale: pt });

    if (intervention) {
      // Single intervention report
      const interventionDate = format(
        new Date(intervention.date),
        "dd/MM/yyyy",
        { locale: pt },
      );

      return `
💧 RELATÓRIO DE MANUTENÇÃO - LEIRISONDA

���━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏊 INFORMAÇÕES DA PISCINA

Nome: ${maintenance.poolName}
Cliente: ${maintenance.clientName}
Localização: ${maintenance.location}
Tipo: ${getPoolTypeLabel(maintenance.poolType)}
Cubicagem: ${maintenance.waterCubicage || "Não especificado"}

📅 INTERVENÇÃO

Data: ${interventionDate}
Horário: ${intervention.timeStart} - ${intervention.timeEnd}
Técnicos: ${intervention.technicians.join(", ")}
${intervention.vehicles.length > 0 ? `Viaturas: ${intervention.vehicles.join(", ")}` : ""}

🧪 ANÁLISE DA ÁGUA

pH: ${intervention.waterValues.ph || "N/A"}
Cloro: ${intervention.waterValues.chlorine || "N/A"} ppm
Temperatura: ${intervention.waterValues.temperature || "N/A"}°C
Sal: ${intervention.waterValues.salt || "N/A"} gr/lt
${intervention.waterValues.bromine ? `Bromo: ${intervention.waterValues.bromine} ppm` : ""}
${intervention.waterValues.alkalinity ? `Alcalinidade: ${intervention.waterValues.alkalinity}` : ""}

Estado da Água: ${getWaterQualityStatus(intervention.waterValues)}

🔧 TRABALHO REALIZADO

${
  Object.entries(intervention.workPerformed)
    .filter(([key, value]) => value && key !== "outros")
    .map(
      ([key]) =>
        `• ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}`,
    )
    .join("\n") || "�� Verificação geral"
}

${intervention.workPerformed.outros ? `• ${intervention.workPerformed.outros}` : ""}

💊 PRODUTOS QUÍMICOS UTILIZADOS

${
  intervention.chemicalProducts.length > 0
    ? intervention.chemicalProducts
        .map((p) => `• ${p.productName}: ${p.quantity}${p.unit}`)
        .join("\n")
    : "• Nenhum produto utilizado"
}

${
  intervention.problems.length > 0
    ? `
⚠️ PROBLEMAS IDENTIFICADOS

${intervention.problems
  .map(
    (p) =>
      `• ${p.description} (${p.severity === "high" ? "Alta" : p.severity === "medium" ? "Média" : "Baixa"} prioridade) ${p.resolved ? "- RESOLVIDO ✅" : "- PENDENTE ❌"}`,
  )
  .join("\n")}
`
    : ""
}

${
  intervention.observations
    ? `
📝 OBSERVAÇÕES

${intervention.observations}
`
    : ""
}

${
  intervention.nextMaintenanceDate
    ? `
📅 PRÓXIMA MANUTENÇÃO

Data recomendada: ${format(new Date(intervention.nextMaintenanceDate), "dd/MM/yyyy", { locale: pt })}
`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 CONTACTO
Leirisonda - Manutenção de Piscinas
Email: info@leirisonda.pt
Telefone: [Inserir contacto]

Relatório gerado em: ${reportDate}

© ${new Date().getFullYear()} Leirisonda - Todos os direitos reservados.
      `.trim();
    } else {
      // Full maintenance summary
      const lastIntervention = maintenance.interventions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

      return `
💧 RELATÓRIO GERAL DE MANUTENÇÃO - LEIRISONDA

━━━��━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏊 INFORMAÇÕES DA PISCINA

Nome: ${maintenance.poolName}
Cliente: ${maintenance.clientName}
Telefone: ${maintenance.clientPhone}
Email: ${maintenance.clientEmail}
Localização: ${maintenance.location}
Tipo: ${getPoolTypeLabel(maintenance.poolType)}
Cubicagem: ${maintenance.waterCubicage || "Não especificado"}
Estado: ${maintenance.status === "active" ? "Ativa" : maintenance.status === "inactive" ? "Inativa" : "Sazonal"}

📊 ESTATÍSTICAS DE MANUTENÇÃO

Total de Intervenções: ${maintenance.interventions.length}
${lastIntervention ? `Última Intervenção: ${format(new Date(lastIntervention.date), "dd/MM/yyyy", { locale: pt })}` : "Sem intervenções registadas"}

Problemas Ativos: ${
        maintenance.interventions
          .flatMap((i) => i.problems)
          .filter((p) => !p.resolved).length
      }

${
  lastIntervention
    ? `
🧪 ÚLTIMA ANÁLISE DA ÁGUA

pH: ${lastIntervention.waterValues.ph || "N/A"}
Cloro: ${lastIntervention.waterValues.chlorine || "N/A"} ppm
Temperatura: ${lastIntervention.waterValues.temperature || "N/A"}°C
Estado: ${getWaterQualityStatus(lastIntervention.waterValues)}
`
    : ""
}

📅 HISTÓRICO DE INTERVENÇÕES (Últimas 5)

${
  maintenance.interventions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(
      (intervention, index) => `
${index + 1}. ${format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })}
   Técnicos: ${intervention.technicians.join(", ")}
   Trabalho: ${
     Object.entries(intervention.workPerformed)
       .filter(([key, value]) => value && key !== "outros")
       .map(([key]) => key)
       .slice(0, 3)
       .join(", ") || "Verificação geral"
   }
   ${intervention.problems.length > 0 ? `Problemas: ${intervention.problems.length}` : ""}`,
    )
    .join("\n") || "Nenhuma intervenção registada"
}

${
  maintenance.observations
    ? `
📝 OBSERVAÇÕES GERAIS

${maintenance.observations}
`
    : ""
}

━━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 CONTACTO
Leirisonda - Manutenção de Piscinas
Email: info@leirisonda.pt
Telefone: [Inserir contacto]

Relatório gerado em: ${reportDate}

© ${new Date().getFullYear()} Leirisonda - Todos os direitos reservados.
      `.trim();
    }
  };

  const generateHTMLReport = () => {
    // Generate modern HTML report with enhanced layout and photos
    const reportDate = format(new Date(), "dd/MM/yyyy", { locale: pt });
    const content = intervention
      ? createInterventionContent()
      : createMaintenanceContent();

    return `
<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Manutenção - ${maintenance.poolName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.5;
      color: #1a202c;
      background: #ffffff;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 210mm;
      margin: 0 auto;
      background: #ffffff;
      min-height: 297mm;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }

    .header {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      color: white;
      padding: 40px 30px;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 100px;
      height: 100px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .logo {
      height: 65px;
      width: auto;
      background: white;
      padding: 12px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .company-info h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .company-info .tagline {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 400;
    }

    .header-meta {
      text-align: right;
      background: rgba(255,255,255,0.15);
      padding: 15px;
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }

    .header-meta .date {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .header-meta .ref {
      font-size: 12px;
      opacity: 0.8;
    }

    .report-title {
      text-align: center;
      border-top: 2px solid rgba(255,255,255,0.3);
      padding-top: 20px;
      position: relative;
      z-index: 2;
    }

    .report-title h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .report-title .subtitle {
      font-size: 18px;
      font-weight: 400;
      opacity: 0.95;
      margin-bottom: 5px;
    }

    .report-title .location {
      font-size: 16px;
      opacity: 0.9;
    }

    .content {
      padding: 40px 30px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .info-card {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      border-left: 4px solid #0ea5e9;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .info-card .label {
      font-size: 12px;
      font-weight: 600;
      color: #0ea5e9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .info-card .value {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
    }

    .maintenance-content {
      background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%);
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      position: relative;
      overflow: hidden;
    }

    .maintenance-content::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #0ea5e9, #06b6d4);
    }

    .maintenance-content .content-text {
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.6;
      color: #2d3748;
      font-weight: 400;
    }

    /* Enhanced Section Styling */
    .section {
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      page-break-inside: avoid;
    }

    .section-header {
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }

    .section-content {
      padding: 16px;
    }

    /* Data Item Styling */
    .data-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid #f7fafc;
    }

    .data-item:last-child {
      border-bottom: none;
    }

    .data-item .label {
      font-weight: 500;
      color: #4a5568;
      flex: 0 0 40%;
    }

    .data-item .value {
      font-weight: 600;
      color: #1a202c;
      flex: 1;
      text-align: right;
    }

    /* Grid Layouts */
    .info-grid, .pool-info-grid, .client-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .pool-detail, .client-detail {
      background: #f8fafc;
      padding: 10px;
      border-radius: 6px;
      border-left: 3px solid #3182ce;
    }

    .pool-detail .label, .client-detail .label {
      font-size: 11px;
      font-weight: 600;
      color: #3182ce;
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
    }

    .pool-detail .value, .client-detail .value {
      font-size: 13px;
      font-weight: 600;
      color: #1a202c;
    }

    /* Water Analysis Grid */
    .water-analysis-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .water-param {
      background: linear-gradient(135deg, #ebf8ff 0%, #ffffff 100%);
      border: 1px solid #3182ce;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }

    .param-label {
      font-size: 11px;
      font-weight: 600;
      color: #3182ce;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .param-value {
      font-size: 16px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 4px;
    }

    .param-range {
      font-size: 10px;
      color: #718096;
      font-style: italic;
    }

    /* Water Quality Status */
    .water-quality-summary {
      background: #f7fafc;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      font-size: 14px;
      margin-top: 12px;
    }

    .quality-excellent {
      background: #f0fff4;
      border: 1px solid #9ae6b4;
      color: #276749;
    }

    .quality-acceptable {
      background: #fffbeb;
      border: 1px solid #fbd38d;
      color: #b45309;
    }

    .quality-poor {
      background: #fed7d7;
      border: 1px solid #fc8181;
      color: #c53030;
    }

    /* Statistics Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .stat-item {
      background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%);
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      border-left: 4px solid #3182ce;
    }

    .stat-number {
      font-size: 20px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 11px;
      color: #718096;
      font-weight: 500;
    }

    /* Work Grid */
    .work-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }

    .work-item {
      display: flex;
      align-items: center;
      background: #f0fff4;
      border: 1px solid #9ae6b4;
      border-radius: 6px;
      padding: 8px;
      font-size: 12px;
    }

    .work-item.completed .work-icon {
      color: #38a169;
      font-weight: bold;
      margin-right: 8px;
    }

    .work-text {
      color: #276749;
      font-weight: 500;
    }

    .additional-work {
      background: #ebf8ff;
      border: 1px solid #90cdf4;
      border-radius: 6px;
      padding: 10px;
      font-size: 12px;
      color: #2b6cb0;
      margin-top: 8px;
    }

    /* Problem Cards */
    .problem-card {
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
    }

    .problem-card.resolved {
      background: #f0fff4;
      border-color: #9ae6b4;
    }

    .problem-card.pending {
      background: #fffbeb;
      border-color: #fbd38d;
    }

    .problem-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .problem-header h4 {
      font-size: 13px;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
      flex: 1;
    }

    .severity-badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .severity-high {
      background: #fed7d7;
      color: #c53030;
    }

    .severity-medium {
      background: #fbd38d;
      color: #b45309;
    }

    .severity-low {
      background: #c6f6d5;
      color: #276749;
    }

    .status-badge {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .status-badge.resolved {
      background: #c6f6d5;
      color: #276749;
    }

    .status-badge.pending {
      background: #fbd38d;
      color: #b45309;
    }

    .solution-text {
      margin-top: 8px;
      font-size: 12px;
      color: #4a5568;
      font-style: italic;
    }

    /* Photos Grid */
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 12px;
    }

    .photo-item {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .photo-container {
      width: 100%;
      height: 80px;
      overflow: hidden;
      background: #edf2f7;
    }

    .photo-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-info {
      padding: 6px;
    }

    .photo-description {
      font-size: 10px;
      font-weight: 500;
      color: #2d3748;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .photo-category {
      font-size: 9px;
      color: #3182ce;
      font-weight: 600;
      text-transform: uppercase;
    }

    .photo-date {
      font-size: 9px;
      color: #718096;
      margin-top: 2px;
    }

    .photos-summary {
      font-size: 11px;
      color: #4a5568;
      text-align: center;
      padding: 8px;
      background: #f7fafc;
      border-radius: 4px;
    }

    /* Enhanced Table Styling */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-bottom: 8px;
    }

    .data-table th {
      background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
      color: white;
      padding: 6px 4px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
    }

    .data-table td {
      padding: 5px 4px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
    }

    .data-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .data-table tr:hover {
      background: #ebf8ff;
    }

    .table-note {
      font-size: 10px;
      color: #718096;
      text-align: center;
      font-style: italic;
      margin-top: 8px;
    }

    /* Status Classes */
    .status-active {
      color: #276749;
      font-weight: 600;
    }

    .status-inactive {
      color: #b45309;
      font-weight: 600;
    }

    .status-good {
      color: #276749;
    }

    .status-warning {
      color: #b45309;
    }

    /* Observations Box */
    .observations-box {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      font-size: 12px;
      line-height: 1.5;
      color: #2d3748;
    }

    /* Summary Boxes */
    .last-intervention-summary, .next-maintenance-box {
      background: #ebf8ff;
      border: 1px solid #90cdf4;
      border-radius: 6px;
      padding: 10px;
      font-size: 12px;
      color: #2b6cb0;
      margin-top: 12px;
    }

    .next-date {
      font-size: 14px;
      margin-bottom: 6px;
    }

    .next-info {
      font-size: 11px;
      color: #4a5568;
      font-style: italic;
    }

    .footer {
      background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
      color: white;
      padding: 30px;
      margin-top: 40px;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .footer-logo {
      font-size: 22px;
      font-weight: 700;
    }

    .footer-contact {
      text-align: right;
      font-size: 14px;
    }

    .footer-contact .email {
      font-weight: 500;
      margin-bottom: 3px;
    }

    .footer-contact .website {
      opacity: 0.9;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 15px;
      text-align: center;
      font-size: 12px;
      opacity: 0.8;
    }

    @media print {
      body { background: white; }
      .container { box-shadow: none; }
    }

    @page {
      margin: 0;
      size: A4;
    }

    .footer-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .footer h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .footer p {
      margin-bottom: 8px;
      opacity: 0.9;
    }

    .footer-note {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.2);
      font-size: 12px;
      opacity: 0.7;
    }

    .emoji {
      font-size: 20px;
      margin-right: 8px;
    }

    @media print {
      body { background: white; }
      .container { box-shadow: none; }
      .no-print { display: none !important; }
      .maintenance-content { break-inside: avoid; }
      .header { break-after: avoid; }
    }

    @page {
      margin: 0;
      size: A4;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <div class="logo-section">
          <img src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800" alt="Logótipo Leirisonda" class="logo" />
          <div class="company-info">
            <h1>Leirisonda</h1>
            <div class="tagline">Gestão de Obras e Manutenção</div>
          </div>
        </div>
        <div class="header-meta">
          <div class="date">Data: ${reportDate}</div>
          <div class="ref">REF: ${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}</div>
        </div>
      </div>

      <div class="report-title">
        <h2>Relatório de Manutenção de Piscina</h2>
        <div class="subtitle">${maintenance.poolName}</div>
        <div class="subtitle">Cliente: ${maintenance.clientName}</div>
        <div class="location">${maintenance.location}</div>
      </div>
    </div>

    <div class="content">
      <div class="info-grid">
        <div class="info-card">
          <div class="label">Data do Relatório</div>
          <div class="value">${reportDate}</div>
        </div>
        <div class="info-card">
          <div class="label">Tipo de Piscina</div>
          <div class="value">${getPoolTypeLabel(maintenance.poolType)}</div>
        </div>
        <div class="info-card">
          <div class="label">Cubicagem de Água</div>
          <div class="value">${maintenance.waterCubicage || "N/A"}</div>
        </div>
      </div>

      <div class="maintenance-content">
        ${content}
      </div>
    </div>

    <div class="footer">
      <div class="footer-content">
        <div class="footer-logo">Leirisonda</div>
        <div class="footer-contact">
          <div class="email">info@leirisonda.pt</div>
          <div class="website">www.leirisonda.pt</div>
        </div>
      </div>
      <div class="footer-bottom">
        © ${new Date().getFullYear()} Leirisonda - Sistema Profissional de Gestão de Obras e Manutenção
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  };

  const generatePDFReport = async (shareMethod?: string) => {
    setIsGenerating(true);

    try {
      const reportDate = format(new Date(), "dd/MM/yyyy", { locale: pt });
      const interventionDate = intervention
        ? format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })
        : reportDate;

      // Create structured content for PDF
      const reportContent = intervention
        ? createInterventionContent()
        : createMaintenanceContent();

      const pdfData = {
        type: "maintenance" as const,
        title: intervention
          ? `Relatório de Intervenção - ${maintenance.poolName}`
          : `Relatório de Manutenção - ${maintenance.poolName}`,
        subtitle: `Cliente: ${maintenance.clientName} • ${maintenance.location}`,
        date: interventionDate,
        content: reportContent,
        additionalInfo: `Tipo: ${getPoolTypeLabel(maintenance.poolType)} • Cubicagem: ${maintenance.waterCubicage || "N/A"}`,
      };

      const htmlContent = generateHTMLReport();

      const filename = intervention
        ? `intervencao-${maintenance.poolName.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`
        : `manutencao-${maintenance.poolName.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`;

      if (shareMethod) {
        // Generate PDF blob for sharing
        const pdfBlob = await PDFGenerator.generatePDFFromHTML(htmlContent, {
          title: pdfData.title,
          filename: filename,
          orientation: "portrait",
        });

        await handlePDFShare(shareMethod, pdfBlob, pdfData.title, filename);
      } else {
        // Direct download
        await PDFGenerator.downloadPDF(htmlContent, {
          title: pdfData.title,
          filename: filename,
          orientation: "portrait",
        });
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("❌ Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePDFShare = async (
    method: string,
    pdfBlob: Blob,
    title: string,
    filename: string,
  ) => {
    try {
      switch (method) {
        case "email":
          // Create mailto with PDF attachment (note: most email clients don't support blob attachments directly)
          const emailSubject = encodeURIComponent(title);
          const emailBody = encodeURIComponent(
            `Segue em anexo o relatório de manutenção.\n\n` +
              `Cliente: ${maintenance.clientName}\n` +
              `Piscina: ${maintenance.poolName}\n` +
              `Localização: ${maintenance.location}\n\n` +
              `Este relatório foi gerado automaticamente pelo sistema Leirisonda.\n\n` +
              `Cumprimentos,\nEquipa Leirisonda`,
          );

          // For email, we'll download the PDF and let user attach manually
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);

          // Then open email client
          setTimeout(() => {
            window.open(
              `mailto:${maintenance.clientEmail || ""}?subject=${emailSubject}&body=${emailBody}`,
              "_blank",
            );
          }, 500);
          break;

        case "whatsapp":
          // Download PDF first, then open WhatsApp
          const whatsappUrl = URL.createObjectURL(pdfBlob);
          const whatsappLink = document.createElement("a");
          whatsappLink.href = whatsappUrl;
          whatsappLink.download = filename;
          whatsappLink.click();
          URL.revokeObjectURL(whatsappUrl);

          const whatsappText = encodeURIComponent(
            `📄 Relatório de Manutenção - ${maintenance.poolName}\n\n` +
              `Cliente: ${maintenance.clientName}\n` +
              `Localização: ${maintenance.location}\n\n` +
              `Relatório em PDF descarregado. ` +
              `Gerado automaticamente pelo sistema Leirisonda.`,
          );

          setTimeout(() => {
            window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
          }, 500);
          break;

        case "copy":
          // Copy summary to clipboard and download PDF
          const copyUrl = URL.createObjectURL(pdfBlob);
          const copyLink = document.createElement("a");
          copyLink.href = copyUrl;
          copyLink.download = filename;
          copyLink.click();
          URL.revokeObjectURL(copyUrl);

          const summaryText = `📄 Relatório: ${title}\nCliente: ${maintenance.clientName}\nPiscina: ${maintenance.poolName}\nLocalização: ${maintenance.location}\n\nRelatório PDF descarregado automaticamente.`;
          await navigator.clipboard.writeText(summaryText);
          alert("📋 Resumo copiado e PDF descarregado!");
          break;

        case "download":
        default:
          // Direct download
          const downloadUrl = URL.createObjectURL(pdfBlob);
          const downloadLink = document.createElement("a");
          downloadLink.href = downloadUrl;
          downloadLink.download = filename;
          downloadLink.click();
          URL.revokeObjectURL(downloadUrl);
          break;
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      alert("�� Erro ao partilhar PDF. O ficheiro foi descarregado.");
    }
  };
  const createInterventionContent = () => {
    if (!intervention) return "";

    // Get all work performed labels
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

    // Get water quality status with color coding
    const getWaterQualityColor = (waterValues: any) => {
      const ph = waterValues.ph;
      const chlorine = waterValues.chlorine;
      if (ph >= 7.0 && ph <= 7.4 && chlorine >= 1.0 && chlorine <= 2.0) {
        return "success";
      } else if (ph >= 6.8 && ph <= 7.6 && chlorine >= 0.8 && chlorine <= 2.5) {
        return "warning";
      }
      return "danger";
    };

    const waterQualityColor = getWaterQualityColor(intervention.waterValues);
    const waterQualityClass =
      waterQualityColor === "success"
        ? "quality-excellent"
        : waterQualityColor === "warning"
          ? "quality-acceptable"
          : "quality-poor";

    return `
      <div class="section">
        <div class="section-header">
          <div class="section-title">📅 Informações da Intervenção</div>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="data-item">
              <span class="label">Data:</span>
              <span class="value">${format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })}</span>
            </div>
            <div class="data-item">
              <span class="label">Horário:</span>
              <span class="value">${intervention.timeStart} - ${intervention.timeEnd}</span>
            </div>
            <div class="data-item">
              <span class="label">Duração:</span>
              <span class="value">${calculateDuration(intervention.timeStart, intervention.timeEnd)}</span>
            </div>
          </div>
          <div class="data-item">
            <span class="label">Técnicos Responsáveis:</span>
            <span class="value">${intervention.technicians.join(", ")}</span>
          </div>
          ${
            intervention.vehicles.length > 0
              ? `<div class="data-item">
              <span class="label">Viaturas Utilizadas:</span>
              <span class="value">${intervention.vehicles.join(", ")}</span>
            </div>`
              : ""
          }
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-title">🧪 Análise Completa da Água</div>
        </div>
        <div class="section-content">
          <div class="water-analysis-grid">
            <div class="water-param">
              <div class="param-label">pH</div>
              <div class="param-value">${intervention.waterValues.ph || "N/A"}</div>
              <div class="param-range">Ideal: 7.0-7.4</div>
            </div>
            <div class="water-param">
              <div class="param-label">Cloro</div>
              <div class="param-value">${intervention.waterValues.chlorine || "N/A"} ppm</div>
              <div class="param-range">Ideal: 1.0-2.0 ppm</div>
            </div>
            <div class="water-param">
              <div class="param-label">Temperatura</div>
              <div class="param-value">${intervention.waterValues.temperature || "N/A"}°C</div>
              <div class="param-range">Conforto: 24-28°C</div>
            </div>
            <div class="water-param">
              <div class="param-label">Sal</div>
              <div class="param-value">${intervention.waterValues.salt || "N/A"} gr/lt</div>
              <div class="param-range">Piscina salgada: 3000-4000 gr/lt</div>
            </div>
            ${
              intervention.waterValues.bromine
                ? `
            <div class="water-param">
              <div class="param-label">Bromo</div>
              <div class="param-value">${intervention.waterValues.bromine} ppm</div>
              <div class="param-range">Ideal: 2-4 ppm</div>
            </div>`
                : ""
            }
            ${
              intervention.waterValues.alkalinity
                ? `
            <div class="water-param">
              <div class="param-label">Alcalinidade</div>
              <div class="param-value">${intervention.waterValues.alkalinity} ppm</div>
              <div class="param-range">Ideal: 80-120 ppm</div>
            </div>`
                : ""
            }
            ${
              intervention.waterValues.hardness
                ? `
            <div class="water-param">
              <div class="param-label">Dureza</div>
              <div class="param-value">${intervention.waterValues.hardness} ppm</div>
              <div class="param-range">Ideal: 150-300 ppm</div>
            </div>`
                : ""
            }
            ${
              intervention.waterValues.stabilizer
                ? `
            <div class="water-param">
              <div class="param-label">Estabilizador</div>
              <div class="param-value">${intervention.waterValues.stabilizer} ppm</div>
              <div class="param-range">Ideal: 30-50 ppm</div>
            </div>`
                : ""
            }
          </div>

          <div class="water-quality-summary ${waterQualityClass}">
            <strong>Avaliação Geral da Água:</strong> ${getWaterQualityStatus(intervention.waterValues)}
          </div>
        </div>
      </div>

      ${
        intervention.chemicalProducts.length > 0
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">🧴 Produtos Químicos Aplicados</div>
          </div>
          <div class="section-content">
            <div class="products-table">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                    <th>Finalidade</th>
                  </tr>
                </thead>
                <tbody>
                  ${intervention.chemicalProducts
                    .map(
                      (product) => `
                    <tr>
                      <td><strong>${product.productName}</strong></td>
                      <td>${product.quantity}</td>
                      <td>${product.unit}</td>
                      <td>${getProductPurpose(product.productName)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `
          : ""
      }

      ${
        Object.values(intervention.workPerformed).some((v) => v)
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">🔧 Trabalho Realizado</div>
          </div>
          <div class="section-content">
            <div class="work-grid">
              ${Object.entries(intervention.workPerformed)
                .filter(([key, value]) => value && key !== "outros")
                .map(
                  ([key]) => `
                  <div class="work-item completed">
                    <span class="work-icon">✓</span>
                    <span class="work-text">${workLabels[key as keyof typeof workLabels] || key}</span>
                  </div>
                `,
                )
                .join("")}
            </div>
            ${
              intervention.workPerformed.outros
                ? `<div class="additional-work">
                <strong>Trabalho Adicional:</strong><br>
                ${intervention.workPerformed.outros}
              </div>`
                : ""
            }
          </div>
        </div>
      `
          : ""
      }

      ${
        intervention.problems.length > 0
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">⚠️ Problemas Identificados e Soluções</div>
          </div>
          <div class="section-content">
            ${intervention.problems
              .map(
                (problem) => `
              <div class="problem-card ${problem.resolved ? "resolved" : "pending"}">
                <div class="problem-header">
                  <h4>${problem.description}</h4>
                  <span class="severity-badge severity-${problem.severity}">
                    ${
                      problem.severity === "high"
                        ? "Alta"
                        : problem.severity === "medium"
                          ? "Média"
                          : "Baixa"
                    } Prioridade
                  </span>
                </div>
                <div class="problem-status">
                  <span class="status-badge ${problem.resolved ? "resolved" : "pending"}">
                    ${problem.resolved ? "✅ Resolvido" : "🔄 Pendente"}
                  </span>
                  ${
                    problem.resolved && problem.solution
                      ? `<div class="solution-text">
                      <strong>Solução Aplicada:</strong> ${problem.solution}
                    </div>`
                      : ""
                  }
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      ${
        intervention.photos && intervention.photos.length > 0
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">📸 Registo Fotográfico da Intervenção</div>
          </div>
          <div class="section-content">
            <div class="photos-grid">
              ${intervention.photos
                .map(
                  (photo) => `
                <div class="photo-item">
                  <div class="photo-container">
                    <img src="${photo.url}" alt="${photo.description || photo.filename}" />
                  </div>
                  <div class="photo-info">
                    <div class="photo-description">${photo.description || "Sem descrição"}</div>
                    <div class="photo-date">${format(new Date(photo.uploadedAt), "dd/MM/yyyy HH:mm", { locale: pt })}</div>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="photos-summary">
              <strong>Total de fotos:</strong> ${intervention.photos.length}
            </div>
          </div>
        </div>
      `
          : ""
      }

      ${
        intervention.observations
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">📝 Observações Técnicas</div>
          </div>
          <div class="section-content">
            <div class="observations-box">
              ${intervention.observations.replace(/\n/g, "<br>")}
            </div>
          </div>
        </div>
      `
          : ""
      }

      ${
        intervention.nextMaintenanceDate
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">📅 Próxima Manutenção Programada</div>
          </div>
          <div class="section-content">
            <div class="next-maintenance-box">
              <div class="next-date">
                <strong>Data Recomendada:</strong> ${format(new Date(intervention.nextMaintenanceDate), "dd/MM/yyyy", { locale: pt })}
              </div>
              <div class="next-info">
                A próxima manutenção foi programada baseada nas condições atuais da piscina e nos resultados desta intervenção.
              </div>
            </div>
          </div>
        </div>
      `
          : ""
      }
    `;
  };

  // Helper function to calculate duration
  const calculateDuration = (start: string, end: string) => {
    try {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      const diff = endTime.getTime() - startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
    } catch {
      return "N/A";
    }
  };

  // Helper function to determine product purpose
  const getProductPurpose = (productName: string) => {
    const purposes: { [key: string]: string } = {
      cloro: "Desinfeção",
      acid: "Correção pH",
      algicida: "Prevenção algas",
      floculante: "Clarificação",
      alcalinizante: "Correção alcalinidade",
      sal: "Eletrólise salina",
      antiespuma: "Controlo espuma",
      choque: "Tratamento choque",
    };

    const lowerName = productName.toLowerCase();
    for (const [key, purpose] of Object.entries(purposes)) {
      if (lowerName.includes(key)) {
        return purpose;
      }
    }
    return "Tratamento geral";
  };

  const createMaintenanceContent = () => {
    const totalInterventions = maintenance.interventions?.length || 0;
    const pendingProblems =
      maintenance.interventions
        ?.flatMap((i) => i.problems)
        .filter((p) => !p.resolved).length || 0;
    const resolvedProblems =
      maintenance.interventions
        ?.flatMap((i) => i.problems)
        .filter((p) => p.resolved).length || 0;

    // Get last intervention data
    const lastIntervention =
      maintenance.interventions && maintenance.interventions.length > 0
        ? maintenance.interventions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )[0]
        : null;

    // Calculate detailed statistics
    const totalPoolPhotos = maintenance.photos?.length || 0;
    const totalInterventionPhotos =
      maintenance.interventions?.reduce(
        (sum, int) => sum + (int.photos?.length || 0),
        0,
      ) || 0;

    const totalChemicalProducts =
      maintenance.interventions?.reduce(
        (sum, int) => sum + int.chemicalProducts.length,
        0,
      ) || 0;

    const totalWorkTime =
      maintenance.interventions?.reduce((sum, int) => {
        try {
          const start = new Date(`2000-01-01 ${int.timeStart}`);
          const end = new Date(`2000-01-01 ${int.timeEnd}`);
          const diff = end.getTime() - start.getTime();
          return sum + diff;
        } catch {
          return sum;
        }
      }, 0) || 0;

    const averageWorkTimeHours =
      totalInterventions > 0
        ? Math.round(
            (totalWorkTime / (1000 * 60 * 60) / totalInterventions) * 10,
          ) / 10
        : 0;

    // Most common technicians
    const technicianCount =
      maintenance.interventions?.reduce(
        (acc, int) => {
          int.technicians.forEach((tech) => {
            acc[tech] = (acc[tech] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>,
      ) || {};

    const topTechnicians = Object.entries(technicianCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => `${name} (${count}x)`)
      .join(", ");

    // Water quality trends
    const waterTrends =
      maintenance.interventions
        ?.filter((int) => int.waterValues.ph && int.waterValues.chlorine)
        .slice(-5)
        .map((int) => ({
          date: format(new Date(int.date), "dd/MM", { locale: pt }),
          ph: int.waterValues.ph,
          chlorine: int.waterValues.chlorine,
          quality: getWaterQualityStatus(int.waterValues),
        })) || [];

    return `
      <div class="section">
        <div class="section-header">
          <div class="section-title">🏊 Informações Completas da Piscina</div>
        </div>
        <div class="section-content">
          <div class="pool-info-grid">
            <div class="pool-detail">
              <span class="label">Nome da Piscina:</span>
              <span class="value">${maintenance.poolName}</span>
            </div>
            <div class="pool-detail">
              <span class="label">Tipo:</span>
              <span class="value">${getPoolTypeLabel(maintenance.poolType)}</span>
            </div>
            <div class="pool-detail">
              <span class="label">Cubicagem de Água:</span>
              <span class="value">${maintenance.waterCubicage || "Não especificado"}</span>
            </div>
            <div class="pool-detail">
              <span class="label">Estado:</span>
              <span class="value ${maintenance.status === "active" ? "status-active" : "status-inactive"}">
                ${
                  maintenance.status === "active"
                    ? "✅ Ativa"
                    : maintenance.status === "inactive"
                      ? "⏸��� Inativa"
                      : "🌻 Sazonal"
                }
              </span>
            </div>
            <div class="pool-detail">
              <span class="label">Localização:</span>
              <span class="value">${maintenance.location}</span>
            </div>
            <div class="pool-detail">
              <span class="label">Data de Criação:</span>
              <span class="value">${format(new Date(maintenance.createdAt), "dd/MM/yyyy", { locale: pt })}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-title">👤 Informações do Cliente</div>
        </div>
        <div class="section-content">
          <div class="client-info-grid">
            <div class="client-detail">
              <span class="label">Nome:</span>
              <span class="value">${maintenance.clientName}</span>
            </div>
            ${
              maintenance.clientPhone
                ? `
            <div class="client-detail">
              <span class="label">Telefone:</span>
              <span class="value">${maintenance.clientPhone}</span>
            </div>`
                : ""
            }
            ${
              maintenance.clientEmail
                ? `
            <div class="client-detail">
              <span class="label">Email:</span>
              <span class="value">${maintenance.clientEmail}</span>
            </div>`
                : ""
            }
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-title">📊 Estatísticas Completas de Manutenção</div>
        </div>
        <div class="section-content">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">${totalInterventions}</div>
              <div class="stat-label">Total de Intervenções</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${pendingProblems}</div>
              <div class="stat-label">Problemas Pendentes</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${resolvedProblems}</div>
              <div class="stat-label">Problemas Resolvidos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${totalPoolPhotos + totalInterventionPhotos}</div>
              <div class="stat-label">Total de Fotos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${totalChemicalProducts}</div>
              <div class="stat-label">Produtos Aplicados</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${averageWorkTimeHours}h</div>
              <div class="stat-label">Tempo Médio/Intervenção</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${Math.round((totalWorkTime / (1000 * 60 * 60)) * 10) / 10}h</div>
              <div class="stat-label">Tempo Total Trabalho</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${waterTrends.filter((w) => w.quality.includes("Excelente")).length}</div>
              <div class="stat-label">Análises Excelentes</div>
            </div>
          </div>

          ${
            topTechnicians
              ? `
          <div class="info-grid">
            <div class="data-item">
              <span class="label">Técnicos Mais Ativos:</span>
              <span class="value">${topTechnicians}</span>
            </div>
          </div>`
              : ""
          }

          ${
            lastIntervention
              ? `
          <div class="last-intervention-summary">
            <strong>Última Intervenção:</strong> ${format(new Date(lastIntervention.date), "dd/MM/yyyy", { locale: pt })}
            (${lastIntervention.timeStart} - ${lastIntervention.timeEnd})
            <br>
            <strong>Técnicos:</strong> ${lastIntervention.technicians.join(", ")}
            <br>
            <strong>Estado da Água:</strong> ${getWaterQualityStatus(lastIntervention.waterValues)}
            <br>
            <strong>Produtos Utilizados:</strong> ${lastIntervention.chemicalProducts.length} produtos
            <br>
            <strong>Problemas:</strong> ${lastIntervention.problems.length} identificados, ${lastIntervention.problems.filter((p) => p.resolved).length} resolvidos
          </div>`
              : ""
          }

          ${
            waterTrends.length > 0
              ? `
          <div class="section">
            <div class="section-header">
              <div class="section-title">📈 Tendência da Qualidade da Água (Últimas 5 Análises)</div>
            </div>
            <div class="section-content">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>pH</th>
                    <th>Cloro (ppm)</th>
                    <th>Avaliação</th>
                  </tr>
                </thead>
                <tbody>
                  ${waterTrends
                    .map(
                      (trend) => `
                    <tr>
                      <td>${trend.date}</td>
                      <td>${trend.ph}</td>
                      <td>${trend.chlorine}</td>
                      <td class="status-${trend.quality.includes("Excelente") ? "good" : trend.quality.includes("Aceitável") ? "warning" : "danger"}">
                        ${trend.quality}
                      </td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>`
              : ""
          }
        </div>
      </div>

      ${
        maintenance.interventions && maintenance.interventions.length > 0
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">📋 Histórico Completo de Intervenções (Todas as ${totalInterventions} Intervenções)</div>
          </div>
          <div class="section-content">
            ${maintenance.interventions
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map(
                (int, index) => `
                <div class="intervention-detail-card" style="margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; page-break-inside: avoid;">
                  <div class="intervention-header" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
                    <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #2d3748;">
                      Intervenção #${totalInterventions - index} - ${format(new Date(int.date), "dd/MM/yyyy", { locale: pt })}
                    </h4>
                    <div style="font-size: 12px; color: #4a5568; margin-top: 4px;">
                      ${int.timeStart} - ${int.timeEnd} • Técnicos: ${int.technicians.join(", ")}
                      ${int.vehicles.length > 0 ? ` • Viaturas: ${int.vehicles.join(", ")}` : ""}
                    </div>
                  </div>

                  <div class="intervention-content" style="padding: 16px;">
                    <!-- Análise da Água -->
                    <div class="water-analysis-mini" style="margin-bottom: 12px;">
                      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 8px;">
                        <div style="background: #f7fafc; padding: 6px; border-radius: 4px; text-align: center; font-size: 11px;">
                          <div style="font-weight: 600; color: #3182ce;">pH</div>
                          <div style="font-weight: 700;">${int.waterValues.ph || "N/A"}</div>
                        </div>
                        <div style="background: #f7fafc; padding: 6px; border-radius: 4px; text-align: center; font-size: 11px;">
                          <div style="font-weight: 600; color: #3182ce;">Cloro</div>
                          <div style="font-weight: 700;">${int.waterValues.chlorine || "N/A"} ppm</div>
                        </div>
                        <div style="background: #f7fafc; padding: 6px; border-radius: 4px; text-align: center; font-size: 11px;">
                          <div style="font-weight: 600; color: #3182ce;">Temp.</div>
                          <div style="font-weight: 700;">${int.waterValues.temperature || "N/A"}°C</div>
                        </div>
                        <div style="background: #f7fafc; padding: 6px; border-radius: 4px; text-align: center; font-size: 11px;">
                          <div style="font-weight: 600; color: #3182ce;">Sal</div>
                          <div style="font-weight: 700;">${int.waterValues.salt || "N/A"} gr/lt</div>
                        </div>
                      </div>
                      <div style="text-align: center; font-size: 11px; padding: 4px; background: ${
                        getWaterQualityStatus(int.waterValues).includes(
                          "Excelente",
                        )
                          ? "#f0fff4"
                          : getWaterQualityStatus(int.waterValues).includes(
                                "Aceitável",
                              )
                            ? "#fffbeb"
                            : "#fed7d7"
                      }; border-radius: 4px;">
                        <strong>Estado:</strong> ${getWaterQualityStatus(int.waterValues)}
                      </div>
                    </div>

                    <!-- Trabalho Realizado -->
                    ${
                      Object.values(int.workPerformed).some((v) => v)
                        ? `
                    <div class="work-performed-mini" style="margin-bottom: 12px;">
                      <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #2d3748;">🔧 Trabalho Realizado:</div>
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; font-size: 10px;">
                        ${Object.entries(int.workPerformed)
                          .filter(([key, value]) => value && key !== "outros")
                          .map(
                            ([key]) => `
                            <div style="background: #f0fff4; padding: 4px 6px; border-radius: 3px; border: 1px solid #9ae6b4;">
                              ✓ ${workLabels[key as keyof typeof workLabels] || key}
                            </div>
                          `,
                          )
                          .join("")}
                      </div>
                      ${
                        int.workPerformed.outros
                          ? `
                      <div style="margin-top: 6px; font-size: 11px; background: #ebf8ff; padding: 6px; border-radius: 4px;">
                        <strong>Adicional:</strong> ${int.workPerformed.outros}
                      </div>`
                          : ""
                      }
                    </div>`
                        : ""
                    }

                    <!-- Produtos Químicos -->
                    ${
                      int.chemicalProducts.length > 0
                        ? `
                    <div class="products-mini" style="margin-bottom: 12px;">
                      <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #2d3748;">🧴 Produtos Aplicados:</div>
                      <div style="display: grid; gap: 4px; font-size: 10px;">
                        ${int.chemicalProducts
                          .map(
                            (product) => `
                            <div style="background: #fff7ed; padding: 4px 6px; border-radius: 3px; border: 1px solid #fed7aa; display: flex; justify-content: space-between;">
                              <span>${product.productName}</span>
                              <span><strong>${product.quantity}${product.unit}</strong></span>
                            </div>
                          `,
                          )
                          .join("")}
                      </div>
                    </div>`
                        : ""
                    }

                    <!-- Problemas -->
                    ${
                      int.problems.length > 0
                        ? `
                    <div class="problems-mini" style="margin-bottom: 12px;">
                      <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #2d3748;">⚠️ Problemas (${int.problems.length}):</div>
                      ${int.problems
                        .map(
                          (problem) => `
                        <div style="background: ${problem.resolved ? "#f0fff4" : "#fffbeb"}; padding: 6px; border-radius: 4px; border: 1px solid ${problem.resolved ? "#9ae6b4" : "#fbd38d"}; margin-bottom: 4px; font-size: 10px;">
                          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                            <span style="font-weight: 500;">${problem.description}</span>
                            <span style="font-size: 9px; font-weight: 600; color: ${
                              problem.severity === "high"
                                ? "#c53030"
                                : problem.severity === "medium"
                                  ? "#b45309"
                                  : "#276749"
                            };">
                              ${problem.severity === "high" ? "ALTA" : problem.severity === "medium" ? "MÉDIA" : "BAIXA"}
                            </span>
                          </div>
                          <div style="font-weight: 600; color: ${problem.resolved ? "#276749" : "#b45309"};">
                            ${problem.resolved ? "✅ RESOLVIDO" : "🔄 PENDENTE"}
                          </div>
                        </div>
                      `,
                        )
                        .join("")}
                    </div>`
                        : ""
                    }

                    <!-- Fotos -->
                    ${
                      int.photos && int.photos.length > 0
                        ? `
                    <div class="photos-mini" style="margin-bottom: 12px;">
                      <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #2d3748;">📸 Fotos (${int.photos.length}):</div>
                      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
                        ${int.photos
                          .slice(0, 4)
                          .map(
                            (photo) => `
                          <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden;">
                            <div style="width: 100%; height: 40px; background: #edf2f7; position: relative;">
                              <img src="${photo.url}" alt="${photo.description || "Foto"}" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                            <div style="padding: 2px 4px; font-size: 8px; color: #4a5568; text-align: center;">
                              ${photo.description ? photo.description.substring(0, 20) + (photo.description.length > 20 ? "..." : "") : "Sem descrição"}
                            </div>
                          </div>
                        `,
                          )
                          .join("")}
                      </div>
                      ${
                        int.photos.length > 4
                          ? `
                      <div style="text-align: center; font-size: 10px; color: #4a5568; margin-top: 4px;">
                        ... e mais ${int.photos.length - 4} fotos
                      </div>`
                          : ""
                      }
                    </div>`
                        : ""
                    }

                    <!-- Observações -->
                    ${
                      int.observations
                        ? `
                    <div class="observations-mini">
                      <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #2d3748;">📝 Observações:</div>
                      <div style="background: #f7fafc; padding: 6px; border-radius: 4px; font-size: 10px; color: #2d3748; line-height: 1.4;">
                        ${int.observations}
                      </div>
                    </div>`
                        : ""
                    }

                    <!-- Próxima Manutenção -->
                    ${
                      int.nextMaintenanceDate
                        ? `
                    <div style="margin-top: 8px; background: #ebf8ff; padding: 6px; border-radius: 4px; font-size: 10px; text-align: center;">
                      <strong>Próxima manutenção recomendada:</strong> ${format(new Date(int.nextMaintenanceDate), "dd/MM/yyyy", { locale: pt })}
                    </div>`
                        : ""
                    }
                  </div>
                </div>
              `,
              )
              .join("")}
                </tbody>
              </table>
            </div>
            ${
              maintenance.interventions.length > 10
                ? `<div class="table-note">Mostrando as últimas 10 intervenções de ${totalInterventions} no total.</div>`
                : ""
            }
          </div>
        </div>
      `
          : ""
      }

      ${
        maintenance.photos && maintenance.photos.length > 0
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">📸 Galeria de Fotos da Piscina</div>
          </div>
          <div class="section-content">
            <div class="photos-grid">
              ${maintenance.photos
                .slice(0, 8) // Limit to 8 photos for space
                .map(
                  (photo) => `
                <div class="photo-item">
                  <div class="photo-container">
                    <img src="${photo.url}" alt="${photo.description || photo.filename}" />
                  </div>
                  <div class="photo-info">
                    <div class="photo-description">${photo.description || "Sem descrição"}</div>
                    <div class="photo-category">${
                      photo.category
                        ? photo.category === "general"
                          ? "Geral"
                          : photo.category === "equipment"
                            ? "Equipamentos"
                            : photo.category === "issues"
                              ? "Problemas"
                              : photo.category === "before"
                                ? "Antes"
                                : photo.category === "after"
                                  ? "Depois"
                                  : photo.category
                        : "Geral"
                    }</div>
                    <div class="photo-date">${format(new Date(photo.uploadedAt), "dd/MM/yyyy", { locale: pt })}</div>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="photos-summary">
              <strong>Fotos da piscina:</strong> ${totalPoolPhotos} •
              <strong>Fotos de intervenções:</strong> ${totalInterventionPhotos}
              ${maintenance.photos.length > 8 ? ` • Mostrando 8 de ${maintenance.photos.length} fotos da piscina` : ""}
            </div>
          </div>
        </div>
      `
          : ""
      }

      ${
        maintenance.observations
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">📝 Observações Gerais</div>
          </div>
          <div class="section-content">
            <div class="observations-box">
              ${maintenance.observations.replace(/\n/g, "<br>")}
            </div>
          </div>
        </div>
      `
          : ""
      }

      ${
        pendingProblems > 0
          ? `
        <div class="section">
          <div class="section-header">
            <div class="section-title">⚠️ Problemas Pendentes</div>
          </div>
          <div class="section-content">
            ${maintenance.interventions
              .flatMap((int) => int.problems.filter((p) => !p.resolved))
              .map(
                (problem) => `
              <div class="problem-card pending">
                <div class="problem-text">${problem.description}</div>
                <div class="problem-severity severity-${problem.severity}">
                  ${
                    problem.severity === "high"
                      ? "Alta"
                      : problem.severity === "medium"
                        ? "Média"
                        : "Baixa"
                  } Prioridade
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    `;
  };

  const handleShare = async (method: string) => {
    // Always generate PDF regardless of method
    await generatePDFReport();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Relatório PDF
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Droplets className="mr-2 h-5 w-5 text-cyan-600" />
            Relatório de Manutenção
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 bg-cyan-50 p-3 rounded-lg">
            <strong>Piscina:</strong> {maintenance.poolName}
            <br />
            <strong>Cliente:</strong> {maintenance.clientName}
            {intervention && (
              <>
                <br />
                <strong>Intervenção:</strong>{" "}
                {format(new Date(intervention.date), "dd/MM/yyyy", {
                  locale: pt,
                })}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => generatePDFReport("download")}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>

            <Button
              onClick={() => generatePDFReport("email")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>

            <Button
              onClick={() => generatePDFReport("whatsapp")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>

            <Button
              onClick={() => generatePDFReport("copy")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>
          </div>

          {isGenerating && (
            <div className="text-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
