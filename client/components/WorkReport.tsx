import React, { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  FileText,
  Download,
  Mail,
  MessageCircle,
  Copy,
  Construction,
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

  const getStatusLabel = (status: string) => {
    const labels = {
      pendente: "Pendente",
      em_progresso: "Em Progresso",
      concluida: "Concluída",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      piscina: "Piscina",
      manutencao: "Manutenção",
      avaria: "Avaria",
      montagem: "Montagem",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const calculateWorkDuration = () => {
    if (!work.entryTime || !work.exitTime) return "N/A";

    try {
      const entry = new Date(`2000-01-01 ${work.entryTime}`);
      const exit = new Date(`2000-01-01 ${work.exitTime}`);
      const diff = exit.getTime() - entry.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
    } catch {
      return "N/A";
    }
  };

  const createWorkContent = () => {
    const workDuration = calculateWorkDuration();
    const workDate = format(new Date(work.createdAt), "dd/MM/yyyy", {
      locale: pt,
    });

    return `
      <div class="section">
        <div class="section-header">
          <div class="section-title">🏗️ Informações da Obra</div>
        </div>
        <div class="section-content">
          <div class="work-info-grid">
            <div class="work-detail">
              <span class="label">Folha de Obra Nº:</span>
              <span class="value">${work.workSheetNumber}</span>
            </div>
            <div class="work-detail">
              <span class="label">Tipo de Trabalho:</span>
              <span class="value">${getTypeLabel(work.type)}</span>
            </div>
            <div class="work-detail">
              <span class="label">Estado:</span>
              <span class="value status-${work.status}">${getStatusLabel(work.status)}</span>
            </div>
            <div class="work-detail">
              <span class="label">Data de Criação:</span>
              <span class="value">${workDate}</span>
            </div>
            <div class="work-detail">
              <span class="label">Horário de Entrada:</span>
              <span class="value">${work.entryTime || "N/A"}</span>
            </div>
            <div class="work-detail">
              <span class="label">Horário de Saída:</span>
              <span class="value">${work.exitTime || "N/A"}</span>
            </div>
            <div class="work-detail">
              <span class="label">Duração Total:</span>
              <span class="value">${workDuration}</span>
            </div>
            <div class="work-detail">
              <span class="label">Folha Preenchida:</span>
              <span class="value ${work.workSheetCompleted ? "status-completed" : "status-pending"}">
                ${work.workSheetCompleted ? "✅ Sim" : "❌ Pendente"}
              </span>
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
              <span class="value">${work.clientName}</span>
            </div>
            <div class="client-detail">
              <span class="label">Morada:</span>
              <span class="value">${work.address}</span>
            </div>
            <div class="client-detail">
              <span class="label">Contacto:</span>
              <span class="value">${work.contact}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-title">👷 Equipa de Trabalho</div>
        </div>
        <div class="section-content">
          <div class="team-info">
            <div class="team-item">
              <span class="team-label">Técnicos Responsáveis:</span>
              <div class="team-list">
                ${
                  work.technicians.length > 0
                    ? work.technicians
                        .map(
                          (tech) => `<span class="team-member">${tech}</span>`,
                        )
                        .join("")
                    : '<span class="no-data">Não especificado</span>'
                }
              </div>
            </div>
            <div class="team-item">
              <span class="team-label">Viaturas Utilizadas:</span>
              <div class="team-list">
                ${
                  work.vehicles.length > 0
                    ? work.vehicles
                        .map(
                          (vehicle) =>
                            `<span class="vehicle-item">${vehicle}</span>`,
                        )
                        .join("")
                    : '<span class="no-data">Não especificado</span>'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      ${
        work.workPerformed
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">🔧 Trabalho Realizado</div>
        </div>
        <div class="section-content">
          <div class="work-performed-box">
            ${work.workPerformed.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>
      `
          : ""
      }

      ${
        work.photos && work.photos.length > 0
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">📸 Registo Fotográfico da Obra</div>
        </div>
        <div class="section-content">
          <div class="photos-grid">
            ${work.photos
              .slice(0, 8) // Limit to 8 photos
              .map(
                (photo) => `
                <div class="photo-item">
                  <div class="photo-container">
                    <img src="${photo.url}" alt="${photo.filename}" />
                  </div>
                  <div class="photo-info">
                    <div class="photo-filename">${photo.filename}</div>
                    <div class="photo-date">${format(new Date(photo.uploadedAt), "dd/MM/yyyy HH:mm", { locale: pt })}</div>
                  </div>
                </div>
              `,
              )
              .join("")}
          </div>
          <div class="photos-summary">
            <strong>Total de fotos:</strong> ${work.photos.length}
            ${work.photos.length > 8 ? ` • Mostrando 8 de ${work.photos.length} fotos` : ""}
          </div>
        </div>
      </div>
      `
          : ""
      }

      ${
        work.observations
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">📝 Observações</div>
        </div>
        <div class="section-content">
          <div class="observations-box">
            ${work.observations.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>
      `
          : ""
      }

      <div class="section">
        <div class="section-header">
          <div class="section-title">📋 Resumo Final</div>
        </div>
        <div class="section-content">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Estado da Obra</div>
              <div class="summary-value status-${work.status}">
                ${getStatusLabel(work.status)}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Documentação</div>
              <div class="summary-value ${work.workSheetCompleted ? "status-completed" : "status-pending"}">
                ${work.workSheetCompleted ? "✅ Completa" : "❌ Pendente"}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total de Fotos</div>
              <div class="summary-value">
                ${work.photos?.length || 0}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Data de Atualização</div>
              <div class="summary-value">
                ${format(new Date(work.updatedAt), "dd/MM/yyyy", { locale: pt })}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const generateHTMLReport = () => {
    const reportDate = format(new Date(), "dd/MM/yyyy", { locale: pt });
    const content = createWorkContent();

    return `
<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Obra - ${work.clientName}</title>
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

    /* Header */
    .header {
      background: linear-gradient(135deg, #b30229 0%, #8b0220 100%);
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

    /* Content */
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
      border-left: 4px solid #b30229;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .info-card .label {
      font-size: 12px;
      font-weight: 600;
      color: #b30229;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .info-card .value {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
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

    /* Work and Client Info Grids */
    .work-info-grid, .client-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .work-detail, .client-detail {
      background: #f8fafc;
      padding: 10px;
      border-radius: 6px;
      border-left: 3px solid #b30229;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .work-detail .label, .client-detail .label {
      font-size: 11px;
      font-weight: 600;
      color: #b30229;
      text-transform: uppercase;
      flex: 0 0 50%;
    }

    .work-detail .value, .client-detail .value {
      font-size: 13px;
      font-weight: 600;
      color: #1a202c;
      text-align: right;
      flex: 1;
    }

    /* Status Colors */
    .status-pendente { color: #d69e2e; }
    .status-em_progresso { color: #3182ce; }
    .status-concluida { color: #38a169; }
    .status-completed { color: #38a169; font-weight: 600; }
    .status-pending { color: #d69e2e; font-weight: 600; }

    /* Team Info */
    .team-info {
      space-y: 12px;
    }

    .team-item {
      margin-bottom: 12px;
    }

    .team-label {
      font-size: 12px;
      font-weight: 600;
      color: #4a5568;
      display: block;
      margin-bottom: 6px;
    }

    .team-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .team-member, .vehicle-item {
      background: #ebf8ff;
      border: 1px solid #90cdf4;
      color: #2b6cb0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .no-data {
      color: #a0aec0;
      font-style: italic;
      font-size: 11px;
    }

    /* Work Performed */
    .work-performed-box {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      font-size: 12px;
      line-height: 1.6;
      color: #2d3748;
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

    .photo-filename {
      font-size: 10px;
      font-weight: 500;
      color: #2d3748;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .photo-date {
      font-size: 9px;
      color: #718096;
    }

    .photos-summary {
      font-size: 11px;
      color: #4a5568;
      text-align: center;
      padding: 8px;
      background: #f7fafc;
      border-radius: 4px;
    }

    /* Observations */
    .observations-box {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      font-size: 12px;
      line-height: 1.5;
      color: #2d3748;
    }

    /* Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .summary-item {
      background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%);
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      border-left: 4px solid #b30229;
    }

    .summary-label {
      font-size: 11px;
      color: #718096;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .summary-value {
      font-size: 14px;
      font-weight: 600;
      color: #1a202c;
    }

    /* Footer */
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
          <div class="ref">REF: ${work.workSheetNumber}</div>
        </div>
      </div>

      <div class="report-title">
        <h2>Relatório de Obra</h2>
        <div class="subtitle">${work.clientName}</div>
        <div class="location">${work.address}</div>
      </div>
    </div>

    <div class="content">
      <div class="info-grid">
        <div class="info-card">
          <div class="label">Data do Relatório</div>
          <div class="value">${reportDate}</div>
        </div>
        <div class="info-card">
          <div class="label">Tipo de Obra</div>
          <div class="value">${getTypeLabel(work.type)}</div>
        </div>
        <div class="info-card">
          <div class="label">Estado Atual</div>
          <div class="value">${getStatusLabel(work.status)}</div>
        </div>
      </div>

      ${content}
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

  const generatePDFReport = async (shareMethod?: string, retryCount = 0) => {
    setIsGenerating(true);
    const maxRetries = 2;

    try {
      const workDate = format(new Date(work.createdAt), "dd/MM/yyyy", {
        locale: pt,
      });

      const htmlContent = generateHTMLReport();

      const filename = `obra-${work.clientName.toLowerCase().replace(/\s+/g, "-")}-${work.workSheetNumber}-${format(new Date(), "yyyy-MM-dd")}.pdf`;

      if (shareMethod) {
        // Generate PDF blob for sharing
        const pdfBlob = await PDFGenerator.generatePDFFromHTML(htmlContent, {
          title: `Relatório de Obra - ${work.clientName}`,
          filename: filename,
          orientation: "portrait",
        });

        await handlePDFShare(
          shareMethod,
          pdfBlob,
          `Relatório de Obra - ${work.clientName}`,
          filename,
        );
      } else {
        // Direct download
        await PDFGenerator.downloadPDF(htmlContent, {
          title: `Relatório de Obra - ${work.clientName}`,
          filename: filename,
          orientation: "portrait",
        });
      }

      // Success feedback
      if (shareMethod) {
        alert("✅ PDF gerado com sucesso!");
      }
    } catch (error) {
      console.error("PDF generation error:", error);

      // Retry logic for transient errors
      if (retryCount < maxRetries) {
        console.log(
          `Retrying PDF generation (attempt ${retryCount + 1}/${maxRetries + 1})`,
        );

        // Wait a bit before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1)),
        );

        setIsGenerating(false); // Reset state for retry
        return generatePDFReport(shareMethod, retryCount + 1);
      }

      // Show user-friendly error message
      let errorMessage = "❌ Erro ao gerar PDF.";

      if (error instanceof Error) {
        if (error.message.includes("imagens")) {
          errorMessage =
            "❌ Erro nas imagens do relatório. Verifique a conexão e tente novamente.";
        } else if (error.message.includes("muito grande")) {
          errorMessage =
            "❌ Relatório muito extenso. Tente gerar com menos fotos.";
        } else if (error.message.includes("conectividade")) {
          errorMessage =
            "❌ Problema de conexão. Verifique a internet e tente novamente.";
        } else if (error.message.includes("visual")) {
          errorMessage =
            "❌ Erro na geração visual. Tente recarregar a página.";
        } else {
          errorMessage = `❌ ${error.message}`;
        }
      }

      // Show error with retry option
      const shouldRetry = confirm(`${errorMessage}\n\n🔄 Tentar novamente?`);

      if (shouldRetry) {
        setIsGenerating(false);
        // Small delay before retry
        setTimeout(() => generatePDFReport(shareMethod, 0), 500);
        return;
      }
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
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);

          const emailSubject = encodeURIComponent(title);
          const emailBody = encodeURIComponent(
            `Segue em anexo o relatório de obra.\n\n` +
              `Cliente: ${work.clientName}\n` +
              `Morada: ${work.address}\n` +
              `Folha de Obra: ${work.workSheetNumber}\n\n` +
              `Este relatório foi gerado automaticamente pelo sistema Leirisonda.\n\n` +
              `Cumprimentos,\nEquipa Leirisonda`,
          );

          setTimeout(() => {
            window.open(
              `mailto:?subject=${emailSubject}&body=${emailBody}`,
              "_blank",
            );
          }, 500);
          break;

        case "whatsapp":
          const whatsappUrl = URL.createObjectURL(pdfBlob);
          const whatsappLink = document.createElement("a");
          whatsappLink.href = whatsappUrl;
          whatsappLink.download = filename;
          whatsappLink.click();
          URL.revokeObjectURL(whatsappUrl);

          const whatsappText = encodeURIComponent(
            `📄 Relatório de Obra - ${work.clientName}\n\n` +
              `Folha de Obra: ${work.workSheetNumber}\n` +
              `Morada: ${work.address}\n\n` +
              `Relatório em PDF descarregado. ` +
              `Gerado automaticamente pelo sistema Leirisonda.`,
          );

          setTimeout(() => {
            window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
          }, 500);
          break;

        case "copy":
          const copyUrl = URL.createObjectURL(pdfBlob);
          const copyLink = document.createElement("a");
          copyLink.href = copyUrl;
          copyLink.download = filename;
          copyLink.click();
          URL.revokeObjectURL(copyUrl);

          const summaryText = `📄 Relatório: ${title}\nCliente: ${work.clientName}\nMorada: ${work.address}\nFolha: ${work.workSheetNumber}\n\nRelatório PDF descarregado automaticamente.`;
          await navigator.clipboard.writeText(summaryText);
          alert("📋 Resumo copiado e PDF descarregado!");
          break;

        case "download":
        default:
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
            <Construction className="mr-2 h-5 w-5 text-red-600" />
            Relatório de Obra
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
            <strong>Cliente:</strong> {work.clientName}
            <br />
            <strong>Folha Nº:</strong> {work.workSheetNumber}
            <br />
            <strong>Estado:</strong> {getStatusLabel(work.status)}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => generatePDFReport("download")}
              disabled={isGenerating}
              className="w-full bg-red-600 hover:bg-red-700"
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mx-auto mb-2"></div>
              A gerar relatório PDF...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
