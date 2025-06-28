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
      return "⚠️ Qualidade Aceitável";
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
Sal: ${intervention.waterValues.salt || "N/A"} ppm
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
    .join("\n") || "• Verificação geral"
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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
    // Similar HTML generation as WorkReport but adapted for maintenance
    const reportDate = format(new Date(), "dd/MM/yyyy", { locale: pt });
    const content = generateReportContent();

    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Manutenção - ${maintenance.poolName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f0f9ff;
      font-size: 14px;
    }

    .container {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      min-height: 297mm;
    }

    .header {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      padding: 40px 40px 30px 40px;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 25px;
      position: relative;
    }

    .logo {
      width: 220px;
      height: auto;
      background: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .header-title {
      text-align: center;
      position: relative;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .header h2 {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 15px;
      opacity: 0.95;
    }

    .content {
      padding: 40px;
    }

    .maintenance-content {
      background: #f8fafc;
      border-radius: 12px;
      padding: 30px;
      border: 1px solid #e2e8f0;
      white-space: pre-wrap;
      font-family: 'Inter', monospace;
      font-size: 14px;
      line-height: 1.8;
      color: #374151;
    }

    .footer {
      background: linear-gradient(135deg, #1f2937, #374151);
      color: white;
      padding: 30px;
      text-align: center;
      margin-top: 40px;
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
      <div class="logo-section">
        <img src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800" alt="Leirisonda Logo" class="logo" />
      </div>
      <div class="header-title">
        <h1><span class="emoji">💧</span>Relatório de Manutenção</h1>
        <h2>${maintenance.poolName}</h2>
        <p style="font-size: 16px; opacity: 0.9;">Leirisonda - Manutenção de Piscinas</p>
      </div>
    </div>

    <div class="content">
      <div class="maintenance-content">${content}</div>
    </div>

    <div class="footer">
      <div class="footer-content">
        <h3>📞 Informações de Contacto</h3>
        <p><strong>Leirisonda - Manutenção de Piscinas</strong></p>
        <p>Email: info@leirisonda.pt</p>
        <p>Telefone: [Inserir contacto]</p>
        <p>Website: www.leirisonda.pt</p>
        <div class="footer-note">
          <p>Relatório gerado automaticamente em ${reportDate}</p>
          <p>© ${new Date().getFullYear()} Leirisonda - Todos os direitos reservados</p>
        </div>
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

      const htmlContent = PDFGenerator.createModernReportHTML(pdfData);

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
      alert("❌ Erro ao partilhar PDF. O ficheiro foi descarregado.");
    }
  };
  const createInterventionContent = () => {
    if (!intervention) return "";

    return `
      <div class="section">
        <div class="section-title">📅 Informações da Intervenção</div>
        <p><strong>Data:</strong> ${format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })}</p>
        <p><strong>Horário:</strong> ${intervention.timeStart} - ${intervention.timeEnd}</p>
        <p><strong>Técnicos:</strong> ${intervention.technicians.join(", ")}</p>
        ${intervention.vehicles.length > 0 ? `<p><strong>Viaturas:</strong> ${intervention.vehicles.join(", ")}</p>` : ""}
      </div>

      <div class="section">
        <div class="section-title">🧪 Análise da Água</div>
        <div class="info-grid">
          <div class="info-card">
            <h3>pH</h3>
            <p>${intervention.waterValues.ph || "N/A"}</p>
          </div>
          <div class="info-card">
            <h3>Cloro</h3>
            <p>${intervention.waterValues.chlorine || "N/A"} ppm</p>
          </div>
          <div class="info-card">
            <h3>Temperatura</h3>
            <p>${intervention.waterValues.temperature || "N/A"}°C</p>
          </div>
          <div class="info-card">
            <h3>Sal</h3>
            <p>${intervention.waterValues.salt || "N/A"} ppm</p>
          </div>
        </div>

        <div class="highlight-box">
          <strong>Estado da Água:</strong> ${getWaterQualityStatus(intervention.waterValues)}
        </div>
      </div>

      ${
        intervention.chemicalProducts.length > 0
          ? `
        <div class="section">
          <div class="section-title">🧴 Produtos Químicos Utilizados</div>
          ${intervention.chemicalProducts
            .map(
              (product) => `
            <div class="info-card">
              <h3>${product.productName}</h3>
              <p><strong>Quantidade:</strong> ${product.quantity}</p>
              <p><strong>Observações:</strong> ${product.observations || "Sem observações"}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        Object.values(intervention.workPerformed).some((v) => v)
          ? `
        <div class="section">
          <div class="section-title">🔧 Trabalho Realizado</div>
          <ul>
            ${Object.entries(intervention.workPerformed)
              .filter(([key, value]) => value && key !== "outros")
              .map(([key]) => {
                const labels = {
                  filtros: "Pré-filtro",
                  preFiltero: "Pré-filtro",
                  filtroAreiaVidro: "Filtro Areia/Vidro",
                  alimenta: "Alimenta",
                  aspiracao: "Aspiração",
                  escovagem: "Escovagem",
                  limpezaFiltros: "Limpeza de Filtros",
                  tratamentoAlgas: "Tratamento de Algas",
                };
                return `<li>✓ ${labels[key as keyof typeof labels] || key}</li>`;
              })
              .join("")}
          </ul>
          ${intervention.workPerformed.outros ? `<p><strong>Outros:</strong> ${intervention.workPerformed.outros}</p>` : ""}
        </div>
      `
          : ""
      }

      ${
        intervention.problems.length > 0
          ? `
        <div class="section">
          <div class="section-title">⚠️ Problemas Identificados</div>
          ${intervention.problems
            .map(
              (problem) => `
            <div class="info-card">
              <h3>${problem.description}</h3>
              <p><strong>Prioridade:</strong> ${problem.priority}</p>
              <p><strong>Estado:</strong> ${problem.resolved ? "✅ Resolvido" : "🔄 Pendente"}</p>
              ${problem.solution ? `<p><strong>Solução:</strong> ${problem.solution}</p>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        intervention.observations
          ? `
        <div class="section">
          <div class="section-title">📝 Observações</div>
          <div class="highlight-box">
            ${intervention.observations}
          </div>
        </div>
      `
          : ""
      }

      ${
        intervention.nextMaintenanceDate
          ? `
        <div class="section">
          <div class="section-title">📅 Próxima Manutenção</div>
          <p><strong>Data prevista:</strong> ${format(new Date(intervention.nextMaintenanceDate), "dd/MM/yyyy", { locale: pt })}</p>
        </div>
      `
          : ""
      }
    `;
  };

  const createMaintenanceContent = () => {
    const totalInterventions = maintenance.interventions?.length || 0;
    const pendingProblems =
      maintenance.interventions
        ?.flatMap((i) => i.problems)
        .filter((p) => !p.resolved).length || 0;

    return `
      <div class="section">
        <div class="section-title">📊 Resumo Geral</div>
        <div class="info-grid">
          <div class="info-card">
            <h3>Total de Intervenções</h3>
            <p>${totalInterventions}</p>
          </div>
          <div class="info-card">
            <h3>Problemas Pendentes</h3>
            <p>${pendingProblems}</p>
          </div>
          <div class="info-card">
            <h3>Estado</h3>
            <p>${maintenance.status === "active" ? "✅ Ativo" : "⏸️ Inativo"}</p>
          </div>
        </div>
      </div>

      ${
        maintenance.interventions && maintenance.interventions.length > 0
          ? `
        <div class="section">
          <div class="section-title">📋 Histórico de Intervenções</div>
          ${maintenance.interventions
            .slice(0, 5)
            .map(
              (int) => `
            <div class="info-card">
              <h3>${format(new Date(int.date), "dd/MM/yyyy", { locale: pt })}</h3>
              <p><strong>Técnicos:</strong> ${int.technicians.join(", ")}</p>
              <p><strong>Trabalho:</strong> ${Object.entries(int.workPerformed)
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(", ")}</p>
              ${int.observations ? `<p><strong>Observações:</strong> ${int.observations}</p>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      <div class="section">
        <div class="section-title">🏊 Características da Piscina</div>
        <p><strong>Tipo:</strong> ${getPoolTypeLabel(maintenance.poolType)}</p>
        <p><strong>Cubicagem de Água:</strong> ${maintenance.waterCubicage || "Não especificado"}</p>
        <p><strong>Localização:</strong> ${maintenance.location}</p>
        <p><strong>Cliente:</strong> ${maintenance.clientName}</p>
        ${maintenance.clientEmail ? `<p><strong>Email:</strong> ${maintenance.clientEmail}</p>` : ""}
        ${maintenance.clientPhone ? `<p><strong>Telefone:</strong> ${maintenance.clientPhone}</p>` : ""}
      </div>
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
