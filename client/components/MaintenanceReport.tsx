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

  const handleShare = async (method: string) => {
    setIsGenerating(true);

    try {
      const reportContent = generateReportContent();
      const htmlContent = generateHTMLReport();

      switch (method) {
        case "email":
          const emailSubject = intervention
            ? `Relatório de Intervenção - ${maintenance.poolName}`
            : `Relatório de Manutenção - ${maintenance.poolName}`;
          const emailBody = encodeURIComponent(reportContent);
          window.open(
            `mailto:${maintenance.clientEmail}?subject=${emailSubject}&body=${emailBody}`,
            "_blank",
          );
          break;

        case "whatsapp":
          const whatsappText = encodeURIComponent(reportContent);
          window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
          break;

        case "copy":
          await navigator.clipboard.writeText(reportContent);
          alert("📋 Relatório copiado para a área de transferência!");
          break;

        case "download":
          const blob = new Blob([htmlContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `relatorio-manutencao-${maintenance.poolName
            .toLowerCase()
            .replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.html`;
          a.click();
          URL.revokeObjectURL(url);
          break;

        case "print":
          const printWindow = window.open("", "_blank");
          if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
              printWindow.print();
              printWindow.close();
            }, 500);
          }
          break;

        case "pdf":
          // Open in new window optimized for PDF generation
          const pdfWindow = window.open("", "_blank");
          if (pdfWindow) {
            pdfWindow.document.write(htmlContent);
            pdfWindow.document.close();
            pdfWindow.focus();

            // Instructions for PDF generation
            setTimeout(() => {
              alert(
                "Para gerar PDF:\n1. Pressiona Ctrl+P (Cmd+P no Mac)\n2. Escolhe 'Guardar como PDF'\n3. Seleciona 'Mais definições' e ativa 'Gráficos de fundo'\n4. Clica 'Guardar'",
              );
            }, 1000);
          }
          break;
      }
    } catch (error) {
      alert("❌ Erro ao partilhar relatório. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Share className="mr-2 h-4 w-4" />
          Partilhar Relatório
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Droplets className="mr-2 h-5 w-5 text-cyan-600" />
            Partilhar Relatório de Manutenção
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
              onClick={() => handleShare("email")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>

            <Button
              onClick={() => handleShare("whatsapp")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>

            <Button
              onClick={() => handleShare("copy")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>

            <Button
              onClick={() => handleShare("download")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>

            <Button
              onClick={() => handleShare("pdf")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>

            <Button
              onClick={() => handleShare("print")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>

          {isGenerating && (
            <div className="text-center text-sm text-gray-600">
              A gerar relatório...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
