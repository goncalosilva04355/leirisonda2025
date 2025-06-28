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
  X,
} from "lucide-react";
import { Work } from "@shared/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFGenerator } from "@/lib/pdf-generator";

interface WorkReportProps {
  work: Work;
  onClose?: () => void;
}

export function WorkReport({ work, onClose }: WorkReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReportContent = () => {
    const reportDate = format(new Date(), "dd/MM/yyyy", { locale: pt });
    const workDate = format(new Date(work.date), "dd/MM/yyyy", { locale: pt });

    return `
🏗️ RELATÓRIO DE OBRA - LEIRISONDA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 INFORMAÇÕES GERAIS

Nome da Obra: ${work.title}
Localização: ${work.location}
Data da Obra: ${workDate}
Estado: ${work.status === "completed" ? "Concluída" : work.status === "in-progress" ? "Em Progresso" : "Pendente"}

👷 EQUIPA

Técnicos: ${work.technicians.join(", ") || "Não especificado"}
Viaturas: ${work.vehicles.join(", ") || "Não especificado"}

🔧 TRABALHO REALIZADO

${work.workPerformed || "Trabalho não especificado"}

💰 INFORMAÇÕES FINANCEIRAS

Valor Orçamentado: ${work.budget ? work.budget.toFixed(2) + "€" : "Não especificado"}
${work.finalCost ? `Valor Final: ${work.finalCost.toFixed(2)}€` : ""}

📝 OBSERVAÇÕES

${work.observations || "Sem observações adicionais"}

${work.workSheetCompleted ? "✅ Folha de obra preenchida" : "❌ Folha de obra por preencher"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 CONTACTO
Leirisonda - Construção e Manutenção
Email: info@leirisonda.pt
Telefone: [Inserir contacto]

Relatório gerado em: ${reportDate}

© ${new Date().getFullYear()} Leirisonda - Todos os direitos reservados.
    `.trim();
  };

  const generateHTMLReport = () => {
    const reportDate = format(new Date(), "dd/MM/yyyy", { locale: pt });
    const workDate = format(new Date(work.date), "dd/MM/yyyy", { locale: pt });

    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Obra - ${work.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.5;
      color: #111827;
      background: #ffffff;
      font-size: 14px;
      font-weight: 400;
    }

    .container {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      min-height: 297mm;
      position: relative;
    }

    .header {
      background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
      color: white;
      padding: 32px 40px;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 200px;
      height: 200px;
      background: rgba(255,255,255,0.08);
      border-radius: 50%;
    }

    .header::after {
      content: '';
      position: absolute;
      bottom: -80px;
      left: -80px;
      width: 160px;
      height: 160px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      position: relative;
      z-index: 2;
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

    .header-subtitle {
      font-size: 16px;
      font-weight: 400;
      opacity: 0.9;
    }

    .content {
      padding: 40px;
    }

    .section {
      margin-bottom: 35px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .section-header {
      background: linear-gradient(to right, #f8fafc, #f1f5f9);
      padding: 20px 25px;
      border-bottom: 1px solid #e2e8f0;
    }

    .section h3 {
      font-size: 18px;
      font-weight: 600;
      color: #0f766e;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-content {
      padding: 25px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-item {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #0d9488;
      transition: all 0.2s ease;
    }

    .info-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .info-label {
      font-weight: 600;
      color: #64748b;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }

    .info-value {
      font-size: 16px;
      font-weight: 500;
      color: #1e293b;
    }

    .status {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status.completed {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #166534;
      border: 1px solid #86efac;
    }

    .status.in-progress {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      color: #1d4ed8;
      border: 1px solid #93c5fd;
    }

    .status.pending {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #92400e;
      border: 1px solid #fbbf24;
    }

    .highlight-box {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border: 1px solid #7dd3fc;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .footer {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 32px;
      text-align: center;
      margin-top: 40px;
      border-radius: 16px 16px 0 0;
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
      .section { break-inside: avoid; }
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
        <h1><span class="emoji">🏗️</span>Relatório de Obra</h1>
        <h2>${work.title}</h2>
        <p class="header-subtitle">Leirisonda - Construção e Manutenção</p>
      </div>
    </div>

    <div class="content">

      <div class="section">
        <div class="section-header">
          <h3><span class="emoji">📋</span>Informações Gerais</h3>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Nome da Obra</div>
              <div class="info-value">${work.title}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Data de Execução</div>
              <div class="info-value">${workDate}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Localização</div>
              <div class="info-value">${work.location}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Estado Atual</div>
              <div class="info-value">
                <span class="status ${work.status}">
                  ${work.status === "completed" ? "Concluída" : work.status === "in-progress" ? "Em Progresso" : "Pendente"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3><span class="emoji">👷</span>Equipa de Trabalho</h3>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Técnicos Responsáveis</div>
              <div class="info-value">${work.technicians.join(", ") || "Não especificado"}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Viaturas Utilizadas</div>
              <div class="info-value">${work.vehicles.join(", ") || "Não especificado"}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3><span class="emoji">🔧</span>Trabalho Realizado</h3>
        </div>
        <div class="section-content">
          <div class="highlight-box">
            <div class="info-value">${work.workPerformed || "Trabalho não especificado"}</div>
          </div>
        </div>
      </div>

  ${
    work.budget || work.finalCost
      ? `
  <div class="section">
    <h3>💰 Informações Financeiras</h3>
    <div class="info-grid">
      ${
        work.budget
          ? `
      <div class="info-item">
        <div class="info-label">Valor Orçamentado</div>
        <div class="info-value">${work.budget.toFixed(2)}€</div>
      </div>
      `
          : ""
      }
      ${
        work.finalCost
          ? `
      <div class="info-item">
        <div class="info-label">Valor Final</div>
        <div class="info-value">${work.finalCost.toFixed(2)}€</div>
      </div>
      `
          : ""
      }
    </div>
  </div>
  `
      : ""
  }

  ${
    work.observations
      ? `
  <div class="section">
    <h3>📝 Observações</h3>
    <div class="info-item">
      <div class="info-value">${work.observations}</div>
    </div>
  </div>
  `
      : ""
  }

  <div class="section">
    <h3>✅ Estado da Documentação</h3>
    <div class="info-item">
      <div class="info-value">
        ${work.workSheetCompleted ? "✅ Folha de obra preenchida" : "❌ Folha de obra por preencher"}
      </div>
    </div>
  </div>

    </div>

    <div class="footer">
      <div class="footer-content">
        <h3>📞 Informações de Contacto</h3>
        <p><strong>Leirisonda - Construção e Manutenção</strong></p>
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

  const generatePDFReport = async () => {
    setIsGenerating(true);

    try {
      const workDate = format(new Date(work.date), "dd/MM/yyyy", {
        locale: pt,
      });

      // Create structured content for PDF
      const reportContent = createWorkContent();

      const pdfData = {
        type: "work" as const,
        title: `Relatório de Obra - ${work.title}`,
        subtitle: `Localização: ${work.location}`,
        date: workDate,
        content: reportContent,
        additionalInfo: `Estado: ${work.status === "completed" ? "Concluída" : work.status === "in-progress" ? "Em Progresso" : "Pendente"}`,
      };

      const htmlContent = PDFGenerator.createModernReportHTML(pdfData);

      const filename = `obra-${work.title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`;

      await PDFGenerator.generatePDFFromHTML(htmlContent, {
        title: pdfData.title,
        filename: filename,
        orientation: "portrait",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("❌ Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const createWorkContent = () => {
    return `
      <div class="section">
        <div class="section-title">👷 Equipa</div>
        <div class="info-grid">
          <div class="info-card">
            <h3>Técnicos</h3>
            <p>${work.technicians.join(", ")}</p>
          </div>
          <div class="info-card">
            <h3>Viaturas</h3>
            <p>${work.vehicles.join(", ")}</p>
          </div>
        </div>
      </div>

      ${
        work.description
          ? `
        <div class="section">
          <div class="section-title">📝 Descrição da Obra</div>
          <div class="highlight-box">
            ${work.description}
          </div>
        </div>
      `
          : ""
      }

      ${
        work.materials && work.materials.length > 0
          ? `
        <div class="section">
          <div class="section-title">🔧 Materiais Utilizados</div>
          ${work.materials
            .map(
              (material) => `
            <div class="info-card">
              <h3>${material.name}</h3>
              <p><strong>Quantidade:</strong> ${material.quantity}</p>
              ${material.supplier ? `<p><strong>Fornecedor:</strong> ${material.supplier}</p>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        work.observations
          ? `
        <div class="section">
          <div class="section-title">🔍 Observações</div>
          <div class="highlight-box">
            ${work.observations}
          </div>
        </div>
      `
          : ""
      }

      <div class="section">
        <div class="section-title">📊 Estado da Obra</div>
        <div class="info-card">
          <h3>Estado Atual</h3>
          <p>${work.status === "completed" ? "✅ Concluída" : work.status === "in-progress" ? "🔄 Em Progresso" : "⏳ Pendente"}</p>
        </div>
        ${
          work.workSheetCompleted
            ? `
          <div class="info-card">
            <h3>Folha de Obra</h3>
            <p>✅ Completa</p>
          </div>
        `
            : ""
        }
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
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Relatório de Obra
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Obra:</strong> {work.title}
            <br />
            <strong>Data:</strong>{" "}
            {format(new Date(work.date), "dd/MM/yyyy", { locale: pt })}
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
