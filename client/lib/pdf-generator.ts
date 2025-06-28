import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFOptions {
  title: string;
  filename: string;
  orientation?: "portrait" | "landscape";
  format?: "a4" | "letter";
}

export class PDFGenerator {
  private static readonly LEIRISONDA_BLUE = "#007784";
  private static readonly LEIRISONDA_RED = "#B3022A";
  private static readonly LEIRISONDA_BLUE_LIGHT = "#EFF5F6";

  static async generatePDFFromHTML(
    htmlContent: string,
    options: PDFOptions,
  ): Promise<Blob> {
    try {
      // Create container with exact A4 dimensions
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "180mm"; // A4 width minus margins (210mm - 30mm)
      tempContainer.style.fontFamily = "Arial, sans-serif";
      tempContainer.style.fontSize = "11px";
      tempContainer.style.lineHeight = "1.3";
      tempContainer.style.color = "#2c3e50";
      tempContainer.style.background = "#ffffff";
      tempContainer.style.padding = "0";
      tempContainer.style.margin = "0";

      document.body.appendChild(tempContainer);

      // Wait for images and fonts to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate high-quality canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
          // Ensure images are loaded in cloned document
          const images = clonedDoc.querySelectorAll("img");
          images.forEach((img) => {
            img.crossOrigin = "anonymous";
          });
        },
      });

      document.body.removeChild(tempContainer);

      // Create PDF with exact A4 size
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Add metadata
      pdf.setProperties({
        title: options.title,
        subject: "Relatório Leirisonda",
        author: "Leirisonda",
        creator: "Sistema Leirisonda",
      });

      // Calculate dimensions to fit A4 exactly
      const pdfWidth = 210; // A4 width
      const pdfHeight = 297; // A4 height
      const margin = 15; // 15mm margin
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2;

      const canvasAspectRatio = canvas.width / canvas.height;
      const contentAspectRatio = contentWidth / contentHeight;

      let finalWidth, finalHeight;

      if (canvasAspectRatio > contentAspectRatio) {
        // Canvas is wider, fit to width
        finalWidth = contentWidth;
        finalHeight = contentWidth / canvasAspectRatio;
      } else {
        // Canvas is taller, fit to height or split pages
        if ((canvas.height * contentWidth) / canvas.width <= contentHeight) {
          // Fits in one page
          finalHeight = contentHeight;
          finalWidth = contentHeight * canvasAspectRatio;
        } else {
          // Needs multiple pages
          finalWidth = contentWidth;
          finalHeight = contentWidth / canvasAspectRatio;
        }
      }

      const x = margin + (contentWidth - finalWidth) / 2;
      const y = margin;

      // Add first page
      pdf.addImage(
        canvas.toDataURL("image/png", 1.0),
        "PNG",
        x,
        y,
        finalWidth,
        Math.min(finalHeight, contentHeight),
      );

      // Add additional pages if content is too tall
      if (finalHeight > contentHeight) {
        let remainingHeight = finalHeight - contentHeight;
        let currentY = contentHeight;

        while (remainingHeight > 0) {
          pdf.addPage();

          const pageHeight = Math.min(remainingHeight, contentHeight);
          const sourceY = (currentY / finalHeight) * canvas.height;
          const sourceHeight = (pageHeight / finalHeight) * canvas.height;

          // Create canvas for this page
          const pageCanvas = document.createElement("canvas");
          const ctx = pageCanvas.getContext("2d");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;

          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              sourceHeight,
              0,
              0,
              canvas.width,
              sourceHeight,
            );

            pdf.addImage(
              pageCanvas.toDataURL("image/png", 1.0),
              "PNG",
              x,
              margin,
              finalWidth,
              pageHeight,
            );
          }

          currentY += pageHeight;
          remainingHeight -= pageHeight;
        }
      }

      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Erro ao gerar PDF. Tente novamente.");
    }
  }

  static async downloadPDF(
    htmlContent: string,
    options: PDFOptions,
  ): Promise<void> {
    try {
      const pdfBlob = await this.generatePDFFromHTML(htmlContent, options);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = options.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw new Error("Erro ao fazer download do PDF.");
    }
  }

  static createModernReportHTML(data: {
    type: "work" | "maintenance";
    title: string;
    subtitle?: string;
    date: string;
    content: string;
    additionalInfo?: string;
  }): string {
    const reportDate = new Date().toLocaleDateString("pt-PT");
    const reportTime = new Date().toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const icon = data.type === "work" ? "🏗️" : "💧";
    const primaryColor =
      data.type === "work" ? this.LEIRISONDA_RED : this.LEIRISONDA_BLUE;

    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <title>${data.title}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #2c3e50;
            background: white;
            width: 180mm;
            min-height: 267mm;
          }

          .report-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          /* Modern Header */
          .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, #34495e 100%);
            color: white;
            padding: 15mm 0;
            margin-bottom: 8mm;
            border-radius: 3mm;
            position: relative;
          }

          .header::after {
            content: '';
            position: absolute;
            bottom: -3mm;
            left: 0;
            right: 0;
            height: 1mm;
            background: linear-gradient(90deg, ${primaryColor}, transparent, ${primaryColor});
          }

          .header-content {
            padding: 0 8mm;
          }

          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 6mm;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 4mm;
          }

          .logo {
            background: white;
            width: 12mm;
            height: 12mm;
            border-radius: 2mm;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2mm 8mm rgba(0,0,0,0.2);
          }

          .logo img {
            width: 8mm;
            height: 8mm;
            object-fit: contain;
          }

          .company-info h1 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 1mm;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }

          .company-info .tagline {
            font-size: 10px;
            opacity: 0.95;
            font-weight: 400;
          }

          .header-meta {
            text-align: right;
            font-size: 9px;
            line-height: 1.2;
          }

          .doc-id {
            background: rgba(255,255,255,0.2);
            padding: 1mm 2mm;
            border-radius: 2mm;
            font-weight: 600;
            margin-top: 1mm;
            display: inline-block;
            font-size: 8px;
          }

          .report-title {
            border-top: 0.5mm solid rgba(255,255,255,0.3);
            padding-top: 4mm;
          }

          .report-title h2 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 1mm;
            display: flex;
            align-items: center;
            gap: 2mm;
          }

          .report-title .subtitle {
            font-size: 10px;
            opacity: 0.9;
          }

          /* Content */
          .content {
            flex: 1;
            padding: 0 0 5mm 0;
          }

          .info-header {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 3mm;
            margin-bottom: 6mm;
          }

          .info-card {
            background: #f8f9fa;
            border: 0.3mm solid #e9ecef;
            border-radius: 2mm;
            padding: 3mm;
            border-left: 1mm solid ${primaryColor};
          }

          .info-card .label {
            font-size: 8px;
            font-weight: 600;
            color: ${primaryColor};
            margin-bottom: 1mm;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .info-card .value {
            font-size: 11px;
            font-weight: 600;
            color: #2c3e50;
          }

          .section {
            margin-bottom: 6mm;
            background: white;
            border: 0.3mm solid #e9ecef;
            border-radius: 2mm;
            overflow: hidden;
          }

          .section-header {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 3mm;
            border-bottom: 0.3mm solid #e9ecef;
          }

          .section-title {
            font-size: 12px;
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
          }

          .section-content {
            padding: 3mm;
          }

          .highlight-box {
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
            border: 0.5mm solid ${primaryColor}40;
            border-radius: 2mm;
            padding: 3mm;
            margin: 3mm 0;
          }

          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 2mm 0;
            font-size: 10px;
          }

          .data-table th {
            background: ${primaryColor};
            color: white;
            padding: 2mm;
            text-align: left;
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
          }

          .data-table td {
            padding: 2mm;
            border-bottom: 0.3mm solid #e9ecef;
          }

          .data-table tr:nth-child(even) {
            background: #f8f9fa;
          }

          .enhanced-list {
            list-style: none;
            padding: 0;
            margin: 2mm 0;
          }

          .enhanced-list li {
            background: #f8f9fa;
            border: 0.3mm solid #e9ecef;
            border-radius: 1.5mm;
            padding: 2mm;
            margin-bottom: 1mm;
            font-size: 10px;
          }

          .enhanced-list li::before {
            content: '✓ ';
            color: ${primaryColor};
            font-weight: bold;
          }

          /* Footer */
          .footer {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 4mm;
            margin-top: auto;
            border-radius: 2mm;
          }

          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2mm;
          }

          .footer-logo {
            font-size: 14px;
            font-weight: 700;
          }

          .footer-contact {
            text-align: right;
            font-size: 9px;
            line-height: 1.3;
          }

          .footer-bottom {
            border-top: 0.3mm solid rgba(255,255,255,0.2);
            padding-top: 2mm;
            text-align: center;
            font-size: 8px;
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="header-content">
              <div class="header-top">
                <div class="logo-section">
                  <div class="logo">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=200" alt="Leirisonda Logo" crossorigin="anonymous" />
                  </div>
                  <div class="company-info">
                    <h1>Leirisonda</h1>
                    <div class="tagline">Gestão Profissional de Obras e Manutenção</div>
                  </div>
                </div>
                <div class="header-meta">
                  <div><strong>Data:</strong> ${reportDate}</div>
                  <div><strong>Hora:</strong> ${reportTime}</div>
                  <div class="doc-id">DOC-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}</div>
                </div>
              </div>

              <div class="report-title">
                <h2>${icon} ${data.title}</h2>
                ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ""}
              </div>
            </div>
          </div>

          <div class="content">
            <div class="info-header">
              <div class="info-card">
                <div class="label">Data do Relatório</div>
                <div class="value">${reportDate}</div>
              </div>
              <div class="info-card">
                <div class="label">Data de Referência</div>
                <div class="value">${data.date}</div>
              </div>
              <div class="info-card">
                <div class="label">Documento</div>
                <div class="value">REL-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}</div>
              </div>
            </div>

            ${
              data.additionalInfo
                ? `
              <div class="highlight-box">
                <strong>Informação Adicional:</strong> ${data.additionalInfo}
              </div>
            `
                : ""
            }

            <div>${data.content}</div>
          </div>

          <div class="footer">
            <div class="footer-content">
              <div class="footer-logo">Leirisonda</div>
              <div class="footer-contact">
                <div><strong>Email:</strong> info@leirisonda.pt</div>
                <div><strong>Tel:</strong> (+351) 000 000 000</div>
                <div><strong>Web:</strong> leirisonda.pt</div>
              </div>
            </div>
            <div class="footer-bottom">
              <div>© ${new Date().getFullYear()} Leirisonda - Todos os direitos reservados.</div>
              <div>Documento gerado automaticamente pelo Sistema de Gestão Leirisonda</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
